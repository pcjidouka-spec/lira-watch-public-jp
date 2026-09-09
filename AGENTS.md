# lira-watch-public — トルコリラ・ウォッチ (公開サイト)

各 FX 会社のスワップポイントを毎日収集して可視化・比較する Next.js 14 (TypeScript) のサイト。
GitHub Pages で公開している (https://www.lira-watch.sbs)。
**このファイルが AI エージェント向け指示の正本**で、Claude Code も Codex も同じものを読む
(`CLAUDE.md` は `@AGENTS.md` で取り込んでいる)。

## ★最初に読むこと — 生成物と手書きが同居している

このリポジトリには**性質の違う 2 種類のファイル**が混ざっている。取り違えると作業が消える。

| | 場所 | 誰が書くか |
|---|---|---|
| ★**生成物** | `public/data/**` (`*.json` / `*.csv` 23 件) | ★**上流のデータ収集パイプラインが毎日自動でコミットする** (`Update data YYYY-MM-DD`) |
| 手書き | `components/` `pages/` `lib/` `hooks/` `types/` `styles/` `scripts/` | 人間 / エージェント |

★**`public/data/` の中身を手で編集しない。**翌日の自動更新で**上書きされて消える**。
数値や項目がおかしい場合、原因はほぼ**上流の収集・整形side**にある。
このリポジトリで直せるのは**表示のしかた**だけ。

★**このリポジトリは独立した git リポジトリ**で、親ディレクトリ側の指示ファイルは読み込まれない。
上流のパイプラインは別リポジトリにあり、そちらのドキュメントが収集ロジックの正本。

## ディレクトリ構造

```
pages/          Next.js のページ (10)
components/     UI コンポーネント (19)
lib/            データ整形・共通ロジック (7)
hooks/          カスタムフック (2)
types/          型定義
public/data/    ★生成物。自動更新される (手で触らない)
scripts/        ビルド時に走る生成スクリプト (RSS / sitemap / X 投稿 / ranking)
image/          画像素材
```

## ビルド・テスト

```bash
npm install
npm run dev     # 開発サーバ
npm test        # vitest run
npm run lint    # next lint
npm run build   # ★generate-rss -> generate-sitemap -> generate-x-posts
                #   -> generate-ranking -> next build -> copy-public の順に走る
```

★`npm run build` は **`scripts/` の生成スクリプトを 4 本走らせてから** `next build` する。
ビルドが落ちたときは、Next.js ではなく生成スクリプト側が原因のことがある。

## AI エージェントが変更してはいけないもの

- ★**`public/data/**` (生成物)** — 上流が毎日上書きする
- `package-lock.json` を手で編集しない
- ★**このリポジトリは公開されている。**秘密情報 (API キー・認証情報・非公開の
  ローカルパスや内部構成) をコード・設定・ドキュメント・コミットメッセージに書かない

## Codex 固有

- ファイル操作は必ず非対話フラグで (`cp -f` / `rm -rf` / `apt-get -y`)
- ページャを起動しない (`git --no-pager` / `PAGER=cat`)
- ★**`npm test` は vitest。**`npm run build` は生成スクリプトを伴うので時間がかかる

## 詳細ドキュメント

- プロジェクト概要: `README.md`
- 構成の再現手順: `AUTOMATION_REPLICATION_PROMPT.md`
