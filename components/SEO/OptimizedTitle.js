import { useTranslation } from 'next-i18next';
import { getSEOTitle } from '../../lib/seo-titles';

/**
 * Component to get optimized SEO title based on page and locale
 * @param {Object} props - Component props
 * @param {string} props.path - The page path
 * @param {string} props.locale - The locale code
 * @param {string} props.fallback - Fallback title if no optimized version exists
 * @returns {string} - The optimized title
 */
export const useOptimizedTitle = (path, locale, fallback) => {
  const { t } = useTranslation('seo-titles');

  // Try to get title from configuration
  const optimizedTitle = getSEOTitle(path, locale);

  // If we have an optimized title, return it
  if (optimizedTitle && optimizedTitle !== `${path} - CDL Help`) {
    return optimizedTitle;
  }

  // Try to get from translations
  const translationKey = getTranslationKey(path);
  if (translationKey) {
    const translatedTitle = t(`pageTitle.${translationKey}`, { defaultValue: '' });
    if (translatedTitle) {
      return translatedTitle;
    }
  }

  // Return fallback
  return fallback || `${formatPageName(path)} - CDL Help`;
};

/**
 * Get translation key from path
 */
function getTranslationKey(path) {
  // Remove leading slash and locale
  let cleanPath = path.replace(/^\//, '');
  const localePattern = /^(en|ar|ko|pt|ru|tr|zh|uk)\//;
  cleanPath = cleanPath.replace(localePattern, '');

  // Map paths to translation keys
  const pathMap = {
    'frequently-asked-questions': 'frequentlyAskedQuestions',
    'how-to-become-a-truck-driver': 'howToBecomeTruckDriver',
    'how-to-activate-promo': 'howToActivatePromo',
    'how-to-get-cdl': 'howToGetCdl',
    'how-to-use-cdl-help': 'howToUseCdlHelp',
    'what-is-taught-in-cdl-schools': 'whatIsTaughtInCdlSchools',
    contact: 'contact',
    companies: 'companies',
    'cookies-policy': 'cookiesPolicy',
    'privacy-policy': 'privacyPolicy',
    'terms-conditions': 'termsConditions',
    'cdl-texas': 'cdlTexas',
    schools: 'schools',
    'schools/california': 'schoolsCalifornia',
    'schools/florida': 'schoolsFlorida',
    'schools/illinois': 'schoolsIllinois',
    'schools/new-york': 'schoolsNewYork',
    'schools/ohio': 'schoolsOhio',
    'schools/pennsylvania': 'schoolsPennsylvania',
    'schools/washington': 'schoolsWashington',
    'schools/wisconsin': 'schoolsWisconsin',
    'schools/california/los-angeles': 'schoolsLosAngeles',
    'schools/california/sacramento': 'schoolsSacramento',
    'schools/florida/jacksonville': 'schoolsJacksonville',
    'schools/florida/orlando': 'schoolsOrlando',
    'schools/florida/miami': 'schoolsMiami',
    'schools/illinois/chicago': 'schoolsChicago',
    'schools/ohio/cincinnati': 'schoolsCincinnati',
    'schools/ohio/columbus': 'schoolsColumbus',
    'schools/pennsylvania/philadelphia': 'schoolsPhiladelphia',
    'schools/washington/seattle': 'schoolsSeattle',
    'schools/wisconsin/milwaukee': 'schoolsMilwaukee',
    'blog/article': 'blogArticle',
    'blog/essential-cdl-endorsements-guide-for-new-truckers': 'blogEndorsements',
    'blog/manual-vs-automatic-transmission-in-cdl-training-which-should-you-choose':
      'blogTransmission',
    'blog/eldt-requirements-what-new-cdl-drivers-need-to-know': 'blogEldt',
    'blog/how-to-get-cdl-permit': 'blogCdlPermit',
  };

  // Handle locale-specific paths
  const localePathMap = {
    // Arabic
    'alas-ila-alshaeia-musaedat-cdl': 'frequentlyAskedQuestions',
    'ma-yatimmu-tadrisuh-fi-madaris-cdl': 'whatIsTaughtInCdlSchools',
    'kayfiyat-astikhdam-tatbiq-cdl-musaeda': 'howToUseCdlHelp',
    'kayfiyat-alhusul-ala-rukhsa-cdl': 'howToGetCdlPermit',

    // Korean
    'cdl-eobtneun-bangbeob': 'howToGetCdl',
    'cdl-haggyoeseoneun-mueos-eul-galeuchimniga': 'whatIsTaughtInCdlSchools',
    'cdl-help-aeb-sayongbeob': 'howToUseCdlHelp',
    'jaju-mudneun-jilmun-cdl-doum': 'frequentlyAskedQuestions',
    'migug-eseo-teureog-unjeonsa-ga-doeneun-bangbeob': 'howToBecomeTruckDriver',
    'cdl-heogajeungeul-badneun-bangbeob': 'howToGetCdlPermit',

    // Portuguese
    'como-obter-cdl': 'howToGetCdl',
    'como-obter-uma-licenca-cdl': 'howToGetCdlPermit',
    'como-usar-o-cdl-help': 'howToUseCdlHelp',
    'perguntas-frequentes': 'frequentlyAskedQuestions',
    'sobre-as-escolas': 'whatIsTaughtInCdlSchools',

    // Russian
    'chasto-zadavaemye-voprosy': 'frequentlyAskedQuestions',
    'kak-poluchit-cdl': 'howToGetCdl',
    'kak-poluchit-cdl-permit': 'howToGetCdlPermit',
    'o-cdl-shkolakh': 'whatIsTaughtInCdlSchools',

    // Turkish
    'cdl-izni-nasil-alinir': 'howToGetCdlPermit',
    'cdl-nasil-alinir': 'howToGetCdl',
    'cdl-yardim-nasil-kullanilir': 'howToUseCdlHelp',
    'nasil-kamyon-soforu-olunur': 'howToBecomeTruckDriver',

    // Chinese
    'ruhe-huode-cdl': 'howToGetCdl',
    'guanyu-cdl-xuexiao': 'whatIsTaughtInCdlSchools',
    'changjian-wenti-cdl-bangzhu': 'frequentlyAskedQuestions',
    'ruhe-huode-cdl-xukezheng': 'howToGetCdlPermit',
    'ruhe-shiyong-cdl-bangzhu-yingyongchengxu': 'howToUseCdlHelp',

    // Ukrainian
    'yak-staty-dalekobiinykom-v-Amerytsi': 'howToBecomeTruckDriver',
    'yak-otrymaty-permit-cdl': 'howToGetCdlPermit',
    'yak-otrymaty-cdl': 'howToGetCdl',
    'choho-navchayut-u-shkolakh-cdl': 'whatIsTaughtInCdlSchools',
    'chasti-zapytannya': 'frequentlyAskedQuestions',
  };

  return pathMap[cleanPath] || localePathMap[cleanPath];
}

/**
 * Format page name from path
 */
function formatPageName(path) {
  const cleanPath = path.replace(/^\//, '').replace(/\/$/, '');
  const segments = cleanPath.split('/');
  const lastSegment = segments[segments.length - 1];
  const formatted = lastSegment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return formatted;
}
