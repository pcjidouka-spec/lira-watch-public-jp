const fs = require('fs');
const path = require('path');

// Sitemap Header definition
const SITEMAP_HEADER = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.lira-watch.sbs/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`;

const SITEMAP_FOOTER = `</urlset>`;

function getArticles() {
    try {
        const articlesPath = path.join(__dirname, '../data/articles.ts');
        const content = fs.readFileSync(articlesPath, 'utf8');

        const match = content.match(/export const articles: Article\[\] = \[([\s\S]*?)\];/);
        if (!match) return [];

        const rawData = match[1];
        const articles = [];

        const objectMatches = rawData.match(/\{[\s\S]*?\}(?=,\s*\{|\s*\])/g);

        if (objectMatches) {
            objectMatches.forEach(objStr => {
                const idMatch = objStr.match(/id:\s*'([^']+)'/);
                const dateMatch = objStr.match(/date:\s*'([^']+)'/);

                if (idMatch && dateMatch) {
                    articles.push({
                        id: idMatch[1],
                        date: dateMatch[1]
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

// YYYY/MM/DD -> YYYY-MM-DD
function formatDateForSitemap(dateStr) {
    const parts = dateStr.split('/');
    if (parts.length !== 3) {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    }
    return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
}

function generateSitemap() {
    const articles = getArticles();
    let sitemapContent = SITEMAP_HEADER;

    articles.forEach(article => {
        sitemapContent += `
  <url>
    <loc>https://www.lira-watch.sbs/articles/${article.id}</loc>
    <lastmod>${formatDateForSitemap(article.date)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    sitemapContent += `\n${SITEMAP_FOOTER}`;

    const outputPath = path.join(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(outputPath, sitemapContent);
    console.log(`Extracted ${articles.length} articles for sitemap.`);
    console.log(`Generated Sitemap at: ${outputPath}`);
}

generateSitemap();
