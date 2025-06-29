import axios from 'axios';

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
  'cdl-schools': 0.8,
  articles: 0.7,
  'pre-trip': 0.6,
  legal: 0.3,
  default: 0.5
};

// Change frequencies based on content type
const CHANGE_FREQUENCIES = {
  home: 'daily',
  download: 'weekly',
  'cdl-schools': 'monthly',
  articles: 'monthly',
  'pre-trip': 'yearly',
  legal: 'yearly',
  default: 'monthly'
};

async function fetchArticlesFromStrapi() {
  try {
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
        updatedAt: article.attributes.updatedAt
      });
      
      // Add localizations
      article.attributes.localizations?.data?.forEach(localization => {
        articles.push({
          slug: localization.attributes.slug,
          locale: localization.attributes.locale,
          updatedAt: localization.attributes.updatedAt
        });
      });
    });
    
    return articles;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

function generateUrlEntry(path, locale, lastmod, priority, changefreq, alternates = []) {
  const loc = locale === 'en' ? `${SITE_URL}${path}` : `${SITE_URL}/${locale}${path}`;
  
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
  if (path.includes('cdl-schools')) return 'cdl-schools';
  if (path.includes('pre-trip')) return 'pre-trip';
  if (path.includes('privacy') || path.includes('terms') || path.includes('cookies')) return 'legal';
  return 'articles';
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
  
  try {
    // Fetch dynamic content
    const articles = await fetchArticlesFromStrapi();
    const today = new Date().toISOString().split('T')[0];
    
    // Static pages with their paths
    const staticPages = [
      { path: '/', lastmod: today },
      { path: '/download', lastmod: today },
      { path: '/contact', lastmod: today },
      { path: '/cdl-schools', lastmod: today },
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
    const states = ['california', 'florida', 'illinois', 'new-york', 'ohio', 'pennsylvania', 'washington', 'wisconsin'];
    states.forEach(state => {
      staticPages.push({ path: `/cdl-schools/${state}`, lastmod: today });
    });
    
    // City pages
    const cities = [
      { state: 'california', cities: ['los-angeles', 'sacramento'] },
      { state: 'florida', cities: ['jacksonville', 'miami', 'orlando'] },
      { state: 'illinois', cities: ['chicago'] },
      { state: 'new-york', cities: ['new-york'] },
      { state: 'ohio', cities: ['cincinnati', 'columbus'] },
      { state: 'pennsylvania', cities: ['philadelphia'] },
      { state: 'washington', cities: ['seattle'] },
      { state: 'wisconsin', cities: ['milwaukee'] }
    ];
    
    cities.forEach(stateObj => {
      stateObj.cities.forEach(city => {
        staticPages.push({ path: `/cdl-schools/${stateObj.state}/${city}`, lastmod: today });
      });
    });
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;
    
    // Generate entries for static pages
    for (const page of staticPages) {
      const pageType = getPageType(page.path);
      const priority = PAGE_PRIORITIES[pageType] || PAGE_PRIORITIES.default;
      const changefreq = CHANGE_FREQUENCIES[pageType] || CHANGE_FREQUENCIES.default;
      
      // Generate alternates for each locale
      const alternates = LOCALES.map(locale => ({
        lang: locale,
        href: locale === 'en' ? `${SITE_URL}${page.path}` : `${SITE_URL}/${locale}${page.path}`
      }));
      
      // Add x-default
      alternates.push({
        lang: 'x-default',
        href: `${SITE_URL}${page.path}`
      });
      
      // Generate URL entry for each locale
      LOCALES.forEach(locale => {
        sitemap += generateUrlEntry(
          page.path,
          locale,
          page.lastmod,
          priority,
          changefreq,
          alternates
        );
      });
    }
    
    // Generate entries for articles
    for (const article of articles) {
      const articlePath = `/${article.slug}`;
      const lastmod = article.updatedAt ? article.updatedAt.split('T')[0] : today;
      
      // Find all alternate versions
      const alternates = articles
        .filter(a => a.slug === article.slug || articles.some(alt => alt.slug === article.slug))
        .map(a => ({
          lang: a.locale,
          href: a.locale === 'en' ? `${SITE_URL}/${a.slug}` : `${SITE_URL}/${a.locale}/${a.slug}`
        }));
      
      // Add x-default
      if (article.locale === 'en') {
        alternates.push({
          lang: 'x-default',
          href: `${SITE_URL}/${article.slug}`
        });
      }
      
      sitemap += generateUrlEntry(
        articlePath,
        article.locale,
        lastmod,
        PAGE_PRIORITIES.articles,
        CHANGE_FREQUENCIES.articles,
        alternates
      );
    }
    
    sitemap += `</urlset>`;
    
    res.status(200).send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
}