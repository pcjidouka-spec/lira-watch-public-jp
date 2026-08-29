import React from 'react';
import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticProps } from 'next';

interface LegData {
  provider_id: string;
  name: string;
  swap: number;
  as_of: string;
  actual_date: string | null;
}

interface TopEntry {
  rank: number;
  pair: string;
  buy: LegData;
  sell: LegData;
  arb_per_day: number;
  notional_2leg: number;
  capital: number;
  annual_pct: number;
  meets_threshold: boolean;
  history: {
    recent: HistStats | null;
    all: HistStats | null;
    first_date: string;
    last_date: string;
    step_count: number;
    last_step: {
      date: string;
      side: string;
      provider_id: string;
      name: string;
      change_pct: number;
    } | null;
    quiet_median_pct: number | null;
  } | null;
}

interface HistStats {
  days: number;
  min_pct: number;
  max_pct: number;
  avg_pct: number;
  median_pct: number;
}

interface ArbitrageData {
  generated_at: string;
  leverage: number;
  threshold_pct: number;
  rate_stale: boolean;
  rate_as_of: string;
  excluded_providers: string[];
  excluded_pairs: { pair: string; reason: string }[];
  top: TopEntry[];
}

interface Props {
  data: ArbitrageData | null;
}

const yen = (v: number) =>
  v.toLocaleString('ja-JP', { maximumFractionDigits: 2 });

