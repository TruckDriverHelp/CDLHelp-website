/**
 * Main sitemap index API endpoint
 * Returns the sitemap index containing all sub-sitemaps
 */

const SitemapGenerator = require('../../../lib/sitemap/core/SitemapGenerator');

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize generator
    const generator = new SitemapGenerator({
      baseUrl: process.env.BASE_URL || 'https://www.cdlhelp.com',
    });

    // Generate sitemap index
    const sitemapIndex = await generator.generateAll();

    // Set appropriate headers
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    res.setHeader('X-Robots-Tag', 'noindex');

    // Return XML
    return res.status(200).send(sitemapIndex);
  } catch (error) {
    console.error('Error generating sitemap index:', error);

    // Return error in production-safe way
    return res.status(500).json({
      error: 'Failed to generate sitemap index',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
