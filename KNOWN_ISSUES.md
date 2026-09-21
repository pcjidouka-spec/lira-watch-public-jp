# 既知の残骸 — ★直す前に人間に確認する

過去の構成の名残で「一見バグに見えるが、意図的に放置しているもの」がある。
★**見つけても勝手に直さない。**直すかどうかは人間が決める。

## `scripts/copy-public.js` が実質 no-op

`scripts/public/` を `out/` へコピーする想定だが、**そのディレクトリは存在せず毎回 skip している**。
GitHub Pages で静的エクスポートしていた頃の名残。`npm run build` の最後で呼ばれる。

## `README.md` のホスティング記述が古い

README のバッジと「Infrastructure」の表が **GitHub Pages** になっているが、
★**現在の公開先は Vercel**（独自ドメイン https://www.lira-watch.sbs）。

## `scripts/` に複数言語が同居している

Python (`*.py`) と PowerShell / bat の運用補助スクリプトが同じ場所にある。
★ビルドが呼ぶのは `generate-*.js` と `copy-public.js` だけ。
