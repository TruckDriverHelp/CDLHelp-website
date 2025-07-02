/**
 * Map of known article slug translations
 * This serves as a fallback when Strapi data is incorrect
 */
export const ARTICLE_SLUG_TRANSLATIONS = {
  // How to get CDL
  'how-to-get-cdl': {
    en: 'how-to-get-cdl',
    ru: 'kak-poluchit-cdl',
    uk: 'yak-otrymaty-cdl',
    ar: 'kayfa-tahsil-cdl',
    ko: 'cdl-eobtneun-bangbeob',
    zh: 'ruhe-huode-cdl',
    tr: 'cdl-nasil-alinir',
    pt: 'como-obter-cdl'
  },
  // How to become a truck driver
  'how-to-become-a-truck-driver': {
    en: 'how-to-become-a-truck-driver',
    ru: 'kak-stat-dalnoboishikom',
    uk: 'yak-staty-dalekobiinykom-v-Amerytsi',
    ar: 'kayfa-tusbih-sayiq-shahinat-fi-alwilayat-almutahida',
    ko: 'migug-eseo-teureog-unjeonsa-ga-doeneun-bangbeob',
    zh: 'ruhe-chengwei-meiguo-kache-siji',
    tr: 'nasil-kamyon-soforu-olunur',
    pt: 'como-se-tornar-motorista-de-caminhaoo'
  },
  // How to use CDL Help
  'how-to-use-cdl-help': {
    en: 'how-to-use-cdl-help',
    ru: 'kak-ispolzovat-cdlhelp',
    uk: 'yak-vykorystovuvaty-dodatok-cdl-help',
    ar: 'kayfiyat-astikhdam-tatbiq-cdl-musaeda',
    ko: 'cdl-help-aeb-sayongbeob',
    zh: 'ruhe-shiyong-cdl-bangzhu-yingyongchengxu',
    tr: 'cdl-yardim-nasil-kullanilir',
    pt: 'como-usar-o-cdl-help'
  },
  // How to get CDL permit
  'how-to-get-cdl-permit': {
    en: 'how-to-get-cdl-permit',
    ru: 'kak-poluchit-cdl-permit',
    uk: 'yak-otrymaty-permit-cdl',
    ar: 'kayfiyat-alhusul-ala-rukhsa-cdl',
    ko: 'cdl-heogajeungeul-badneun-bangbeob',
    zh: 'ruhe-huode-cdl-xukezheng',
    tr: 'cdl-izni-nasil-alinir',
    pt: 'como-obter-uma-licenca-cdl'
  },
  // FAQ
  'frequently-asked-questions': {
    en: 'frequently-asked-questions',
    ru: 'chasto-zadavaemye-voprosy',
    uk: 'chasti-zapytannya',
    ar: 'alas-ila-alshaeia-musaedat-cdl',
    ko: 'jaju-mudneun-jilmun-cdl-doum',
    zh: 'changjian-wenti-cdl-bangzhu',
    tr: 'sikca-sorulan-sorular',
    pt: 'perguntas-frequentes'
  },
  // About CDL schools
  'cdl-driving-schools': {
    en: 'cdl-driving-schools',
    ru: 'o-cdl-shkolakh',
    uk: 'choho-navchayut-u-shkolakh-cdl',
    ar: 'ma-yatimmu-tadrisuh-fi-madaris-cdl',
    ko: 'cdl-haggyoeseoneun-mueos-eul-galeuchimniga',
    zh: 'guanyu-cdl-xuexiao',
    tr: 'cdl-okul',
    pt: 'sobre-as-escolas'
  }
};

/**
 * Get the correct slug for a given article in a specific locale
 */
export function getLocalizedSlug(currentSlug, targetLocale, currentLocale = 'en') {
  // First, try to find the article in our translations map
  for (const [baseSlug, translations] of Object.entries(ARTICLE_SLUG_TRANSLATIONS)) {
    // Check if the current slug matches any translation
    if (Object.values(translations).includes(currentSlug)) {
      // Found it! Return the translation for the target locale
      return translations[targetLocale] || currentSlug;
    }
  }
  
  // If not found in translations, return the current slug
  // This is a fallback for articles not in our map
  return currentSlug;
}

/**
 * Generate proper hreflang URLs for an article
 */
export function generateArticleHreflangUrls(article, currentLocale, currentSlug, isBlogPost = false) {
  const locales = ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'];
  const hreflangUrls = {};
  
  // If article has localizations data, use that
  if (article.localizations && article.localizations.data) {
    // Add current article
    hreflangUrls[currentLocale] = currentLocale === 'en' 
      ? `${isBlogPost ? '/blog' : ''}/${currentSlug}` 
      : `/${currentLocale}${isBlogPost ? '/blog' : ''}/${currentSlug}`;
    
    // Add localizations
    article.localizations.data.forEach(loc => {
      const locale = loc.attributes.locale;
      const slug = loc.attributes.slug;
      hreflangUrls[locale] = locale === 'en' 
        ? `${isBlogPost ? '/blog' : ''}/${slug}` 
        : `/${locale}${isBlogPost ? '/blog' : ''}/${slug}`;
    });
  } else {
    // Fallback to using slug translations
    locales.forEach(locale => {
      const localizedSlug = getLocalizedSlug(currentSlug, locale, currentLocale);
      hreflangUrls[locale] = locale === 'en' 
        ? `${isBlogPost ? '/blog' : ''}/${localizedSlug}` 
        : `/${locale}${isBlogPost ? '/blog' : ''}/${localizedSlug}`;
    });
  }
  
  return hreflangUrls;
}