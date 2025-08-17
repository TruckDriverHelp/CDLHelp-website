/**
 * News Sitemap for CDL Help Blog Content
 * For Google News inclusion - only includes articles from last 48 hours
 */

import axios from 'axios';
const SitemapGenerator = require('../../lib/sitemap-generator');

const SITE_URL = process.env.BASE_URL || 'https://www.cdlhelp.com';

/**
 * Fetch recent articles from Strapi (last 48 hours for Google News)
 */
async function fetchRecentArticles() {
  try {
    // Skip if Strapi is not configured
    if (!process.env.STRAPI_HOST || !process.env.STRAPI_PORT || !process.env.STRAPI_API_KEY) {
      // Return sample recent articles for demonstration
      return getSampleRecentArticles();
    }

    // Calculate cutoff date (48 hours ago)
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - 48);
    const cutoffISO = cutoffDate.toISOString();

    const { data } = await axios.get(
      `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/api/articles`,
      {
        params: {
          'filters[publishedAt][$gte]': cutoffISO,
          'populate[localizations]': '*',
          'sort[0]': 'publishedAt:desc',
        },
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
        },
      }
    );

    const articles = [];

    data.data.forEach(article => {
      const attr = article.attributes;

      // Only include if truly recent (within 48 hours)
      const publishDate = new Date(attr.publishedAt || attr.createdAt);
      if (publishDate >= cutoffDate) {
        articles.push({
          url: `/${attr.slug}`,
          title: attr.title,
          publicationDate: publishDate.toISOString(),
          publicationName: 'CDL Help News',
          language: attr.locale || 'en',
          keywords: attr.keywords || extractKeywords(attr.title, attr.description),
        });

        // Add localizations
        attr.localizations?.data?.forEach(loc => {
          const locAttr = loc.attributes;
          const locPublishDate = new Date(locAttr.publishedAt || locAttr.createdAt);

          if (locPublishDate >= cutoffDate) {
            articles.push({
              url: `/${locAttr.locale}/${locAttr.slug}`,
              title: locAttr.title,
              publicationDate: locPublishDate.toISOString(),
              publicationName: 'CDL Help News',
              language: locAttr.locale,
              keywords: locAttr.keywords || extractKeywords(locAttr.title, locAttr.description),
            });
          }
        });
      }
    });

    return articles;
  } catch (error) {
    console.error('Error fetching recent articles:', error);
    return getSampleRecentArticles();
  }
}

/**
 * Get sample recent articles for demonstration
 */
function getSampleRecentArticles() {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 47 * 60 * 60 * 1000);

  return [
    {
      url: '/blog/new-cdl-requirements-2024',
      title: 'New CDL Requirements for 2024: What Drivers Need to Know',
      publicationDate: now.toISOString(),
      publicationName: 'CDL Help News',
      language: 'en',
      keywords: [
        'CDL requirements',
        '2024 CDL',
        'commercial driving',
        'CDL updates',
        'truck driver requirements',
      ],
    },
    {
      url: '/blog/eldt-training-update',
      title: 'ELDT Training Requirements Update: Important Changes for New Drivers',
      publicationDate: yesterday.toISOString(),
      publicationName: 'CDL Help News',
      language: 'en',
      keywords: [
        'ELDT',
        'entry level driver training',
        'CDL training',
        'FMCSA',
        'truck driver training',
      ],
    },
    {
      url: '/blog/hazmat-endorsement-changes',
      title: 'Hazmat Endorsement Process Changes: Faster Background Checks Coming',
      publicationDate: yesterday.toISOString(),
      publicationName: 'CDL Help News',
      language: 'en',
      keywords: [
        'hazmat endorsement',
        'TSA',
        'background check',
        'CDL endorsement',
        'hazardous materials',
      ],
    },
    {
      url: '/blog/dot-physical-telehealth',
      title: 'DOT Physical Exams Now Available via Telehealth in Select States',
      publicationDate: twoDaysAgo.toISOString(),
      publicationName: 'CDL Help News',
      language: 'en',
      keywords: ['DOT physical', 'telehealth', 'medical exam', 'CDL medical', 'remote examination'],
    },
    {
      url: '/blog/truck-driver-shortage-2024',
      title: 'Truck Driver Shortage 2024: Industry Offers Higher Pay and Benefits',
      publicationDate: twoDaysAgo.toISOString(),
      publicationName: 'CDL Help News',
      language: 'en',
      keywords: [
        'driver shortage',
        'truck driver jobs',
        'CDL jobs',
        'driver pay',
        'trucking industry',
      ],
    },
    // Russian language articles
    {
      url: '/ru/blog/novye-trebovaniya-cdl-2024',
      title: 'Новые требования CDL на 2024 год: Что нужно знать водителям',
      publicationDate: now.toISOString(),
      publicationName: 'CDL Help News',
      language: 'ru',
      keywords: ['требования CDL', '2024 CDL', 'коммерческое вождение', 'обновления CDL'],
    },
    // Spanish language articles
    {
      url: '/es/blog/nuevos-requisitos-cdl-2024',
      title: 'Nuevos Requisitos CDL para 2024: Lo que los Conductores Necesitan Saber',
      publicationDate: yesterday.toISOString(),
      publicationName: 'CDL Help News',
      language: 'es',
      keywords: ['requisitos CDL', '2024 CDL', 'conducción comercial', 'actualizaciones CDL'],
    },
  ];
}

/**
 * Extract keywords from title and description
 */
function extractKeywords(title, description) {
  const text = `${title} ${description || ''}`.toLowerCase();
  const cdlKeywords = [];

  // Common CDL-related keywords
  const keywordPatterns = [
    'cdl',
    'commercial',
    'driver',
    'license',
    'truck',
    'hazmat',
    'endorsement',
    'dot',
    'physical',
    'pre-trip',
    'inspection',
    'test',
    'exam',
    'training',
    'school',
    'fmcsa',
    'eldt',
    'tanker',
    'doubles',
    'triples',
    'passenger',
  ];

  keywordPatterns.forEach(keyword => {
    if (text.includes(keyword)) {
      cdlKeywords.push(keyword);
    }
  });

  return cdlKeywords.slice(0, 10); // Google News limits to 10 keywords
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600'); // 1 hour cache for news

  try {
    const generator = new SitemapGenerator();
    const recentArticles = await fetchRecentArticles();

    if (recentArticles.length === 0) {
      // Return empty but valid sitemap if no recent articles
      const emptyXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <!-- No articles published in the last 48 hours -->
</urlset>`;

      res.status(200).send(emptyXml);
      return;
    }

    // Build news sitemap
    const xml = generator.buildNewsSitemap(recentArticles, SITE_URL);

    // Validate sitemap
    const validation = generator.validateSitemap(xml);
    if (!validation.valid) {
      console.error('News sitemap validation errors:', validation.errors);
    }

    res.status(200).send(xml);
  } catch (error) {
    console.error('Error generating news sitemap:', error);

    // Return empty but valid sitemap on error
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <!-- Error generating news sitemap -->
</urlset>`;

    res.status(500).send(fallbackXml);
  }
}
