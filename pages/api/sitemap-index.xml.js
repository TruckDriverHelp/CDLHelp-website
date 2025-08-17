/**
 * Sitemap Index for CDL Help
 * Comprehensive sitemap structure following Google's best practices
 * Includes pages, images, videos, and news sitemaps
 */

const SITE_URL = process.env.BASE_URL || 'https://www.cdlhelp.com';
const LOCALES = ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'];

export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');

  const timestamp = new Date().toISOString();

  // Define all sitemap types
  const sitemaps = [
    { path: '/api/sitemap.xml', description: 'Main pages sitemap' },
    { path: '/api/sitemap-images.xml', description: 'Image sitemap' },
    { path: '/api/sitemap-videos.xml', description: 'Video sitemap' },
    { path: '/api/sitemap-news.xml', description: 'News sitemap for blog content' },
  ];

  // Add locale-specific sitemaps for better organization
  LOCALES.filter(locale => locale !== 'en').forEach(locale => {
    sitemaps.push({
      path: `/api/sitemap-${locale}.xml`,
      description: `${locale.toUpperCase()} locale sitemap`,
    });
  });

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  sitemaps.forEach(sitemap => {
    xml += '  <sitemap>\n';
    xml += `    <loc>${SITE_URL}${sitemap.path}</loc>\n`;
    xml += `    <lastmod>${timestamp}</lastmod>\n`;
    xml += '  </sitemap>\n';
  });

  xml += '</sitemapindex>';

  res.status(200).send(xml);
}
