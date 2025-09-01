/**
 * Comprehensive Sitemap API Endpoint
 * Generates a complete sitemap with all pages and proper hreflang annotations
 */

export default function handler(req, res) {
  try {
    // Import the generator
    const ComprehensiveSitemapGenerator = require('../../lib/sitemap/comprehensive-generator');

    // Initialize generator with configuration
    const generator = new ComprehensiveSitemapGenerator({
      baseUrl: process.env.BASE_URL || 'https://www.cdlhelp.com',
      locales: ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'],
      defaultLocale: 'en',
      maxUrlsPerSitemap: 45000,
    });

    // Generate the comprehensive sitemap
    const sitemap = generator.generateCompleteSitemap();

    // Validate the sitemap
    const validation = generator.validateSitemap(sitemap);

    if (!validation.valid) {
      console.error('Sitemap validation errors:', validation.errors);
    }

    if (validation.warnings && validation.warnings.length > 0) {
      console.warn('Sitemap warnings:', validation.warnings);
    }

    // Set appropriate headers
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader(
      'Cache-Control',
      'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400'
    );

    // Send the sitemap
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Error generating comprehensive sitemap:', error);

    // Return a minimal fallback sitemap on error
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://www.cdlhelp.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.status(500).send(fallbackXml);
  }
}
