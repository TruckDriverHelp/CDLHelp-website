/**
 * Centralized hreflang configuration for CDL Help website
 *
 * This configuration maps which pages have actual translations
 * to prevent generating hreflang tags for non-existent pages.
 *
 * Based on analysis of translation files and actual page rendering.
 */

// All supported locales
export const SUPPORTED_LOCALES = ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'];

// Proper hreflang locale codes per Google's specifications
export const HREFLANG_LOCALE_MAP = {
  en: 'en-US',
  ru: 'ru-RU',
  uk: 'uk-UA',
  ar: 'ar-SA',
  ko: 'ko-KR',
  zh: 'zh-CN',
  tr: 'tr-TR',
  pt: 'pt-BR',
};

/**
 * Pages that have full translations in all locales
 * Based on presence of translation files and actual content
 */
export const FULLY_TRANSLATED_PAGES = [
  '/', // Homepage - all locales
  '/contact', // Contact page - all locales
  '/download', // Download page - all locales
  '/blog', // Blog listing - all locales
  '/companies', // Companies page - all locales
  '/cdl-texas', // CDL Texas test - all locales
  '/road-signs/test', // Road signs test - all locales
  '/pre-trip-inspection/guide', // Pre-trip guide - all locales
  '/privacy-policy', // Privacy policy - all locales
  '/terms-conditions', // Terms - all locales
  '/cookies-policy', // Cookies - all locales
  '/dot-physical-exam/search', // DOT physical search - all locales
];

/**
 * Pages that exist but with limited/no translations
 * These should only have hreflang for locales where content exists
 */
export const PARTIALLY_TRANSLATED_PAGES = {
  // Schools pages - translation files exist but content may be English-only
  '/schools': SUPPORTED_LOCALES, // Has city-schools.json translations
  '/schools/*': SUPPORTED_LOCALES, // Dynamic school pages use city-schools.json

  // Pre-trip inspection guide page only - individual sections are English-only
  '/pre-trip-inspection/guide': SUPPORTED_LOCALES,
  '/pre-trip-inspection/*': ['en'], // Individual section pages are English-only

  // School state pages - English only
  '/school/*': ['en'], // State-specific school pages
};

/**
 * Dynamic content from Strapi CMS
 * These pages get their hreflang from the CMS
 */
export const CMS_MANAGED_PAGES = [
  '/blog/*', // Blog posts
  '/*', // Root-level articles (non-blog)
];

/**
 * Special handling for article slug translations
 * Maps English slugs to localized versions
 */
