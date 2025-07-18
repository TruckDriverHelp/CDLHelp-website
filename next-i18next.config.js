// @ts-check
const path = require('path');

/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
  // https://www.i18next.com/overview/configuration-options#logging
  debug: false,
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'],
  },
  defaultNS: 'common',
  /** To avoid issues when deploying to some paas (vercel...) */
  localePath: typeof window === 'undefined' ? path.resolve('./public/locales') : '/locales',

  reloadOnPrerender: process.env.NODE_ENV === 'development',

  /**
   * @link https://github.com/i18next/next-i18next#6-advanced-configuration
   */
  saveMissing: false,
  strictMode: true,
  serializeConfig: false,
  react: {
    useSuspense: false,
    transEmptyNodeValue: '',
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
  },
};
