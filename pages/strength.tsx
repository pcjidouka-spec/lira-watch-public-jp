import React from 'react';
import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticProps } from 'next';
import { StrengthChart, StrengthData } from '@/components/StrengthChart';

interface Props {
  data: StrengthData | null;
}

export default function StrengthPage({ data }: Props) {
  return (
    <>
      <Head>
        <title>スワップ込み通貨強弱グラフ | トルコリラ・ウォッチ</title>
        <meta
          name="description"
          content="トルコリラ・メキシコペソ・米ドル・南アフリカランド・ハンガリーフォリント・日本円の6通貨を、為替の値動きとスワップポイントの両方を含めたトータルリターンで比較したグラフです。日次更新。"
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
            <h1>スワップ込み 通貨強弱グラフ</h1>
            <p className="lead">
              高スワップ通貨は「スワップで増えても為替で減っていないか」が肝心です。
              このグラフは為替の値動きとスワップの受け取りを合算した実質の成績を、
              6通貨まとめて比較できるようにしたものです。
            </p>

            {data ? (
              <StrengthChart data={data} />
            ) : (
              <p>グラフデータをまだ生成していません。</p>
            )}

            <section className="strength-about">
              <h2>このグラフの読み方</h2>
              <ul>
                <li>
                  線が上に行くほど、その通貨を持っていた人の成績が良かったことを示します。
                  スワップの受け取りも含んだ数字です。
                </li>
                <li>
                  表示中の通貨の平均が1.0になるよう揃えているので、
                  <strong>日本円も上下します</strong>。円の線が下がっている期間は、
                  他の通貨を持っていたほうが有利だったという意味です。
                </li>
                <li>
                  スワップは各通貨で1社ぶんだけを使っています。期間ごとに、
                  その期間をカバーできている業者の中で買いスワップが最も高い1社を採用し、
                  グラフの下に業者名と採用開始日を出しています。
                </li>
                <li>
                  スワップの値はランキング表と同じ「直近14日の付与日数加重平均」です。
                  日々の細かい上下は均されています。
                </li>
                <li>
                  レバレッジ1倍・全額現金で買った前提です。スプレッド（売買の手数料に
                  あたる差）は差し引いていません。長期の比較では影響が小さいためです。
                </li>
                <li>
                  データが足りない通貨はその期間だけ非表示にしています。実測値のない
                  期間を埋めることはしていません。
                </li>
              </ul>
            </section>

            <p className="back-link">
              <Link href="/">← スワップポイント比較トップへ</Link>
            </p>
          </div>
        </main>
      </div>

      <style jsx>{`
        /* ページシェルのクラスは globals.css に無く、各ページが自前で定義して
           いる (privacy.tsx / contact.tsx と同じ構成)。ここを書かないと
           中央寄せもヘッダーの装飾も効かず、素の左寄せで表示される。 */
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
        h1 {
          font-size: 28px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 16px;
          margin-bottom: 24px;
          color: #1f2937;
        }
        h2 {
          font-size: 20px;
          color: #374151;
          margin-top: 32px;
          margin-bottom: 16px;
          border-left: 4px solid #764ba2;
          padding-left: 12px;
        }
        p {
          line-height: 1.8;
          color: #4b5563;
          margin-bottom: 16px;
        }
        .lead {
          line-height: 1.9;
          margin-bottom: 20px;
        }
        .strength-about {
          margin-top: 28px;
        }
        .strength-about h2 {
          font-size: 18px;
          margin-bottom: 10px;
        }
        .strength-about ul {
          padding-left: 1.2em;
        }
        .strength-about li {
          line-height: 1.9;
          margin-bottom: 8px;
        }
        .back-link {
          margin-top: 28px;
        }
      `}</style>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  // public/data/strength.json は日次パイプラインが生成する。
  // ビルド時に読むだけで、外部 API には触れない (GMO 障害でビルドを落とさない)。
  const file = path.join(process.cwd(), 'public', 'data', 'strength.json');
  let data: StrengthData | null = null;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    data = null;
  }
  return { props: { data } };
};
