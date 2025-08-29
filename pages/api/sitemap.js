import axios from 'axios';

// Ensure we're in a server environment
if (typeof window !== 'undefined') {
  throw new Error('This API route can only be run on the server');
}

// SEO Best Practices for Sitemaps:
// 1. Include all important pages
// 2. Use proper lastmod dates
// 3. Set appropriate changefreq and priority
// 4. Exclude duplicate/low-value pages
// 5. Split large sitemaps (>50k URLs) into multiple files
// 6. Include hreflang alternatives for multilingual sites

const SITE_URL = process.env.BASE_URL || 'https://www.cdlhelp.com';
const LOCALES = ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'];

// Page priorities based on importance
const PAGE_PRIORITIES = {
  home: 1.0,
  download: 0.9,
  schools: 0.8,
  articles: 0.7,
  'pre-trip': 0.6,
  legal: 0.3,
  default: 0.5,
};

// Change frequencies based on content type
const CHANGE_FREQUENCIES = {
  home: 'daily',
  download: 'weekly',
  schools: 'monthly',
  articles: 'monthly',
  'pre-trip': 'yearly',
  legal: 'yearly',
  default: 'monthly',
};

async function fetchArticlesFromStrapi() {
  try {
    // Skip if Strapi is not configured
    if (!process.env.STRAPI_HOST || !process.env.STRAPI_PORT || !process.env.STRAPI_API_KEY) {
      return [];
    }

    const { data } = await axios.get(
      `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/api/articles?populate[localizations]=*`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
        },
      }
    );

    const articles = [];
    data.data.forEach(article => {
      // Add main article
      articles.push({
        slug: article.attributes.slug,
        locale: article.attributes.locale,
        updatedAt: article.attributes.updatedAt,
      });

      // Add localizations
      article.attributes.localizations?.data?.forEach(localization => {
        articles.push({
          slug: localization.attributes.slug,
          locale: localization.attributes.locale,
          updatedAt: localization.attributes.updatedAt,
        });
      });
    });

    return articles;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching articles:', error);
    }
    return [];
  }
}

function generateUrlEntry(path, locale, lastmod, priority, changefreq, alternates = []) {
  let loc;
  if (locale === 'en') {
    loc = `${SITE_URL}${path}`;
  } else {
    // For non-English pages, don't add trailing slash since Next.js is configured with trailingSlash: false
    loc = path === '' ? `${SITE_URL}/${locale}` : `${SITE_URL}/${locale}${path}`;
  }

  let entry = `  <url>\n`;
  entry += `    <loc>${loc}</loc>\n`;

  if (lastmod) {
    entry += `    <lastmod>${lastmod}</lastmod>\n`;
  }

  entry += `    <changefreq>${changefreq}</changefreq>\n`;
  entry += `    <priority>${priority}</priority>\n`;

  // Add hreflang alternatives
  if (alternates.length > 0) {
    alternates.forEach(alt => {
      entry += `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${alt.href}"/>\n`;
    });
  }

  entry += `  </url>\n`;

  return entry;
}

function getPageType(path) {
  if (path === '/' || path === '') return 'home';
  if (path.includes('download')) return 'download';
  if (path.includes('schools')) return 'schools';
  if (path.includes('pre-trip')) return 'pre-trip';
  if (path.includes('privacy') || path.includes('terms') || path.includes('cookies'))
    return 'legal';
  return 'articles';
}

