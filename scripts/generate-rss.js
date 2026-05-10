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
  <image>
    <url>https://www.lira-watch.sbs/images/An_anime-style_Japanese_otaku_person_looking_at_a_-1757952948058.png</url>
    <title>トルコリラ・ウォッチ (lira-watch)</title>
    <link>https://www.lira-watch.sbs/</link>
  </image>
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
// Use JST 07:00 to keep pubDate firmly in the past from any timezone perspective.
// Past JST 0:00 was being interpreted as "future" by Blogmura because the previous
// day's record was published at GMT 15:00 (= JST next-day 0:00), causing the article
// to be flagged as a future post and skipped during crawl.
function formatDate(dateStr) {
    // Input format: YYYY/MM/DD
    const parts = dateStr.split('/');
    if (parts.length !== 3) return new Date().toUTCString();

    // Assume 07:00:00 JST (= 22:00:00 UTC previous day) -- guaranteed past
    const date = new Date(`${parts[0]}-${parts[1]}-${parts[2]}T07:00:00+09:00`);
    return date.toUTCString();
}

// Limit content for RSS to keep feed size small and avoid Blogmura crawler timeouts.
// Strip tags + truncate to ~500 chars + append "...続きを読む" link.
function truncateContent(html, articleId, maxChars = 500) {
    if (!html) return '';
    // Keep the leading <img> tag if present (for description thumbnail compatibility)
    const stripped = html.replace(/\s+/g, ' ').trim();
    if (stripped.length <= maxChars) return stripped;
    // Cut at maxChars, prefer to break at a tag boundary
    let cut = stripped.substring(0, maxChars);
    const lastTagClose = cut.lastIndexOf('>');
    if (lastTagClose > maxChars * 0.7) cut = cut.substring(0, lastTagClose + 1);
    return `${cut}... <a href="https://www.lira-watch.sbs/articles/${articleId}">続きを読む</a>`;
}

// Limit number of items in feed to reduce payload size for Blogmura crawler.
const MAX_RSS_ITEMS = 15;

function generateRSS() {
    const allArticles = getArticles();
    // Sort by date desc (defensive: articles.ts is mostly sorted but not guaranteed)
    const sorted = allArticles.slice().sort((a, b) => {
        const da = new Date(a.date.replace(/\//g, '-')).getTime();
        const db = new Date(b.date.replace(/\//g, '-')).getTime();
        return db - da;
    });
    const articles = sorted.slice(0, MAX_RSS_ITEMS);
    let rssContent = RSS_HEADER;

    articles.forEach(article => {
        let encodedTags = article.tags && article.tags.length > 0 ? ' ' + article.tags.map(t => '#' + t).join(' ') : '';
        let descriptionHTML = article.description + encodedTags;
        let contentHTML = truncateContent(article.fullContent, article.id);

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
    <guid>https://www.lira-watch.sbs/articles/${article.id}</guid>`;

        // Image tags first (before description) for Blog Mura compatibility
        if (article.thumbnail) {
            const imageUrl = `https://www.lira-watch.sbs${article.thumbnail}`;
            itemXml += `
    <enclosure url="${imageUrl}" length="0" type="image/png" />
    <media:thumbnail url="${imageUrl}" />
    <media:content url="${imageUrl}" medium="image" />`;
        }

        itemXml += `
    <description><![CDATA[${descriptionHTML}]]></description>
    <pubDate>${formatDate(article.date)}</pubDate>
    <content:encoded><![CDATA[${contentHTML}]]></content:encoded>`;

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
    console.log(`Extracted ${allArticles.length} articles total, emitted top ${articles.length} into feed.`);
    console.log(`Generated RSS feed at: ${outputPath}`);
}

generateRSS();