export const ARTICLE_SLUG_TRANSLATIONS = {
  'frequently-asked-questions': {
    en: 'frequently-asked-questions',
    ru: 'chasto-zadavaemye-voprosy',
    uk: 'chasti-zapytannya',
    ar: 'alas-ila-alshaeia-musaedat-cdl',
    ko: 'jaju-mudneun-jilmun-cdl-doum',
    zh: 'changjian-wenti-cdl-bangzhu',
    tr: 'sikca-sorulan-sorular',
    pt: 'perguntas-frequentes',
  },
  'how-to-activate-promo': {
    en: 'how-to-activate-promo',
    ru: 'kak-aktivirovat-promokod',
  },
  'how-to-become-a-truck-driver': {
    en: 'how-to-become-a-truck-driver',
    ru: 'kak-stat-dalnoboishikom',
    uk: 'yak-staty-dalekobiinykom-v-Amerytsi',
    ar: 'kayfa-tusbih-sayiq-shahinat-fi-alwilayat-almutahida',
    ko: 'migug-eseo-teureog-unjeonsa-ga-doeneun-bangbeob',
    zh: 'ruhe-chengwei-meiguo-kache-siji',
    tr: 'nasil-kamyon-soforu-olunur',
    pt: 'como-se-tornar-motorista-de-caminhaoo',
  },
  'how-to-get-cdl': {
    en: 'how-to-get-cdl',
    ru: 'kak-poluchit-cdl',
    uk: 'yak-otrymaty-cdl',
    ar: 'kayfa-tahsil-cdl',
    ko: 'cdl-eobtneun-bangbeob',
    zh: 'ruhe-huode-cdl',
    tr: 'cdl-nasil-alinir',
    pt: 'como-obter-cdl',
  },
  'how-to-get-cdl-permit': {
    en: 'how-to-get-cdl-permit',
    ru: 'kak-poluchit-cdl-permit',
    uk: 'yak-otrymaty-permit-cdl',
    ar: 'kayfiyat-alhusul-ala-rukhsa-cdl',
    ko: 'cdl-heogajeungeul-badneun-bangbeob',
    zh: 'ruhe-huode-cdl-xukezheng',
    tr: 'cdl-izni-nasil-alinir',
    pt: 'como-obter-uma-licenca-cdl',
  },
  'how-to-use-cdl-help': {
    en: 'how-to-use-cdl-help',
    ru: 'kak-ispolzovat-cdlhelp',
    uk: 'yak-vykorystovuvaty-dodatok-cdl-help',
    ar: 'kayfiyat-astikhdam-tatbiq-cdl-musaeda',
    ko: 'cdl-help-aeb-sayongbeob',
    zh: 'ruhe-shiyong-cdl-bangzhu-yingyongchengxu',
    tr: 'cdl-yardim-nasil-kullanilir',
    pt: 'como-usar-o-cdl-help',
  },
  'what-is-taught-in-cdl-schools': {
    en: 'what-is-taught-in-cdl-schools',
    ru: 'o-cdl-shkolakh',
    uk: 'choho-navchayut-u-shkolakh-cdl',
    ar: 'ma-yatimmu-tadrisuh-fi-madaris-cdl',
    ko: 'cdl-haggyoeseoneun-mueos-eul-galeuchimniga',
    zh: 'guanyu-cdl-xuexiao',
    tr: 'cdl-okul',
    pt: 'sobre-as-escolas',
  },
};

/**
 * Blog post slug translations
 */
export const BLOG_SLUG_TRANSLATIONS = {
  article: {
    en: 'article',
  },
  'eldt-requirements-what-new-cdl-drivers-need-to-know': {
    en: 'eldt-requirements-what-new-cdl-drivers-need-to-know',
  },
  'essential-cdl-endorsements-guide-for-new-truckers': {
    en: 'essential-cdl-endorsements-guide-for-new-truckers',
  },
  'manual-vs-automatic-transmission-in-cdl-training-which-should-you-choose': {
    en: 'manual-vs-automatic-transmission-in-cdl-training-which-should-you-choose',
  },
  'how-to-get-cdl-permit': {
    en: 'how-to-get-cdl-permit',
  },
};

/**
 * Determines which locales have translations for a given path
 * @param {string} pathname - The URL path to check
 * @returns {string[]} Array of locale codes that have translations
 */
export function getAvailableLocalesForPath(pathname) {
  // Remove query parameters and hash
  const cleanPath = pathname.split('?')[0].split('#')[0];

  // Remove locale prefix if present
  const pathWithoutLocale = cleanPath.replace(/^\/(ru|uk|ar|ko|zh|tr|pt)(\/|$)/, '/');

  // Check if it's a fully translated page
  if (FULLY_TRANSLATED_PAGES.includes(pathWithoutLocale)) {
    return SUPPORTED_LOCALES;
  }

  // Check partially translated pages
  for (const [pattern, locales] of Object.entries(PARTIALLY_TRANSLATED_PAGES)) {
    if (pattern.includes('*')) {
      const basePattern = pattern.replace('/*', '');
      if (pathWithoutLocale.startsWith(basePattern)) {
        return locales;
      }
    } else if (pathWithoutLocale === pattern) {
      return locales;
    }
  }

  // Check if it's a CMS-managed page (articles/blog posts)
  // These should be handled by Strapi data
  for (const pattern of CMS_MANAGED_PAGES) {
    if (pattern === '/*') {
      // Root-level articles - check if it matches known article slugs
      const slug = pathWithoutLocale.replace('/', '');
      if (ARTICLE_SLUG_TRANSLATIONS[slug]) {
        return Object.keys(ARTICLE_SLUG_TRANSLATIONS[slug]);
      }
    } else if (pattern === '/blog/*') {
      // Blog posts - check if it matches known blog slugs
      const slug = pathWithoutLocale.replace('/blog/', '');
      if (BLOG_SLUG_TRANSLATIONS[slug]) {
        return Object.keys(BLOG_SLUG_TRANSLATIONS[slug]);
      }
    }
  }

  // Default: only current locale (no alternate versions)
  return ['en'];
}