export default async function handler(req, res) {
  // Always set XML headers first
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');

  try {
    // Check if required environment variables are set
    if (!process.env.STRAPI_HOST || !process.env.STRAPI_PORT || !process.env.STRAPI_API_KEY) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Missing required environment variables for Strapi connection');
      }
      // Continue without articles if Strapi is not configured
    }

    // Fetch dynamic content
    const articles = await fetchArticlesFromStrapi();
    const today = new Date().toISOString().split('T')[0];

    // Static pages with their paths
    const staticPages = [
      { path: '/', lastmod: today },
      { path: '/download', lastmod: today },
      { path: '/contact', lastmod: today },
      { path: '/schools', lastmod: today },
      { path: '/companies', lastmod: today },
      { path: '/cdl-texas', lastmod: today },
      { path: '/dot-physical-exam/search', lastmod: today },
      { path: '/pre-trip-inspection/guide', lastmod: today },
      { path: '/road-signs/test', lastmod: today },
      { path: '/privacy-policy', lastmod: today },
      { path: '/terms-conditions', lastmod: today },
      { path: '/cookies-policy', lastmod: today },
    ];

    // State pages for CDL schools
    const states = [
      'california',
      'florida',
      'illinois',
      'new-york',
      'ohio',
      'pennsylvania',
      'washington',
      'wisconsin',
    ];
    states.forEach(state => {
      staticPages.push({ path: `/schools/${state}`, lastmod: today });
    });

    // City pages
    const cities = [
      { state: 'california', cities: ['los-angeles', 'sacramento'] },
      { state: 'florida', cities: ['jacksonville', 'miami', 'orlando'] },
      { state: 'illinois', cities: ['chicago'] },
      // { state: 'new-york', cities: ['new-york'] }, // Removed: this page redirects and doesn't exist
      { state: 'ohio', cities: ['cincinnati', 'columbus'] },
      { state: 'pennsylvania', cities: ['philadelphia'] },
      { state: 'washington', cities: ['seattle'] },
      { state: 'wisconsin', cities: ['milwaukee'] },
    ];

    cities.forEach(stateObj => {
      stateObj.cities.forEach(city => {
        staticPages.push({ path: `/schools/${stateObj.state}/${city}`, lastmod: today });
      });
    });

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

    // Track generated URLs to avoid duplicates
    const generatedUrls = new Set();

    // Generate entries for static pages
    for (const page of staticPages) {
      const pageType = getPageType(page.path);
      const priority = PAGE_PRIORITIES[pageType] || PAGE_PRIORITIES.default;
      const changefreq = CHANGE_FREQUENCIES[pageType] || CHANGE_FREQUENCIES.default;

      // Skip home page for non-English locales to avoid /ru/ redirect
      if (page.path === '/' && LOCALES.length > 1) {
        // Only add the English home page
        const urlKey = `${SITE_URL}/`;
        if (!generatedUrls.has(urlKey)) {
          generatedUrls.add(urlKey);
          const alternates = LOCALES.map(locale => ({
            lang: locale,
            href: locale === 'en' ? `${SITE_URL}/` : `${SITE_URL}/${locale}`,
          }));
          alternates.push({
            lang: 'x-default',
            href: `${SITE_URL}/`,
          });
          sitemap += generateUrlEntry('/', 'en', page.lastmod, priority, changefreq, alternates);
        }
        // Add non-English homepages separately
        LOCALES.filter(locale => locale !== 'en').forEach(locale => {
          const urlKey = `${SITE_URL}/${locale}`;
          if (!generatedUrls.has(urlKey)) {
            generatedUrls.add(urlKey);
            const homeAlternates = LOCALES.map(loc => ({
              lang: loc,
              href: loc === 'en' ? `${SITE_URL}/` : `${SITE_URL}/${loc}`,
            }));
            homeAlternates.push({
              lang: 'x-default',
              href: `${SITE_URL}/`,
            });
            sitemap += generateUrlEntry(
              '',
              locale,
              page.lastmod,
              priority,
              changefreq,
              homeAlternates
            );
          }
        });
        continue;
      }

      // Generate alternates for each locale
      const alternates = LOCALES.map(locale => ({
        lang: locale,
        href: locale === 'en' ? `${SITE_URL}${page.path}` : `${SITE_URL}/${locale}${page.path}`,
      }));

      // Add x-default
      alternates.push({
        lang: 'x-default',
        href: `${SITE_URL}${page.path}`,
      });

      // Generate URL entry for each locale
      LOCALES.forEach(locale => {
        const urlKey =
          locale === 'en' ? `${SITE_URL}${page.path}` : `${SITE_URL}/${locale}${page.path}`;
        if (!generatedUrls.has(urlKey)) {
          generatedUrls.add(urlKey);
          sitemap += generateUrlEntry(
            page.path,
            locale,
            page.lastmod,
            priority,
            changefreq,
            alternates
          );
        }
      });
    }

    // Generate entries for articles if available
    if (articles && articles.length > 0) {
      for (const article of articles) {
        const articlePath = `/${article.slug}`;
        const lastmod = article.updatedAt ? article.updatedAt.split('T')[0] : today;

        // Find all alternate versions
        const alternates = articles
          .filter(a => a.slug === article.slug || articles.some(alt => alt.slug === article.slug))
          .map(a => ({
            lang: a.locale,
            href: a.locale === 'en' ? `${SITE_URL}/${a.slug}` : `${SITE_URL}/${a.locale}/${a.slug}`,
          }));

        // Add x-default
        if (article.locale === 'en') {
          alternates.push({
            lang: 'x-default',
            href: `${SITE_URL}/${article.slug}`,
          });
        }

        const urlKey =
          article.locale === 'en'
            ? `${SITE_URL}/${article.slug}`
            : `${SITE_URL}/${article.locale}/${article.slug}`;
        if (!generatedUrls.has(urlKey)) {
          generatedUrls.add(urlKey);
          sitemap += generateUrlEntry(
            articlePath,
            article.locale,
            lastmod,
            PAGE_PRIORITIES.articles,
            CHANGE_FREQUENCIES.articles,
            alternates
          );
        }
      }
    }

    sitemap += `</urlset>`;

    res.status(200).send(sitemap);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error generating sitemap:', error);
    }
    if (process.env.NODE_ENV === 'development') {
      console.error('Error details:', error.message);
    }
    if (process.env.NODE_ENV === 'development') {
      console.error('Stack trace:', error.stack);
    }

    // Send a valid XML error response
    const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Error generating sitemap: ${error.message} -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    res.status(500).send(errorXml);
  }
}
