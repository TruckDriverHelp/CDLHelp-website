/**
 * URL utility functions for consistent URL handling
 */

/**
 * Remove trailing slash from URL path
 * @param {string} path - URL path
 * @returns {string} Path without trailing slash
 */
export function removeTrailingSlash(path) {
  if (path === '/') return path;
  return path.replace(/\/$/, '');
}

/**
 * Generate hreflang URLs for all supported languages
 * @param {string} currentPath - Current page path
 * @param {string[]} supportedLocales - Array of supported locale codes
 * @returns {Object} Object with locale codes as keys and paths as values
 */
export function generateHreflangUrls(
  currentPath,
  supportedLocales = ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt']
) {
  // Remove any existing locale prefix and trailing slashes
  const cleanPath = removeTrailingSlash(
    currentPath.replace(/^\/(ru|uk|ar|ko|zh|tr|pt)(\/|$)/, '/')
  );

  const hreflangUrls = {};

  supportedLocales.forEach(locale => {
    if (locale === 'en') {
      // English doesn't use locale prefix
      hreflangUrls[locale] = cleanPath;
    } else {
      // Other languages use locale prefix
      hreflangUrls[locale] = cleanPath === '/' ? `/${locale}` : `/${locale}${cleanPath}`;
    }
  });

  return hreflangUrls;
}

/**
 * Get canonical URL for a page
 * @param {string} path - Page path
 * @param {string} baseUrl - Base URL of the site
 * @returns {string} Full canonical URL
 */
export function getCanonicalUrl(path, baseUrl = 'https://www.cdlhelp.com') {
  const cleanPath = removeTrailingSlash(path);
  return `${baseUrl}${cleanPath}`;
}
