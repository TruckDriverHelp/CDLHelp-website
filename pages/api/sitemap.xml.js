/**
 * Legacy sitemap.xml endpoint
 * Redirects to the main sitemap index
 */

export default function handler(req, res) {
  // Redirect to sitemap index
  res.redirect(301, '/api/sitemap');
}
