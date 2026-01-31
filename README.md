# トルコリラ・ウォッチ (lira-watch.sbs) [Automated Deployment]

トルコリラ円（TRY/JPY）の各FX会社の公式データを毎日収集し、スワップポイントを比較・アーカイブするウェブサイトです。

## 機能

- **スワップポイント比較**: 各FX会社の買い・売りスワップポイントをリアルタイムで比較
- **ランキング表示**: 買いスワップは降順、売りスワップは昇順（マイナスが小さい順）でランキング表示
- **月間・年間統計**: 過去データの月間・年間集計（平均値・最高値・最低値）
- **ダッシュボード**: 本日の最高スワップ値と目標20円に対する到達度をゲージで表示
- **リスク管理情報**: 為替急落リスク、証拠金維持率、スプレッド拡大への注意喚起

## 技術スタック

- **フレームワーク**: Next.js 14 (Static Export)
- **言語**: TypeScript
- **スタイリング**: CSS-in-JS (styled-jsx)
- **グラフ**: Recharts
- **データ形式**: CSV

## セットアップ

### 必要な環境

- Node.js 18以上
- npm または yarn

### インストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

### ビルド

```bash
npm run build
```

ビルドされたファイルは `out` ディレクトリに出力されます。

## プロジェクト構造

```
lira-watch/
├── components/          # Reactコンポーネント
│   ├── SwapGauge.tsx    # スワップポイントゲージ
│   ├── RankingTable.tsx # ランキングテーブル
│   ├── HistoricalChart.tsx # 履歴チャート
│   └── RiskIndicator.tsx   # リスクインジケーター
├── hooks/               # カスタムフック
│   └── useSwapData.ts  # スワップデータ取得フック
├── lib/                 # ユーティリティ関数
│   └── dataProcessor.ts # データ処理ロジック
├── pages/               # Next.jsページ
│   ├── _app.tsx        # アプリケーションエントリーポイント
│   └── index.tsx       # メインページ
├── public/              # 静的ファイル
│   ├── data/           # CSVデータファイル
│   └── images/         # 画像アセット
├── styles/              # グローバルスタイル
└── types/               # TypeScript型定義
```

## データソース

- **データファイル**: `public/data/master_history.csv`
- **データスキーマ**:
  - `target_date`: 日付 (YYYY-MM-DD)
  - `provider_id`: プロバイダーID
  - `name`: 会社名
  - `days`: 日数
  - `swap_buy`: 買いスワップポイント
  - `swap_sell`: 売りスワップポイント
  - `settlement_date`: 決済日
  - `status`: ステータス (success/error)

## データ更新方法

1. `tryuniondata/master_history.csv` を更新
2. 以下のコマンドで `public/data/master_history.csv` にコピー:

```bash
cp ../tryuniondata/master_history.csv public/data/master_history.csv
```

3. ビルドしてデプロイ

## デプロイ

### コアサーバーへのデプロイ

1. `npm run build` でビルド
2. `out` ディレクトリの内容をサーバーにアップロード
3. ドメイン: lira-watch.sbs
4. サーバー: deicsoqn@v2012.coreserver.jp

## 運用指標

- **ベストな基準**: 1日あたりのスワップポイント 20円以上
- **データ更新頻度**: 毎日
- **通貨ペア**: TRY/JPY（トルコリラ円）

## リスク管理

このサイトで提供する情報は投資判断の参考情報であり、投資の最終的な意思決定はユーザー自身の責任で行ってください。

- **為替の急落リスク**: トルコリラは高金利通貨ですが、為替変動リスクも高い通貨です
- **証拠金維持率の管理**: 市場急変時には証拠金の追加が必要になる可能性があります
- **スプレッド拡大**: 市場急変時や流動性が低下する時間帯にはスプレッドが拡大する可能性があります

## 運用ルール

### 記事更新時

記事を作成・更新した際は、必ず以下のコマンドを実行してBlogmuraに更新通知（Ping）を送信してください。

```bash
npm run ping:blogmura
```

## ライセンス

このプロジェクトは個人利用を目的としています。


