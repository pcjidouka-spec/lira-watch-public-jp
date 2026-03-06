const fs = require('fs');
const path = require('path');

// RSS Header definition
const RSS_HEADER = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
  <title>トルコリラ・ウォッチ (lira-watch)</title>
  <link>https://www.lira-watch.sbs/</link>
  <description>トルコリラのスワップポイント比較と長期投資記録</description>
  <language>ja</language>
`;

const RSS_FOOTER = `
</channel>
</rss>`;

// Function to read articles from articles.ts
function getArticles() {
    try {
        const articlesPath = path.join(__dirname, '../data/articles.ts');
        const content = fs.readFileSync(articlesPath, 'utf8');

        // Robust parsing by converting the straightforward TS array export to eval-able JS
        const jsContent = content
            .replace(/export interface Article \{[\s\S]*?\}/, '')
            .replace(/export const articles:\s*Article\[\]\s*=/, 'module.exports =');

        const tempPath = path.join(__dirname, '../data/articles.temp.js');
        fs.writeFileSync(tempPath, jsContent);

        delete require.cache[require.resolve('../data/articles.temp.js')];
        const parsedArticles = require('../data/articles.temp.js');

        fs.unlinkSync(tempPath);

        return parsedArticles.map(article => {
            let description = '';
            let rawContent = article.content || '';
            if (rawContent) {
                const textContent = rawContent.replace(/<[^>]+>/g, ''); // strip HTML
                description = textContent.replace(/\s+/g, ' ').trim().substring(0, 120) + '...';
            }
            return {
                id: article.id,
                title: article.title,
                date: article.date,
                thumbnail: article.thumbnail,
                description: description,
                fullContent: rawContent,
                tags: article.tags || []
            };
        });
    } catch (error) {
        console.error('Error reading articles:', error);
        return [];
    }
}

// Helper to format date for RSS (RFC 822)
function formatDate(dateStr) {
    // Input format: YYYY/MM/DD
    const parts = dateStr.split('/');
    if (parts.length !== 3) return new Date().toUTCString();

    // Assume 00:00:00 JST
    const date = new Date(`${parts[0]}-${parts[1]}-${parts[2]}T00:00:00+09:00`);
    return date.toUTCString();
}

function generateRSS() {
    const articles = getArticles();
    let rssContent = RSS_HEADER;

    articles.forEach(article => {
        let encodedTags = article.tags && article.tags.length > 0 ? ' ' + article.tags.map(t => '#' + t).join(' ') : '';
        let descriptionHTML = article.description + encodedTags;
        let contentHTML = article.fullContent;

        if (article.thumbnail) {
            const imageUrl = `https://www.lira-watch.sbs${article.thumbnail}`;
            const imgTag = `<img src="${imageUrl}" alt="${article.title}" border="0" /> `;
            descriptionHTML = imgTag + descriptionHTML;
            contentHTML = imgTag + contentHTML;
        }

        let itemXml = `
  <item>
    <title><![CDATA[${article.title}]]></title>
    <link>https://www.lira-watch.sbs/articles/${article.id}</link>
    <guid>https://www.lira-watch.sbs/articles/${article.id}</guid>
    <description><![CDATA[${descriptionHTML}]]></description>
    <pubDate>${formatDate(article.date)}</pubDate>
    <content:encoded><![CDATA[${contentHTML}]]></content:encoded>`;

        if (article.thumbnail) {
            const imageUrl = `https://www.lira-watch.sbs${article.thumbnail}`;
            itemXml += `
    <media:content url="${imageUrl}" medium="image" />
    <media:thumbnail url="${imageUrl}" />
    <enclosure url="${imageUrl}" type="image/png" />`;
        }

        if (article.tags && article.tags.length > 0) {
            article.tags.forEach(tag => {
                itemXml += `
    <category><![CDATA[${tag}]]></category>`;
            });
        }

        itemXml += `
  </item>`;
        rssContent += itemXml;
    });

    rssContent += RSS_FOOTER;

    const outputPath = path.join(__dirname, '../public/rss.xml');
    fs.writeFileSync(outputPath, rssContent);
    console.log(`Checking articles file at: ${path.join(__dirname, '../data/articles.ts')}`);
    console.log(`Extracted ${articles.length} articles.`);
    console.log(`Generated RSS feed at: ${outputPath}`);
}

generateRSS();
