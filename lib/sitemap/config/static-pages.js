/**
 * Static pages configuration for sitemap generation
 */

const STATIC_PAGES = {
  // Universal pages available in all locales
  universal: [
    { path: '/', priority: 1.0, changefreq: 'daily' },
    { path: '/cdl-practice-test', priority: 0.9, changefreq: 'weekly' },
    { path: '/download', priority: 0.9, changefreq: 'monthly' },
    { path: '/about', priority: 0.7, changefreq: 'monthly' },
    { path: '/contact', priority: 0.7, changefreq: 'monthly' },
    { path: '/privacy-policy', priority: 0.3, changefreq: 'yearly' },
    { path: '/terms-conditions', priority: 0.3, changefreq: 'yearly' },
  ],

  // Test pages
  tests: [
    { path: '/general-knowledge', priority: 0.8, changefreq: 'weekly' },
    { path: '/air-brakes', priority: 0.8, changefreq: 'weekly' },
    { path: '/combination-vehicles', priority: 0.8, changefreq: 'weekly' },
    { path: '/hazmat', priority: 0.8, changefreq: 'weekly' },
    { path: '/tanker', priority: 0.7, changefreq: 'weekly' },
    { path: '/double-triple', priority: 0.7, changefreq: 'weekly' },
    { path: '/passenger', priority: 0.7, changefreq: 'weekly' },
    { path: '/school-bus', priority: 0.7, changefreq: 'weekly' },
  ],

  // Guide pages
  guides: [
    { path: '/pre-trip-inspection/guide', priority: 0.8, changefreq: 'monthly' },
    { path: '/blog', priority: 0.7, changefreq: 'daily' },
    { path: '/schools', priority: 0.7, changefreq: 'weekly' },
    { path: '/companies', priority: 0.6, changefreq: 'monthly' },
  ],

  // Locale-specific pages (not available in all locales)
  localeSpecific: {
    ru: [
      { path: '/kak-poluchit-cdl', priority: 0.7, changefreq: 'monthly' },
      { path: '/kak-stat-dalnoboishikom', priority: 0.7, changefreq: 'monthly' },
      { path: '/kak-ispolzovat-cdlhelp', priority: 0.6, changefreq: 'monthly' },
      { path: '/o-cdl-shkolakh', priority: 0.6, changefreq: 'monthly' },
      { path: '/chasto-zadavaemye-voprosy', priority: 0.5, changefreq: 'monthly' },
    ],
    uk: [
      { path: '/yak-otrymaty-cdl', priority: 0.7, changefreq: 'monthly' },
      { path: '/pro-cdl-shkoly', priority: 0.6, changefreq: 'monthly' },
    ],
  },

  // Pages with limited locale support
  limitedLocale: {
    '/schools': ['en'],
    '/schools/[state]': ['en'],
    '/schools/[state]/[city]': ['en'],
    '/companies': ['en', 'ru'],
    '/companies/[slug]': ['en', 'ru'],
  },
};

// Supported locales
const LOCALES = {
  all: ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'],
  default: 'en',
  rtl: ['ar'], // Right-to-left languages
};

// Sitemap configuration
const SITEMAP_CONFIG = {
  baseUrl: process.env.BASE_URL || 'https://www.cdlhelp.com',
  maxUrlsPerSitemap: 45000, // Safety margin (max is 50000)
  maxSizeInBytes: 45 * 1024 * 1024, // 45MB (max is 50MB)
  defaultChangefreq: 'weekly',
  defaultPriority: 0.5,
  gzipCompression: true,
  prettyPrint: process.env.NODE_ENV !== 'production',
};

module.exports = {
  STATIC_PAGES,
  LOCALES,
  SITEMAP_CONFIG,
};