export default function ArbitragePage({ data }: Props) {
  // top は常に描画する。全件が基準未満のときだけバナーを「追加で」出す。
  const noneMeet =
    !!data && data.top.length > 0 && data.top.every((t) => !t.meets_threshold);

  return (
    <>
      <Head>
        <title>スワップ裁定ランキング | トルコリラ・ウォッチ</title>
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
            <h1>スワップ裁定ランキング</h1>
            <p className="lead">
              同じ通貨ペアを、買スワップが最も高い業者で買い、売スワップが最も有利な業者で売ると、
              為替の値動きは相殺されてスワップの差額だけが残ります。
              その差額が大きい組み合わせを、当サイトが毎日集計しているデータから算出したものです。
            </p>

            {!data ? (
              <p className="empty">データを読み込めませんでした。</p>
            ) : (
              <>
                <p className="meta">
                  集計 {data.generated_at}
                  {data.rate_stale && (
                    <span className="stale">
                      　※為替レートが最新ではありません（{data.rate_as_of} 時点）
                    </span>
                  )}
                </p>

                {noneMeet && (
                  <p className="banner">
                    今週は年率{data.threshold_pct}％を超える組み合わせがありませんでした。
                  </p>
                )}

                {data.top.length === 0 ? (
                  <p className="empty">
                    今回は成立する組み合わせが見つかりませんでした。
                  </p>
                ) : (
                  <div className="table-scroll">
                    <table className="arb-table">
                      <thead>
                        <tr>
                          <th>順位</th>
                          <th>通貨ペア</th>
                          <th>買う業者</th>
                          <th>売る業者</th>
                          <th>裁定益/日</th>
                          <th>必要資本</th>
                          <th>年率</th>
                          <th>推移</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.top.map((t) => (
                          <tr key={t.pair}>
                            <td>{t.rank}</td>
                            <td className="pair">{t.pair}</td>
                            <td>
                              {t.buy.name}
                              <span className="swap">{yen(t.buy.swap)}</span>
                            </td>
                            <td>
                              {t.sell.name}
                              <span className="swap">{yen(t.sell.swap)}</span>
                            </td>
                            <td className="num">{yen(t.arb_per_day)}円</td>
                            <td className="num">{yen(Math.round(t.capital))}円</td>
                            <td className="num">
                              <strong
                                className={t.meets_threshold ? 'ok' : 'warn'}
                              >
                                {t.annual_pct.toFixed(1)}％
                              </strong>
                            </td>
                            <td className="num hist">
                              {t.history && t.history.recent ? (
                                <>
                                  {t.history.recent.min_pct.toFixed(1)}〜
                                  {t.history.recent.max_pct.toFixed(1)}％
                                  <span className="swap">
                                    平均 {t.history.recent.avg_pct.toFixed(1)}％ /
                                    直近{t.history.recent.days}営業日
                                  </span>
                                </>
                              ) : (
                                '—'
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <p className="unit-note">
                  数量は1万通貨・1日あたりに揃えています（HUF/JPY は各社10万通貨単位で
                  公表されているため換算済み）。日付は各社の最新の付与日で、
                  業者により前営業日の値が含まれます。「年率」は最新日のスワップ提示を
                  年率換算した値、「推移」は同じ計算を過去の各営業日に当てはめた実測の
                  振れ幅です。
                </p>
                <p className="unit-note">
                  ★<strong>スワップ水準は毎日じわじわ動くのではなく、長い横ばいと
                  不定期の「段差」でできています。</strong>
                  段差が起きた日に利回りが一段変わり、その後はしばらく同じ水準が続きます。
                  最新日の数字だけを期待値と考えず、「推移」の幅と直近の段差を見てください。
                </p>
                <div className="steps">
                  {data.top.map((t) =>
                    t.history && t.history.last_step ? (
                      <p key={t.pair} className="step-line">
                        <strong>{t.pair}</strong>：観測{t.history.all?.days}営業日で
                        段差{t.history.step_count}回。直近は{' '}
                        {t.history.last_step.date} に{t.history.last_step.name}の
                        {t.history.last_step.side === 'buy' ? '買' : '売'}が{' '}
                        {t.history.last_step.change_pct > 0 ? '+' : ''}
                        {t.history.last_step.change_pct}％。
                        {t.history.quiet_median_pct !== null && (
                          <>
                            {' '}
                            段差以外の日の変化は中央値{t.history.quiet_median_pct}％。
                          </>
                        )}
                      </p>
                    ) : null
                  )}
                </div>

                <section className="arb-about">
                  <h2>この数字の読み方</h2>
                  <ul>
                    <li>
                      <strong>必要資本はレバレッジ{data.leverage}倍・証拠金のみで計算しています。</strong>
                      値動きによる証拠金の変動は、その都度業者間で資金を移す前提で
                      資本に含めていません。
                    </li>
                    <li>
                      <strong>
                        この資本額はペア間を比較するための共通のものさしです。
                      </strong>
                      各社の実際の必要証拠金とは異なります。エキゾチックな通貨ペアは
                      レバレッジの上限が低く設定されている場合があります。
                    </li>
                    <li>
                      <strong>異なる業者をまたぐ両建てについては、必ず各社の取引規約を確認してください。</strong>
                      国内業者同士でも「不当な取引」に関する条項が置かれている場合があります。
                    </li>
                    <li>
                      <strong>利回りの源泉が1社のスワップ設定である場合、いつ消えてもおかしくありません。</strong>
                      その業者が水準を他社並みに戻せば、裁定余地は即座に消えます。
                    </li>
                    <li>
                      <strong>証拠金は業者間で相殺されません。</strong>
                      為替が動くと片方の口座の評価損が先に膨らみ、もう片方の評価益を
                      移すまでロスカットが起きうるため、値動きが完全に相殺されるのは
                      あくまで理論上の話です。
                    </li>
                    <li>
                      証拠金が一方向に移動し続けるため、定期的に業者間で資金を移し替える
                      手間が必要です。
                    </li>
                    <li>
                      サクソバンク証券は集計の対象外にしています。
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
           いる (strength.tsx / privacy.tsx / contact.tsx と同じ構成)。
           ここを書かないと中央寄せもヘッダーの装飾も効かず、素の左寄せになる。
           feedback_hp_verification_pitfalls の Anti-pattern そのもの。 */
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
        /* 見出しの装飾は本文カードの中だけに効かせる。素の h1 に当てると
           ヘッダーの .site-title にも border-bottom が乗り、グラデーション
           ヘッダーの中に白い下線が出る。 */
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
        .stale {
          color: #b45309;
          font-weight: 700;
        }
        .banner {
          background: #fffbeb;
          border: 1px solid #fcd34d;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 14px;
          margin-bottom: 14px;
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
          min-width: 640px;
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
        .warn {
          color: #4b5563;
          font-size: 16px;
        }
        .hist {
          font-size: 13px;
          color: #4b5563;
        }
        .steps {
          margin-top: 4px;
        }
        .step-line {
          font-size: 12px;
          color: #6b7280;
          line-height: 1.8;
          margin: 0 0 2px 0;
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
          /* 狭い画面ではカードの余白を削って表に幅を回す。
             40px のままだと左右で 80px が余白に消える。 */
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
  // public/data/arbitrage.json は週次タスクが生成する。
  // ビルド時に読むだけで、外部 API には触れない。
  const file = path.join(process.cwd(), 'public', 'data', 'arbitrage.json');
  let data: ArbitrageData | null = null;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    data = null;
  }
  return { props: { data } };
};
