/**
 * Dynamic sitemap API endpoint
 * Handles individual sitemap types (static, blog, schools, companies)
 */

const SitemapGenerator = require('../../../lib/sitemap/core/SitemapGenerator');

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, locale } = req.query;

  // Validate sitemap type
  const validTypes = ['static', 'blog', 'schools', 'companies', 'media'];

  // Handle locale-specific static sitemaps
  const staticLocaleMatch = type?.match(/^static-([a-z]{2})$/);

  try {
    const generator = new SitemapGenerator({
      baseUrl: process.env.BASE_URL || 'https://www.cdlhelp.com',
    });

    let sitemap = null;

    // Generate appropriate sitemap based on type
    if (staticLocaleMatch) {
      // Static sitemap for specific locale (e.g., static-en, static-ru)
      const requestedLocale = staticLocaleMatch[1];
      sitemap = await generator.generateStaticSitemap(requestedLocale);
    } else if (type === 'static' && locale) {
      // Static sitemap with locale parameter
      sitemap = await generator.generateStaticSitemap(locale);
    } else if (type === 'blog') {
      // Blog sitemap
      sitemap = await generator.generateBlogSitemap();
    } else if (type === 'schools') {
      // Schools sitemap
      sitemap = await generator.generateSchoolsSitemap();
    } else if (type === 'companies') {
      // Companies sitemap
      sitemap = await generator.generateCompaniesSitemap();
    } else {
      return res.status(404).json({ error: 'Invalid sitemap type' });
    }

    if (!sitemap) {
      return res.status(404).json({ error: 'Sitemap not found' });
    }

    // Set appropriate headers
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    res.setHeader('X-Robots-Tag', 'noindex');

    // Return XML
    return res.status(200).send(sitemap);
  } catch (error) {
    console.error(`Error generating ${type} sitemap:`, error);

    // Return error in production-safe way
    return res.status(500).json({
      error: `Failed to generate ${type} sitemap`,
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
