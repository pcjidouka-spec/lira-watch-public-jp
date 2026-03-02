const fs = require('fs');
const path = require('path');

// RSS Header definition
const RSS_HEADER = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:dc="http://purl.org/dc/elements/1.1/">
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

        // Simple parsing logic to extract article objects from the TS file
        // We look for objects inside the articles array. Note: This is a regex-based approximation
        // suitable for the build script without compiling TS. Use with care if file structure changes.

        // Extract the array content
        const match = content.match(/export const articles: Article\[\] = \[([\s\S]*?)\];/);
        if (!match) return [];

        const rawData = match[1];
        const articles = [];

        // Split by article objects (assuming basic formatting with braces)
        const objectMatches = rawData.match(/\{[\s\S]*?\}(?=,\s*\{|\s*\])/g);

        if (objectMatches) {
            objectMatches.forEach(objStr => {
                const idMatch = objStr.match(/id:\s*'([^']+)'/);
                const titleMatch = objStr.match(/title:\s*'([^']+)'/);
                const dateMatch = objStr.match(/date:\s*'([^']+)'/);
                const thumbnailMatch = objStr.match(/thumbnail:\s*'([^']+)'/);
                const contentMatch = objStr.match(/content:\s*`([\s\S]*?)`/);

                // Extract description from content (first <p> tag or first 100 chars)
                let description = '';
                if (contentMatch) {
                    const textContent = contentMatch[1].replace(/<[^>]+>/g, ''); // strip HTML
                    description = textContent.replace(/\s+/g, ' ').trim().substring(0, 120) + '...';
                }

                const tagsMatch = objStr.match(/tags:\s*\[([\s\S]*?)\]/);
                let tags = [];
                if (tagsMatch) {
                    tags = tagsMatch[1].split(',').map(t => t.trim().replace(/^['"]|['"]$/g, ''));
                }

                if (idMatch && titleMatch && dateMatch) {
                    articles.push({
                        id: idMatch[1],
                        title: titleMatch[1],
                        date: dateMatch[1],
                        thumbnail: thumbnailMatch ? thumbnailMatch[1] : null,
                        description: description,
                        tags: tags
                    });
                }
            });
        }

        return articles;
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
        let itemXml = `
  <item>
    <title>${article.title}</title>
    <link>https://www.lira-watch.sbs/articles/${article.id}</link>
    <guid>https://www.lira-watch.sbs/articles/${article.id}</guid>
    <description>${article.description}</description>
    <pubDate>${formatDate(article.date)}</pubDate>`;

        if (article.thumbnail) {
            const imageUrl = `https://www.lira-watch.sbs${article.thumbnail}`;
            itemXml += `
    <media:thumbnail url="${imageUrl}" />
    <enclosure url="${imageUrl}" type="image/png" />`;
        }

        if (article.tags && article.tags.length > 0) {
            article.tags.forEach(tag => {
                itemXml += `
    <category>${tag}</category>`;
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
