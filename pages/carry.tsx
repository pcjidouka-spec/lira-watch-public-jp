import React from 'react';
import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticProps } from 'next';

interface ProviderRef {
  provider_id: string;
  name: string;
  group: string;
  swap: number;
  as_of?: string;
}

interface HistStats {
  days: number;
  min_pct: number;
  max_pct: number;
  avg_pct: number;
  median_pct: number;
}

interface Payback {
  days: number | null;
  reason: string | null;
  condition: string | null;
}

interface CarryEntry {
  rank: number;
  currency: string;
  policy_rate: number;
  policy_rate_as_of: string;
  fx_rate: number;
  policy_implied_carry: number;
  best: ProviderRef;
  payout_ratio_pct: number;
  median_swap: number;
  second: ProviderRef | null;
  provider_count: number;
  outlier: boolean;
  payback: Payback | null;
  history: HistStats | null;
}

interface CarryData {
  generated_at: string;
  units: number;
  units_note: string;
  day_count: number;
  jpy_policy_rate: number;
  jpy_rate_as_of: string;
  rate_source: string;
  fx_as_of: string;
  spread_manual_as_of?: string | null;
  excluded: { currency: string; reason: string }[];
  ranking: CarryEntry[];
}

interface Props {
  data: CarryData | null;
  // ビルド時の日付。generated_at が当日かどうかの判定に使う。
  built_on: string;
}

const num = (v: number, digits = 2) =>
  v.toLocaleString('ja-JP', { maximumFractionDigits: digits });

