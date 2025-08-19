/**
 * URL Validation and Generation Utilities
 * Prevents duplicate locale paths and other URL malformations
 */

const VALID_LOCALES = ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'];

/**
 * Validates and constructs a properly formatted localized path
 * Prevents duplicate locale prefixes in URLs
 * @param {string} path - The path to validate
 * @param {string} locale - The locale to apply
 * @returns {string} - The validated path
 */
export function validateLocalizedPath(path, locale) {
  // Ensure path starts with /
  if (!path.startsWith('/')) {
    path = '/' + path;
  }

  // Remove any existing locale prefix from the path
  const pathWithoutLocale = removeLocaleFromPath(path);

  // For English (default locale), return path without locale prefix
  if (locale === 'en') {
    return pathWithoutLocale;
  }

  // For other locales, add the locale prefix
  return `/${locale}${pathWithoutLocale}`;
}

/**
 * Removes locale prefix from a path if present
 * @param {string} path - The path to clean
 * @returns {string} - Path without locale prefix
 */
export function removeLocaleFromPath(path) {
  // Check if path starts with any valid locale
  const pathSegments = path.split('/').filter(Boolean);

  if (pathSegments.length > 0 && VALID_LOCALES.includes(pathSegments[0])) {
    // Remove the locale segment
    return '/' + pathSegments.slice(1).join('/');
  }

  return path || '/';
}

/**
 * Checks if a path has duplicate locale segments
 * @param {string} path - The path to check
 * @returns {boolean} - True if duplicate locales found
 */
export function hasDuplicateLocale(path) {
  const segments = path.split('/').filter(Boolean);

  // Check for patterns like /ar/something/ar/something
  for (let i = 0; i < segments.length - 1; i++) {
    if (VALID_LOCALES.includes(segments[i])) {
      // Check if the same locale appears later in the path
      for (let j = i + 1; j < segments.length; j++) {
        if (segments[i] === segments[j]) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Fixes a path with duplicate locale segments
 * @param {string} path - The path to fix
 * @returns {string} - Fixed path
 */
export function fixDuplicateLocalePath(path) {
  if (!hasDuplicateLocale(path)) {
    return path;
  }

  const segments = path.split('/').filter(Boolean);
  const result = [];
  const seenLocale = new Set();

  for (const segment of segments) {
    if (VALID_LOCALES.includes(segment)) {
      if (!seenLocale.has(segment)) {
        result.push(segment);
        seenLocale.add(segment);
      }
      // Skip duplicate locale segments
    } else {
      result.push(segment);
    }
  }

  return '/' + result.join('/');
}

/**
 * Checks if a path has self-referencing segments
 * @param {string} path - The path to check
 * @returns {boolean} - True if self-referencing found
 */
export function hasSelfReference(path) {
  const segments = path.split('/').filter(Boolean);

  // Check for patterns like /contact/contact
  if (segments.length >= 2) {
    for (let i = 0; i < segments.length - 1; i++) {
      if (segments[i] === segments[i + 1] && !VALID_LOCALES.includes(segments[i])) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Fixes self-referencing paths
 * @param {string} path - The path to fix
 * @returns {string} - Fixed path
 */
export function fixSelfReferencingPath(path) {
  if (!hasSelfReference(path)) {
    return path;
  }

  const segments = path.split('/').filter(Boolean);
  const result = [];
  let lastSegment = null;

  for (const segment of segments) {
    // Skip duplicate consecutive segments (unless they're locales)
    if (segment === lastSegment && !VALID_LOCALES.includes(segment)) {
      continue;
    }
    result.push(segment);
    lastSegment = segment;
  }

  return '/' + result.join('/');
}

/**
 * Comprehensive URL validation and fixing
 * @param {string} url - The URL to validate
 * @param {string} locale - The current locale
 * @returns {string} - The validated and fixed URL
 */
export function validateAndFixUrl(url, locale = 'en') {
  // First, fix any duplicate locale paths
  let fixedUrl = fixDuplicateLocalePath(url);

  // Then fix any self-referencing paths
  fixedUrl = fixSelfReferencingPath(fixedUrl);

  // Finally, ensure proper locale prefix
  fixedUrl = validateLocalizedPath(fixedUrl, locale);

  return fixedUrl;
}

/**
 * Generates a properly formatted locale-aware URL
 * @param {string} path - The base path
 * @param {string} locale - The locale to use
 * @param {object} options - Additional options
 * @returns {string} - The generated URL
 */
export function generateLocalizedUrl(path, locale = 'en', options = {}) {
  const { includeBase = false, baseUrl = '' } = options;

  // Validate and fix the path
  const validatedPath = validateAndFixUrl(path, locale);

  if (includeBase && baseUrl) {
    return baseUrl + validatedPath;
  }

  return validatedPath;
}

/**
 * Extracts locale from a URL path
 * @param {string} path - The path to analyze
 * @returns {string|null} - The locale if found, null otherwise
 */
export function extractLocaleFromPath(path) {
  const segments = path.split('/').filter(Boolean);

  if (segments.length > 0 && VALID_LOCALES.includes(segments[0])) {
    return segments[0];
  }

  return null;
}
