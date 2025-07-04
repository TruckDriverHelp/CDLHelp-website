// Sitemap Index for better organization
// Following Google's best practices for large multilingual sites

const SITE_URL = process.env.BASE_URL || 'https://www.cdlhelp.com';
const LOCALES = ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'];

export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');

  const today = new Date().toISOString().split('T')[0];

  let sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemapIndex += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Main sitemap
  sitemapIndex += `  <sitemap>\n`;
  sitemapIndex += `    <loc>${SITE_URL}/api/sitemap.xml</loc>\n`;
  sitemapIndex += `    <lastmod>${today}</lastmod>\n`;
  sitemapIndex += `  </sitemap>\n`;

  // You can add more sitemaps here if needed in the future
  // For example: sitemap-news.xml, sitemap-images.xml, etc.

  sitemapIndex += `</sitemapindex>`;

  res.status(200).send(sitemapIndex);
}
