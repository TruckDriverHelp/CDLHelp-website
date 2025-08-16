/**
 * Webhook endpoint for CMS content updates
 * Triggers ISR revalidation when content changes
 */

import crypto from 'crypto';

/**
 * Verify webhook signature for security
 */
function verifyWebhookSignature(signature, body, secret) {
  if (!signature || !secret) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(body))
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

/**
 * Generate all locale paths for a given base path
 */
function generateLocalePaths(basePath) {
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

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify webhook signature if secret is configured
  const webhookSecret = process.env.WEBHOOK_SECRET;
  if (webhookSecret) {
    const signature = req.headers['x-webhook-signature'] || req.headers['x-hub-signature-256'];

    if (!verifyWebhookSignature(signature, req.body, webhookSecret)) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Webhook] Invalid signature');
      }
      return res.status(401).json({ error: 'Invalid signature' });
    }
  }

  const { type, slug, locale, data, paths: customPaths } = req.body;

  try {
    const pathsToRevalidate = [];
    const results = [];

    switch (type) {
      case 'article.created':
      case 'article.updated':
      case 'article.published':
        // Revalidate article in all locales
        if (slug) {
          pathsToRevalidate.push(...generateLocalePaths(`/${slug}`));
          // Also revalidate blog listing pages
          pathsToRevalidate.push(...generateLocalePaths('/blog'));
        }
        break;

      case 'article.deleted':
      case 'article.unpublished':
        // Revalidate article path and blog listing
        if (slug) {
          pathsToRevalidate.push(...generateLocalePaths(`/${slug}`));
          pathsToRevalidate.push(...generateLocalePaths('/blog'));
        }
        break;

      case 'homepage.updated':
        // Revalidate all homepage paths
        pathsToRevalidate.push('/', '/ru', '/uk', '/ar', '/ko', '/zh', '/tr', '/pt');
        break;

      case 'schools.updated':
        // Revalidate school-related pages
        if (data?.state && data?.city) {
          const schoolPath = `/schools/${data.state}/${data.city}`;
          pathsToRevalidate.push(...generateLocalePaths(schoolPath));
        }
        // Also revalidate school listing
        pathsToRevalidate.push(...generateLocalePaths('/schools'));
        break;

      case 'faq.updated':
        // Revalidate FAQ pages
        pathsToRevalidate.push(...generateLocalePaths('/faq'));
        // Also revalidate homepage since it might show FAQs
        pathsToRevalidate.push(...generateLocalePaths('/'));
        break;

      case 'quiz.updated':
        // Revalidate quiz/test pages
        if (data?.quizType) {
          const quizPath = `/quiz/${data.quizType}`;
          pathsToRevalidate.push(...generateLocalePaths(quizPath));
        }
        pathsToRevalidate.push(...generateLocalePaths('/road-signs/test'));
        break;

      case 'custom':
        // Allow custom paths to be specified
        if (customPaths && Array.isArray(customPaths)) {
          pathsToRevalidate.push(...customPaths);
        }
        break;

      case 'bulk':
        // Bulk revalidation for multiple content updates
        if (data?.articles && Array.isArray(data.articles)) {
          for (const article of data.articles) {
            pathsToRevalidate.push(...generateLocalePaths(`/${article.slug}`));
          }
        }
        break;

      default:
        return res.status(400).json({
          error: 'Unknown event type',
          supportedTypes: [
            'article.created',
            'article.updated',
            'article.deleted',
            'homepage.updated',
            'schools.updated',
            'faq.updated',
            'quiz.updated',
            'custom',
            'bulk',
          ],
        });
    }

    // Remove duplicates
    const uniquePaths = [...new Set(pathsToRevalidate)];

    // Trigger revalidation for all paths

    for (const path of uniquePaths) {
      try {
        await res.revalidate(path);
        results.push({ path, success: true });
      } catch (err) {
        results.push({ path, success: false, error: err.message });
        if (process.env.NODE_ENV === 'development') {
          console.error(`[Webhook] ✗ Failed to revalidate ${path}:`, err.message);
        }
      }
    }

    // Calculate summary
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    // Log webhook activity
    const logEntry = {
      timestamp: new Date().toISOString(),
      type,
      slug,
      locale,
      pathsRevalidated: successful,
      pathsFailed: failed,
      totalPaths: uniquePaths.length,
    };

    return res.json({
      success: true,
      type,
      revalidated: successful,
      failed,
      total: uniquePaths.length,
      results: process.env.NODE_ENV === 'development' ? results : undefined,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Webhook] Error processing webhook:', err);
    }
    return res.status(500).json({
      error: 'Webhook processing failed',
      message: err.message,
    });
  }
}

// Export config to handle body parsing
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
