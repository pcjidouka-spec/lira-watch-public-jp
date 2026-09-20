import React from 'react';
import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticProps } from 'next';
import { SupplyDemandDashboard, SupplyDemandData } from '@/components/SupplyDemandDashboard';

interface Props {
  data: SupplyDemandData | null;
}

export default function SupplyDemandPage({ data }: Props) {
  return (
    <>
      <Head>
        <title>通貨の需給変化ダッシュボード | トルコリラ・ウォッチ</title>
        <meta
          name="description"
          content="米ドル・日本円・ユーロ・スイスフラン・豪ドル・南アフリカランド・メキシコペソの需給（投機筋のポジション）が、いつ急に変化したかを時系列で示すダッシュボードです。急変した区間を背景色で示し、現在進行中かどうかも表示します。出典は CFTC の Commitments of Traders（週次）。"
        />
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
            <h1>通貨の需給変化ダッシュボード</h1>
            <p className="lead">
              「今どの通貨が強いか」ではなく、
              <strong>需給がいつ急に変わったのか</strong>を見るための画面です。
              投機筋のポジションの傾きが普段より大きくなった区間を背景色で示します。
            </p>

            {data ? (
              <>
                <SupplyDemandDashboard data={data} />

                <section className="sd-about">
                  <h2>この画面の読み方</h2>
                  <ul>
                    <li>
                      縦軸の<strong>需給</strong>は「投機筋の買い建てと売り建ての差 ÷
                      その通貨の総建玉」です。プラスなら買いに傾いていて、マイナスなら
                      売りに傾いています。総建玉で割っているので、市場規模が
                      {' '}<strong>134倍</strong>ちがう通貨どうしでも同じ物差しで比べられます。
                    </li>
                    <li>
                      背景色が付いた区間は、<strong>需給の変化の速さ</strong>が
                      その通貨の過去2年と比べて異常だった週です。
                      値が高い・低いことではなく、<strong>変化が急だったこと</strong>を示します。
                    </li>
                    <li>
                      <strong>赤</strong>は買い方向への急変、<strong>青</strong>は売り方向への
                      急変です。色が濃いほど変化が大きかったことを表します。
                    </li>
                    <li>
                      判定は、直近{' '}
                      {data.method.slope.replace('直近 ', '').replace(' の最小二乗回帰の傾き', '')}
                      {' '}で引いた傾きを、{data.method.score} と比べて行っています。
                      注意 = z {data.method.stages.caution} 以上、警戒 ={' '}
                      {data.method.stages.warning} 以上、急変 = {data.method.stages.surge} 以上です。
                    </li>
                    <li>
                      <strong>何に対する需給か。</strong>
                      {data.basis_note}
                    </li>
                    <li>
                      ★<strong>背景色の帯は、傾きが測っている期間に合わせて
                      {data.method.band_shift_weeks}週ぶん左に寄せています。</strong>
                      傾きは「直近6週の変化」なので、ずらさないと
                      <strong>変化が起きた期間ではなく、その直後</strong>に色が付きます。
                      縦線（区間の始まり）は<strong>ずらしていません</strong>。
                      そこが「変化を検出できた週」です。
                      なお、この寄せのぶん<strong>直近{data.method.band_shift_weeks}週には帯が付きません</strong>。
                      いまの状態は右端の丸い点で見てください。
                    </li>
                    <li>
                      <strong>現在地点</strong>は、各通貨のグラフの
                      <strong>右端の丸い点</strong>と、上の帯の
                      <strong>右端の細い印</strong>です。いまの段階の色が付きます。
                      <strong>区間の始まり</strong>には縦線を引いています。
                    </li>
                    <li>
                      帯（上の「どの通貨で同時に起きたか」）は<strong>警戒以上だけ</strong>を並べています。
                      注意（変化拡大）は数が多いため、各行の右端と、下のグラフの背景にだけ出します。
                      また<strong>1 週だけの区間は 1 区間ぶんの幅</strong>で描いています
                      （幅ゼロだと何も見えないため）。
                    </li>
                    <li>
                      <strong>反転</strong>は、警戒以上の区間の向きが
                      <strong>直前の警戒以上の区間と逆</strong>になったことを指します。
                      間に通常の週が何週挟まっていてもかまいません。
                      上の帯では黄色い上線で示しています。
                    </li>
                    <li>
                      <strong>判定に未来の値は使っていません。</strong>
                      各週の判定には、その週より前のデータだけを使っています。
                    </li>
                  </ul>

                  <h2>この画面にできないこと</h2>
                  <ul>
                    <li>
                      <strong>値動きの予測はできません。</strong>
                      {data.nature_note}
                    </li>
                    <li>
                      <strong>誤検知の少なさは保証できません。</strong>
                      「本当に急変だった週」の正解表を作っていないため、
                      見逃しと誤検知の割合は測っていません。
                      この画面は見逃しを減らす側に寄せています。
                    </li>
                    <li>
                      <strong>リアルタイムではありません。</strong>
                      {data.lag_note}
                    </li>
                  </ul>

                  <h2>データについて</h2>
                  <p>
                    出典：
                    <a href={data.source_url} target="_blank" rel="noopener noreferrer">
                      {data.source}
                    </a>
                    （米商品先物取引委員会）。毎週火曜時点のポジションを金曜に公表しています。
                    データが最後に変わったのは {data.generated_at}、
                    このページを組んだのは {data.built_at} です。
                  </p>
                </section>
              </>
            ) : (
              <p>ダッシュボードのデータをまだ生成していません。</p>
            )}

            <p className="back-link">
              <Link href="/">← スワップポイント比較トップへ</Link>
            </p>
          </div>
        </main>
      </div>

      <style jsx>{`
        /* ページシェルのクラスは globals.css に無く、各ページが自前で定義している
           (strength.tsx / privacy.tsx と同じ構成)。ここを書かないと中央寄せも
           ヘッダーの装飾も効かず、素の左寄せで表示される。 */
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
           ヘッダーの .site-title にも border-bottom が乗る。 */
        .content-wrapper h1 {
          font-size: 28px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 16px;
          margin-bottom: 24px;
          color: #1f2937;
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
        .sd-about {
          margin-top: 30px;
        }
        .sd-about h2 {
          font-size: 18px;
          color: #374151;
          margin-top: 28px;
          margin-bottom: 12px;
          border-left: 4px solid #764ba2;
          padding-left: 12px;
        }
        .sd-about ul {
          padding-left: 1.2em;
          margin-bottom: 0;
        }
        .sd-about li {
          line-height: 1.9;
          margin-bottom: 10px;
          color: #4b5563;
        }
        .back-link {
          margin-top: 28px;
        }
        @media (max-width: 720px) {
          .main-content {
            padding: 20px 10px;
          }
          .content-wrapper {
            padding: 20px 12px;
          }
          .content-wrapper h1 {
            font-size: 21px;
            padding-bottom: 12px;
            margin-bottom: 16px;
          }
          .lead {
            font-size: 14px;
          }
          .sd-about li {
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
}

/**
 * ブラウザへ送る週数の上限。
 * ★ディスクの supply_demand.json は全履歴 (約 5.7 年) を持つ。これはデータの正本なので削らない。
 *   一方ページの props は __NEXT_DATA__ に丸ごと埋まるため、全履歴を渡すと 136kB になり
 *   Next.js の閾値 (128kB) を超える。画面のタブは最長 3 年なので、そこまでに絞る。
 * ★z-score の基準期間 (104 週) はビルド前に Python 側で計算済み。ここで削っても判定は変わらない。
 */
const DISPLAY_WEEKS = 157;

/** as_of から数えた日数。★ビルド時刻から計算するので、JSON を書き直さなくても新しくなる。 */
function ageInDays(asOf: string | null, now: Date): number | null {
  if (!asOf) return null;
  const parsed = Date.parse(`${asOf}T00:00:00Z`);
  if (!Number.isFinite(parsed)) return null;
  const days = Math.floor((now.getTime() - parsed) / 86400000);
  return Number.isFinite(days) ? days : null;
}

/**
 * ★JSON の形を信用しない。
 *  `getStaticProps` の try/catch は `JSON.parse` の失敗しか拾わない。
 *  `gaps` や `stale_currencies` だけ欠けた JSON は素通りし、
 *  描画中の例外 -> `next build` 失敗 -> 日次の `[10/10] update site` は -Fatal なので
 *  ★日次全体が落ちる。欠けていたら空で埋めて、画面は出す。
 */
function normalize(raw: any): SupplyDemandData | null {
  if (!raw || typeof raw !== 'object') return null;
  if (!Array.isArray(raw.currencies) || raw.currencies.length === 0) return null;
  return {
    ...raw,
    stale_currencies: Array.isArray(raw.stale_currencies) ? raw.stale_currencies : [],
    gaps: Array.isArray(raw.gaps) ? raw.gaps : [],
    unavailable: Array.isArray(raw.unavailable) ? raw.unavailable : [],
    stale_after_days: typeof raw.stale_after_days === 'number' ? raw.stale_after_days : 12,
    lag_note: raw.lag_note ?? '',
    nature_note: raw.nature_note ?? '',
    basis_note: raw.basis_note ?? '',
    // ★価格の重ね描き関連 (0006)。欠けていても画面は出す。
    price: raw.price ?? { source: '', source_url: '', start: '', basis: '', note: '' },
    price_unavailable: Array.isArray(raw.price_unavailable) ? raw.price_unavailable : [],
    price_warnings: Array.isArray(raw.price_warnings) ? raw.price_warnings : [],
    currencies: raw.currencies.map((c: any) => ({
      ...c,
      points: Array.isArray(c.points) ? c.points : [],
      episodes: Array.isArray(c.episodes) ? c.episodes : [],
      bands: Array.isArray(c.bands) ? c.bands : [],
      current: c.current ?? { stage: null, dir: 0, z: null, date: null, active: false },
      stats: c.stats ?? { weeks: 0, first: '', mean_open_interest: null },
    })),
  } as SupplyDemandData;
}

function trim(data: SupplyDemandData, now: Date): SupplyDemandData {
  const currencies = data.currencies.map((c) => {
    const points = c.points.slice(-DISPLAY_WEEKS);
    const from = points.length > 0 ? points[0].d : '';
    return {
      ...c,
      points,
      // 期間の外で終わった区間は落とす。またがる区間は残す (描画側で左端に丸める)。
      episodes: c.episodes.filter((e) => e.end >= from),
      bands: c.bands.filter((b) => b.end >= from),
    };
  });
  return {
    ...data,
    currencies,
    as_of_age_days: ageInDays(data.as_of, now),
    built_at: now.toISOString().slice(0, 10),
  };
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  // public/data/supply_demand.json は supply_demand/build_json.py が生成する。
  // ビルド時に読むだけで、外部へは取りに行かない (CFTC 側の障害でビルドを落とさない)。
  const file = path.join(process.cwd(), 'public', 'data', 'supply_demand.json');
  let data: SupplyDemandData | null = null;
  try {
    const parsed = normalize(JSON.parse(fs.readFileSync(file, 'utf-8')));
    data = parsed ? trim(parsed, new Date()) : null;
  } catch {
    data = null;
  }
  return { props: { data } };
};
