export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.cdlhelp.com/</loc>
    <lastmod>2025-09-01</lastmod>
  </url>
</urlset>`;

  res.status(200).send(xml);
}
