// 記事とセットで書いた X 投稿本文 (articles.ts の x_post) を
// public/data/x_posts.json に書き出す。bot/post_to_x.py がこれを読んで投稿する。
//
// 記事側に x_post が無い場合はこの JSON に載らず、bot は従来どおり
// 記事冒頭の自動切り出しにフォールバックする。
const fs = require('fs');
const path = require('path');

// X の重み付き文字数（半角1・全角2）。post_to_x.py の _x_weight と同じ定義。
function xWeight(s) {
    let n = 0;
    for (const ch of s) n += Buffer.byteLength(ch, 'utf8') > 2 ? 2 : 1;
    return n;
}

// post_to_x.py 側で本文に割ける予算。固定部（【新着記事】/詳細はこちら/URL/タグ3つ）を
// 引いた残り。タグの長さで多少前後するので、警告用の目安として使う。
const BODY_BUDGET = 187;

function getArticles() {
    const articlesPath = path.join(__dirname, '../data/articles.ts');
    const content = fs.readFileSync(articlesPath, 'utf8');

    // generate-rss.js と同じ方式で TS の配列を eval 可能な JS に変換する
    const jsContent = content
        .replace(/export interface Article \{[\s\S]*?\n\}/, '')
        .replace(/export const articles:\s*Article\[\]\s*=/, 'module.exports =');

    const tempPath = path.join(__dirname, '../data/articles.xposts.temp.js');
    fs.writeFileSync(tempPath, jsContent);
    try {
        delete require.cache[require.resolve('../data/articles.xposts.temp.js')];
        return require('../data/articles.xposts.temp.js');
    } finally {
        fs.unlinkSync(tempPath);
    }
}

function main() {
    const articles = getArticles();
    const posts = {};
    let over = 0;

    articles.forEach(article => {
        if (!article.x_post) return;
        const body = String(article.x_post).trim();
        if (!body) return;
        const weight = xWeight(body);
        if (weight > BODY_BUDGET) {
            over += 1;
            console.warn(
                `[warn] x_post が長すぎます (${weight}/${BODY_BUDGET}): ${article.id}\n` +
                '       投稿時に末尾が切り詰められます。'
            );
        }
        posts[article.id] = body;
    });

    const outDir = path.join(__dirname, '../public/data');
    fs.mkdirSync(outDir, { recursive: true });
    const outputPath = path.join(outDir, 'x_posts.json');
    fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2) + '\n');
    console.log(
        `Generated ${Object.keys(posts).length} x_post entries ` +
        `(${articles.length} articles, ${over} over budget) at: ${outputPath}`
    );
}

main();
