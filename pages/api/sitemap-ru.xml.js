/**
 * Locale-specific sitemaps for CDL Help
 * Generates individual sitemaps for each language
 */

import axios from 'axios';
const SitemapGenerator = require('../../lib/sitemap-generator');

const SITE_URL = process.env.BASE_URL || 'https://www.cdlhelp.com';
const LOCALES = ['ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt']; // Excluding 'en' as it's in main sitemap

async function fetchArticlesForLocale(locale) {
  try {
    if (!process.env.STRAPI_HOST || !process.env.STRAPI_PORT || !process.env.STRAPI_API_KEY) {
      return [];
    }

    const { data } = await axios.get(
      `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/api/articles`,
      {
        params: {
          'filters[locale][$eq]': locale,
          'populate[localizations]': '*',
        },
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
        },
      }
    );

    return data.data.map(article => ({
      slug: article.attributes.slug,
      updatedAt: article.attributes.updatedAt,
      locale: article.attributes.locale,
    }));
  } catch (error) {
    console.error(`Error fetching articles for locale ${locale}:`, error);
    return [];
  }
}

export default async function handler(req, res) {
  const locale = 'ru';

  // Validate locale
  if (false) {
    res.status(404).send('Sitemap not found');
    return;
  }

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');

  try {
    const generator = new SitemapGenerator();
    const today = new Date().toISOString().split('T')[0];
    const urls = [];

    // Static pages for this locale
    const staticPages = [
      { path: '', priority: 1.0, changefreq: 'daily' }, // Homepage for locale
      { path: '/download', priority: 0.9, changefreq: 'weekly' },
      { path: '/contact', priority: 0.6, changefreq: 'monthly' },
      { path: '/schools', priority: 0.8, changefreq: 'monthly' },
      { path: '/companies', priority: 0.7, changefreq: 'monthly' },
      { path: '/cdl-texas', priority: 0.7, changefreq: 'monthly' },
      { path: '/dot-physical-exam/search', priority: 0.6, changefreq: 'monthly' },
      { path: '/pre-trip-inspection/guide', priority: 0.8, changefreq: 'yearly' },
      { path: '/road-signs/test', priority: 0.7, changefreq: 'yearly' },
      { path: '/privacy-policy', priority: 0.3, changefreq: 'yearly' },
      { path: '/terms-conditions', priority: 0.3, changefreq: 'yearly' },
      { path: '/cookies-policy', priority: 0.3, changefreq: 'yearly' },
    ];

    // State pages
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
      staticPages.push({
        path: `/schools/${state}`,
        priority: 0.6,
        changefreq: 'monthly',
      });
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
      { state: 'wisconsin', cities: ['milwaukee'] },
    ];

    cities.forEach(stateObj => {
      stateObj.cities.forEach(city => {
        staticPages.push({
          path: `/schools/${stateObj.state}/${city}`,
          priority: 0.5,
          changefreq: 'monthly',
        });
      });
    });

    // Generate URLs with alternates
    staticPages.forEach(page => {
      const fullPath = page.path === '' ? `/${locale}` : `/${locale}${page.path}`;

      // Create alternates for all locales
      const alternates = [];

      // Add English version
      alternates.push({
        hreflang: 'en',
        href: `${SITE_URL}${page.path === '' ? '/' : page.path}`,
      });

      // Add other locale versions
      LOCALES.forEach(loc => {
        const altPath = page.path === '' ? `/${loc}` : `/${loc}${page.path}`;
        alternates.push({
          hreflang: loc,
          href: `${SITE_URL}${altPath}`,
        });
      });

      // Add x-default (English)
      alternates.push({
        hreflang: 'x-default',
        href: `${SITE_URL}${page.path === '' ? '/' : page.path}`,
      });

      urls.push({
        loc: `${SITE_URL}${fullPath}`,
        lastmod: today,
        changefreq: page.changefreq,
        priority: page.priority,
        alternates: alternates,
      });
    });

    // Fetch and add articles for this locale
    const articles = await fetchArticlesForLocale(locale);
    articles.forEach(article => {
      const articleUrl = `/${locale}/${article.slug}`;
      const lastmod = article.updatedAt ? article.updatedAt.split('T')[0] : today;

      urls.push({
        loc: `${SITE_URL}${articleUrl}`,
        lastmod: lastmod,
        changefreq: 'monthly',
        priority: 0.7,
      });
    });

    // Build sitemap
    const xml = generator.buildSitemap(urls);

    // Validate
    const validation = generator.validateSitemap(xml);
    if (!validation.valid) {
      console.error(`Sitemap validation errors for locale ${locale}:`, validation.errors);
    }

    res.status(200).send(xml);
  } catch (error) {
    console.error(`Error generating sitemap for locale ${locale}:`, error);

    // Return minimal valid sitemap on error
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${SITE_URL}/${locale}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    res.status(500).send(fallbackXml);
  }
}
