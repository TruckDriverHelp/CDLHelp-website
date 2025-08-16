/**
 * On-demand revalidation API endpoint
 * Allows manual cache invalidation for ISR pages
 */

export default async function handler(req, res) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.REVALIDATION_SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { path, paths, locale } = req.body;

  try {
    // Handle single path revalidation
    if (path) {
      // If locale is specified, revalidate locale-specific path
      const pathToRevalidate = locale && locale !== 'en' ? `/${locale}${path}` : path;

      await res.revalidate(pathToRevalidate);

      return res.json({
        revalidated: true,
        path: pathToRevalidate,
        timestamp: new Date().toISOString(),
      });
    }

    // Handle multiple paths revalidation
    if (paths && Array.isArray(paths)) {
      const results = [];

      for (const p of paths) {
        try {
          await res.revalidate(p);
          results.push({ path: p, success: true });
        } catch (err) {
          results.push({ path: p, success: false, error: err.message });
          if (process.env.NODE_ENV === 'development') {
            console.error(`[ISR] Failed to revalidate ${p}:`, err.message);
          }
        }
      }

      return res.json({
        revalidated: true,
        results,
        timestamp: new Date().toISOString(),
      });
    }

    // Handle locale-based revalidation for common pages
    if (req.body.type === 'homepage') {
      const homepagePaths = ['/', '/ru', '/uk', '/ar', '/ko', '/zh', '/tr', '/pt'];

      const results = [];
      for (const p of homepagePaths) {
        try {
          await res.revalidate(p);
          results.push({ path: p, success: true });
        } catch (err) {
          results.push({ path: p, success: false, error: err.message });
        }
      }

      return res.json({
        revalidated: true,
        type: 'homepage',
        results,
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(400).json({
      message: 'Path, paths, or type required',
      usage: {
        singlePath: { path: '/blog/article-slug', locale: 'en' },
        multiplePaths: { paths: ['/path1', '/path2'] },
        homepage: { type: 'homepage' },
      },
    });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ISR] Revalidation error:', err);
    }
    return res.status(500).json({
      message: 'Error revalidating',
      error: err.message,
    });
  }
}

// Helper function to generate all locale paths for a given path
export function generateLocalePaths(basePath) {
  const locales = ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'];
  const paths = [];

  for (const locale of locales) {
    if (locale === 'en') {
      paths.push(basePath);
    } else {
      paths.push(`/${locale}${basePath}`);
    }
  }

  return paths;
}