/**
 * Generates proper hreflang URLs for a given path
 * @param {string} pathname - The current URL path
 * @param {string} currentLocale - The current locale
 * @param {Object} articleData - Optional article data from Strapi
 * @returns {Object} Object with locale keys and URL values
 */
export function generateHreflangUrls(pathname, currentLocale = 'en', articleData = null) {
  const availableLocales = getAvailableLocalesForPath(pathname);
  const hreflangUrls = {};

  // Remove locale prefix from pathname
  const pathWithoutLocale = pathname.replace(/^\/(ru|uk|ar|ko|zh|tr|pt)(\/|$)/, '/');

  // If article data is provided (from Strapi), use it
  if (articleData && articleData.localizations) {
    // Handle Strapi-provided localizations
    articleData.localizations.forEach(loc => {
      if (loc.locale === 'en') {
        hreflangUrls.en = `/${loc.slug}`;
      } else {
        hreflangUrls[loc.locale] = `/${loc.locale}/${loc.slug}`;
      }
    });

    // Add current locale
    if (currentLocale === 'en') {
      hreflangUrls.en = pathWithoutLocale;
    } else {
      hreflangUrls[currentLocale] = `/${currentLocale}${pathWithoutLocale}`;
    }
  } else {
    // Generate URLs based on available locales
    availableLocales.forEach(locale => {
      // Check if we have slug translations for articles
      const slug = pathWithoutLocale.replace('/', '').replace('/blog/', '');

      let localizedSlug = slug;

      // Check article translations
      if (ARTICLE_SLUG_TRANSLATIONS[slug] && ARTICLE_SLUG_TRANSLATIONS[slug][locale]) {
        localizedSlug = ARTICLE_SLUG_TRANSLATIONS[slug][locale];
      }
      // Check blog translations
      else if (BLOG_SLUG_TRANSLATIONS[slug] && BLOG_SLUG_TRANSLATIONS[slug][locale]) {
        localizedSlug = BLOG_SLUG_TRANSLATIONS[slug][locale];
      }

      // Build the URL
      if (locale === 'en') {
        if (pathWithoutLocale.startsWith('/blog/')) {
          hreflangUrls.en = `/blog/${localizedSlug}`;
        } else if (pathWithoutLocale === '/') {
          hreflangUrls.en = '/';
        } else {
          hreflangUrls.en = localizedSlug === slug ? pathWithoutLocale : `/${localizedSlug}`;
        }
      } else {
        if (pathWithoutLocale.startsWith('/blog/')) {
          hreflangUrls[locale] = `/${locale}/blog/${localizedSlug}`;
        } else if (pathWithoutLocale === '/') {
          hreflangUrls[locale] = `/${locale}`;
        } else {
          hreflangUrls[locale] =
            localizedSlug === slug
              ? `/${locale}${pathWithoutLocale}`
              : `/${locale}/${localizedSlug}`;
        }
      }
    });
  }

  return hreflangUrls;
}

/**
 * Validates if a hreflang URL actually exists
 * Used to prevent linking to non-existent pages
 * @param {string} url - The URL to validate
 * @param {string} locale - The locale code
 * @returns {boolean} True if the page exists
 */
export function validateHreflangUrl(url, locale) {
  // Remove domain if present
  const path = url.replace(/^https?:\/\/[^\/]+/, '');

  // Get available locales for this path
  const availableLocales = getAvailableLocalesForPath(path);

  return availableLocales.includes(locale);
}

/**
 * Helper to check if a page should have hreflang tags at all
 * Some pages should not have any hreflang (e.g., 404, admin pages)
 * @param {string} pathname - The URL path
 * @returns {boolean} True if hreflang should be added
 */
export function shouldHaveHreflang(pathname) {
  const excludedPaths = ['/404', '/api', '/_next', '/admin', '/test'];

  return !excludedPaths.some(path => pathname.startsWith(path));
}