export default function CarryPage({ data, built_on }: Props) {
  // generated_at は "YYYY-MM-DD HH:MM:SS"。先頭10文字が日付。
  const generatedDay = data ? data.generated_at.slice(0, 10) : '';
  const stale = !!data && generatedDay !== built_on;

  // ★スワップの最新取得日。load_legs() は業者ごとの最新行を 2 営業日以内で
  //   返すので、1 位が古い値で決まりうる (実測 2026-09-03: HUF の最良は
  //   2026-08-31 の値だった)。振る舞いは既存の裁定ランキングと同じなので
  //   変えず、どの行が古いかを読み手に伝える。
  const latestSwapDay = data
    ? data.ranking.reduce(
        (acc: string, r: Row) => (r.best.as_of && r.best.as_of > acc ? r.best.as_of : acc),
        ''
      )
    : '';

  return (
    <>
      <Head>
        <title>スワップ還元率ランキング | トルコリラ・ウォッチ</title>
        {/* 目立たせない方針のため検索には出さない */}
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="container">
        <header className="header">
          <div className="header-content">
            <Link href="/" className="site-title-link">
              <h1 className="site-title">トルコリラ・ウォッチ</h1>
            </Link>
          </div>
        </header>

        <main className="main-content">
          <div className="content-wrapper">
            <h1>スワップ還元率ランキング</h1>
            <p className="lead">
              各通貨の政策金利と日本の政策金利の差から素直に期待される受取額を計算し、
              実際に業者が提示しているスワップがその何％にあたるかを並べたものです。
              数字が大きいほど、金利差から想像されるより厚いスワップが出ていることになります。
            </p>

            {!data ? (
              <p className="empty">データを読み込めませんでした。</p>
            ) : (
              <>
                <p className="meta">
                  集計 {data.generated_at}
                  {stale && (
                    <span className="stale">
                      　※本日のデータではありません（{generatedDay} 時点）
                    </span>
                  )}
                </p>

                {data.ranking.length === 0 ? (
                  <p className="empty">
                    今回は集計できた通貨がありませんでした。
                  </p>
                ) : (
                  <div className="table-scroll">
                    <table className="arb-table">
                      <thead>
                        <tr>
                          <th>順位</th>
                          <th>通貨</th>
                          <th>最良業者</th>
                          <th>実際のスワップ</th>
                          <th>政策金利ベースの目安</th>
                          <th>政策金利還元率</th>
                          <th>中央値</th>
                          <th>2位</th>
                          <th>社数</th>
                          <th>スプレッド回収</th>
                          <th>政策金利(as of)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.ranking.map((r) => (
                          <tr key={r.currency}>
                            <td>{r.rank}</td>
                            <td className="pair">
                              {r.currency}
                              {r.outlier && (
                                <span className="badge">1社突出</span>
                              )}
                            </td>
                            <td>
                              {r.best.name}
                              {r.best.as_of && (
                                <span
                                  className={
                                    r.best.as_of === latestSwapDay
                                      ? 'swap'
                                      : 'swap old-quote'
                                  }
                                >
                                  {r.best.as_of} 時点
                                  {r.best.as_of !== latestSwapDay && '（最新日ではありません）'}
                                </span>
                              )}
                            </td>
                            <td className="num">{num(r.best.swap)}円</td>
                            <td className="num">
                              {num(r.policy_implied_carry)}円
                            </td>
                            <td className="num">
                              <strong className="ok">
                                {r.payout_ratio_pct.toFixed(1)}％
                              </strong>
                              {r.history && (
                                <span className="swap">
                                  {r.history.min_pct.toFixed(1)}〜
                                  {r.history.max_pct.toFixed(1)}％ /
                                  直近{r.history.days}営業日
                                </span>
                              )}
                            </td>
                            <td className="num">{num(r.median_swap)}円</td>
                            <td className="num hist">
                              {r.second ? (
                                <>
                                  {num(r.second.swap)}円
                                  <span className="swap">{r.second.name}</span>
                                </>
                              ) : (
                                <>
                                  —
                                  <span className="swap">2位なし</span>
                                </>
                              )}
                            </td>
                            <td className="num">{r.provider_count}社</td>
                            <td className="num hist">
                              {r.payback && r.payback.days !== null ? (
                                <>
                                  約{r.payback.days}日
                                  {r.payback.condition && (
                                    <span className="swap">
                                      {r.payback.condition}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <>
                                  —
                                  <span className="swap">
                                    {(r.payback && r.payback.reason) ||
                                      'スプレッド未取得'}
                                  </span>
                                  {r.payback && r.payback.condition && (
                                    <span className="swap">
                                      {r.payback.condition}
                                    </span>
                                  )}
                                </>
                              )}
                            </td>
                            <td className="num hist">
                              {num(r.policy_rate)}％
                              <span className="swap">
                                {r.policy_rate_as_of}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <p className="unit-note">
                  数量は{data.units_note}（1日あたり）。日本の政策金利は
                  {num(data.jpy_policy_rate)}％（{data.jpy_rate_as_of} 時点、
                  出所 {data.rate_source}）、為替レートは {data.fx_as_of} 時点の
                  ものを使っています。
                </p>

                {data.spread_manual_as_of && (
                  <p className="unit-note">
                    ★スプレッドの一部は週次の自動取得では拾えないため、
                    {data.spread_manual_as_of} 時点で手作業で控えた値を使っています。
                    各社が条件を変えている場合、実際の値と異なることがあります。
                  </p>
                )}

                {data.excluded && data.excluded.length > 0 && (
                  <section className="arb-about">
                    <h2>除外された通貨と理由</h2>
                    <ul>
                      {data.excluded.map((e) => (
                        <li key={e.currency}>
                          <strong>{e.currency}</strong>：{e.reason}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <section className="arb-about">
                  <h2>この数字の読み方</h2>
                  <ul>
                    <li>
                      <strong>
                        「政策金利ベースの目安」は、あるべきスワップの水準を示すものではありません。
                      </strong>
                      政策金利は中央銀行が示す政策意図の系列で、実際のスワップは
                      銀行間のトムネ金利と各業者のマージンで決まります。両者は別のもので、
                      ずれているからといってどちらかが間違っているわけではありません。
                    </li>
                    <li>
                      <strong>
                        100％を超えるのは「政策金利差から素直に期待される額より多い」という意味です。
                      </strong>
                      得か損かの判定ではなく、金利差に対してスワップが厚いか薄いかを
                      通貨どうしで比べるためのものさしです。
                    </li>
                    <li>
                      <strong>日数基準は全通貨 {data.day_count} で統一しています。</strong>
                      実務では ACT/360 で計算される通貨があり、その通貨では約1.4％ぶん
                      本ページの数字が小さめに出ます。
                    </li>
                    <li>
                      <strong>順位は各通貨の最良業者のスワップで決めています。</strong>
                      1社だけが突出していると順位が実態より高く見えるため、
                      全社の中央値も併記しています。「1社突出」のバッジが付いた通貨は、
                      中央値との差を必ず見てください。
                    </li>
                    <li>
                      <strong>1社のスワップ設定が源泉である場合、いつ消えてもおかしくありません。</strong>
                      その業者が水準を他社並みに戻せば、還元率は一気に下がります。
                    </li>
                    <li>
                      政策金利は不定期にしか動かず、スワップは日々動きます。
                      還元率の変化は、多くの場合スワップ側の変化を映しています。
                    </li>
                  </ul>
                </section>

                <p className="disclaimer">
                  本ページは当サイトが集計した公開データにもとづく試算であり、特定の取引を
                  推奨するものではありません。スワップポイントは各社の判断で日々変動し、
                  記載の水準が続く保証はありません。投資判断はご自身の責任でお願いします。
                </p>
              </>
            )}

            <p className="back-link">
              <Link href="/">← スワップポイント比較トップへ</Link>
            </p>
          </div>
        </main>
      </div>

      <style jsx>{`
        /* ページシェルのクラスは globals.css に無く、各ページが自前で定義して
           いる (arbitrage.tsx / strength.tsx と同じ構成)。 */
        .container {
          min-height: 100vh;
          background: #f9fafb;
          display: flex;
          flex-direction: column;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          text-align: center;
        }
        .site-title {
          font-size: 24px;
          font-weight: 700;
          margin: 0;
          color: white;
          cursor: pointer;
        }
        .site-title-link {
          text-decoration: none;
        }
        .main-content {
          flex: 1;
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 20px;
          width: 100%;
          box-sizing: border-box;
        }
        .content-wrapper {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .content-wrapper h1 {
          font-size: 28px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 16px;
          margin-bottom: 24px;
          color: #1f2937;
        }
        .content-wrapper h2 {
          font-size: 20px;
          color: #374151;
          margin-top: 32px;
          margin-bottom: 16px;
          border-left: 4px solid #764ba2;
          padding-left: 12px;
        }
        .content-wrapper p {
          line-height: 1.8;
          color: #4b5563;
          margin-bottom: 16px;
        }
        .lead {
          line-height: 1.9;
          margin-bottom: 20px;
        }
        .meta {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 12px;
        }
        .old-quote {
          color: #c2410c;
          font-weight: 600;
        }
        .stale {
          color: #b45309;
          font-weight: 700;
        }
        .empty {
          color: #6b7280;
        }
        .table-scroll {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .arb-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
          min-width: 900px;
        }
        .arb-table th,
        .arb-table td {
          border: 1px solid #e5e7eb;
          padding: 10px 12px;
          text-align: left;
          vertical-align: top;
        }
        .arb-table th {
          background: #f3f4f6;
          color: #374151;
          font-weight: 700;
          white-space: nowrap;
        }
        .arb-table tbody tr:nth-child(even) {
          background: #fafafa;
        }
        .pair {
          font-weight: 700;
          white-space: nowrap;
          color: #1f2937;
        }
        .badge {
          display: block;
          margin-top: 4px;
          font-size: 11px;
          font-weight: 700;
          color: #b45309;
          background: #fffbeb;
          border: 1px solid #fcd34d;
          border-radius: 4px;
          padding: 1px 5px;
        }
        .num {
          text-align: right;
          white-space: nowrap;
        }
        .swap {
          display: block;
          font-size: 12px;
          color: #6b7280;
        }
        .ok {
          color: #dc2626;
          font-size: 16px;
        }
        .hist {
          font-size: 13px;
          color: #4b5563;
        }
        .unit-note {
          font-size: 12px;
          color: #6b7280;
          margin-top: 10px;
          line-height: 1.8;
        }
        .arb-about {
          margin-top: 28px;
        }
        .arb-about h2 {
          font-size: 18px;
          margin-bottom: 10px;
        }
        .arb-about ul {
          padding-left: 1.2em;
        }
        .arb-about li {
          line-height: 1.9;
          margin-bottom: 8px;
          color: #4b5563;
        }
        .disclaimer {
          margin-top: 20px;
          font-size: 12px;
          color: #6b7280;
          line-height: 1.8;
        }
        .back-link {
          margin-top: 28px;
        }
        @media (max-width: 600px) {
          .main-content {
            padding: 20px 10px;
          }
          .content-wrapper {
            padding: 20px 12px;
          }
          .content-wrapper h1 {
            font-size: 22px;
            padding-bottom: 12px;
            margin-bottom: 16px;
          }
          .content-wrapper h2 {
            font-size: 17px;
          }
          .lead,
          .arb-about li {
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  // public/data/carry.json は日次パイプラインがデプロイ直前に生成する。
  // ★まだ生成されていない段階でも npm run build が通るよう、必ず null に倒す。
  const file = path.join(process.cwd(), 'public', 'data', 'carry.json');
  let data: CarryData | null = null;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    data = null;
  }
  // ビルド日を JST で持っておき、generated_at が当日かの判定に使う。
  const built_on = new Date(Date.now() + 9 * 3600 * 1000)
    .toISOString()
    .slice(0, 10);
  return { props: { data, built_on } };
};
