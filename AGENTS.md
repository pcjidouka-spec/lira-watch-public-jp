# lira-watch-public — トルコリラ・ウォッチ (公開サイト)

各 FX 会社のスワップポイントを毎日収集して可視化・比較する Next.js 14 (TypeScript / Pages Router) のサイト。
公開先は **Vercel** (独自ドメイン https://www.lira-watch.sbs)。
**このファイルが AI エージェント向け指示の正本**で、Claude Code も Codex も同じものを読む
(`CLAUDE.md` は `@AGENTS.md` で取り込んでいる)。

★**このリポジトリは公開されている。**秘密情報 (API キー・認証情報) はもちろん、
ローカルパス・非公開の内部構成・個人情報を、コード・設定・ドキュメント・
コミットメッセージのどれにも書かない。

★**このリポジトリは beads を使わない。**issue は上位のプロジェクト側で管理する。

## ★最初に読むこと — 生成物と手書きが同居している

このリポジトリには**性質の違う 2 種類のファイル**が混ざっている。取り違えると作業が消える。

| | 場所 | 誰が書くか |
|---|---|---|
| ★**生成物** | `public/data/**` (`*.json` / `*.csv` 23 件) | ★**上流のデータ収集パイプラインが毎日自動でコミットする** (`Update data YYYY-MM-DD`) |
| 手書き | `components/` `pages/` `lib/` `hooks/` `types/` `data/` `styles/` `scripts/` | 人間 / エージェント |

★**`public/data/` の中身を手で編集しない。**翌日の自動更新で**上書きされて消える**。
数値や項目がおかしい場合、原因はほぼ**上流の収集・整形側**にある。
このリポジトリで直せるのは**表示のしかた**だけ。

★**このリポジトリは独立した git リポジトリ**で、親ディレクトリ側の指示ファイルは読み込まれない。
上流のパイプラインは別リポジトリにあり、そちらのドキュメントが収集ロジックの正本。

## ディレクトリ構造

```
pages/          Next.js のページ (Pages Router, 10 ファイル)
                index / carry / arbitrage / strength / operator / privacy / contact
                + articles/[id].tsx (記事は data/articles.ts から SSG)
components/     UI コンポーネント (19。うち TradingView/ に 4 つのウィジェット)
lib/            データ整形・共通ロジック (dataProcessor / spreadJoin / spreadDisplay ほか)
                ★テストはここにしか無い (*.test.ts が 3 本)
hooks/          カスタムフック (useSwapData / useCampaignUpdates)
data/           手書きのコンテンツ定義 (articles.ts = 記事本文, ad_items.ts = 広告枠)
types/          型定義
public/data/    ★生成物。上流が毎日上書きする (手で触らない)
public/         それ以外は静的資産 (CNAME / robots.txt / rss.xml / sitemap.xml /
                providers_config*.json / images/)。★rss.xml と sitemap.xml はビルドが生成する
scripts/        ビルド時の生成スクリプトとサムネイル・運用補助スクリプト
image/          画像素材 (元データ。配信されるのは public/images/)
```

## アーキテクチャ

```
上流のパイプライン (別リポジトリ) ──毎日 push──> public/data/**  (CSV / JSON)
                                                    |
  scripts/generate-*.js (ビルド時) ────────────────┘
                                                    v
  lib/ (整形) ──> hooks/ ──> pages/ + components/ ──> next build (SSG) ──> Vercel
```

- **ページはほぼ全部 SSG**。`getStaticProps` がビルド時に `public/data/**` を読む。
  ★つまり**データが新しくなっても再ビルドされるまでサイトには出ない** (上流の push が Vercel のビルドを起こす)
- チャートは `recharts`、CSV の解析は `papaparse`
- `pages/articles/[id].tsx` は `data/articles.ts` の定義から静的生成する (2026-09 時点で 35 記事)

## ビルド・テスト

```bash
npm install
npm run dev     # 開発サーバ
npm test        # vitest run
npm run lint    # next lint
npm run build   # generate-rss -> generate-sitemap -> generate-x-posts
                #   -> generate-ranking -> next build -> copy-public の順
```

移行前ベースライン (2026-09-10 実測。`.migration-test.txt` にも記載):

| コマンド | 結果 | 所要 |
|---|---|---|
| `npm test` | 3 ファイル / **40 tests passed**, exit 0 | 約 10 秒 (vitest 内部は 1.4 秒) |
| `npm run lint` | **警告 34 / エラー 0**, exit 0 (ほぼ `@next/next/no-img-element`) | 約 60 秒 |
| `npm run build` | exit 0 | 約 35 秒 |

★**`npm run build` は `scripts/` の生成スクリプトを 4 本走らせてから** `next build` する。
ビルドが落ちたときは、Next.js ではなく生成スクリプト側が原因のことがある。

★**`npm run build` は作業ツリーを汚す。**`generate-ranking.js` が
`public/data/ranking_{try,usd,mxn}.json` を書き直し、`generated_at` の時刻だけが差分に出る。
**この差分はコミットしない** (`git checkout -- public/data` で戻す)。
`rss.xml` / `sitemap.xml` / `x_posts.json` も生成対象なので、内容が変わっていれば同様に扱う。

★**`next.config.js` で TypeScript と ESLint のビルド時チェックを無効化している**
(`typescript.ignoreBuildErrors` / `eslint.ignoreDuringBuilds` がどちらも `true`)。
★**`npm run build` が通っても型エラーは検出されていない。**型を確かめるなら
`npx tsc --noEmit` を別に走らせる。

## AI エージェントが変更してはいけないもの

- ★**`public/data/**` (生成物)** — 上流が毎日上書きする
- ★`public/CNAME` — 独自ドメインの設定。消すと公開ドメインが切れる
- `package-lock.json` を手で編集しない
- ★`next.config.js` の `images.remotePatterns` — 広告配信元のホスト許可。減らすと画像が出なくなる
- ★`.vercel/` (git 管理外) — Vercel のプロジェクト紐付け

## 既知の残骸 (直す前に人間に確認する)

- `scripts/copy-public.js` は `scripts/public/` を `out/` へコピーする想定だが、
  **そのディレクトリは存在せず毎回 skip している** (実質 no-op)。GitHub Pages で
  静的エクスポートしていた頃の名残。★`README.md` の「Hosting: GitHub Pages」も同じ名残で、
  **現在の公開先は Vercel**
- `scripts/` には Python (`*.py`) と PowerShell / bat の運用補助スクリプトも同居している。
  ビルドが呼ぶのは `generate-*.js` と `copy-public.js` だけ

## Codex 固有

- ファイル操作は必ず非対話フラグで (`cp -f` / `rm -rf` / `apt-get -y`)
- ページャを起動しない (`git --no-pager` / `PAGER=cat`)
- ★**`npm test` は vitest。**`npm run lint` と `npm run build` は 30〜60 秒かかるので
  タイムアウトを短く設定しない

## 詳細ドキュメント

- プロジェクト概要: `README.md` (★ホスティングの記述だけ古い。上記参照)
- 構成の再現手順: `AUTOMATION_REPLICATION_PROMPT.md`
