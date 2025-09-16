/**
 * Hreflang generator for multi-locale support
 */

class HreflangGenerator {
  constructor(config) {
    this.baseUrl = config.baseUrl;
    this.locales = config.locales;
    this.defaultLocale = config.defaultLocale;
  }

  /**
   * Generate hreflang alternates for a given path
   */
  generateAlternates(path, availableLocales = null) {
    const alternates = [];
    const locales = availableLocales || this.locales;

    // Add alternate for each locale
    locales.forEach(locale => {
      alternates.push({
        hreflang: locale,
        href: this.buildUrl(path, locale),
      });
    });

    // Add x-default (points to default locale version)
    alternates.push({
      hreflang: 'x-default',
      href: this.buildUrl(path, this.defaultLocale),
    });

    return alternates;
  }

  /**
   * Build URL for a specific locale
   */
  buildUrl(path, locale) {
    // Handle homepage
    if (path === '/') {
      if (locale === this.defaultLocale) {
        return this.baseUrl + '/';
      }
      return `${this.baseUrl}/${locale}`;
    }

    // English (default) doesn't use locale prefix
    if (locale === this.defaultLocale) {
      return `${this.baseUrl}${path}`;
    }

    // Other locales use prefix
    return `${this.baseUrl}/${locale}${path}`;
  }

  /**
   * Validate hreflang set
   */
  validateHreflangSet(alternates) {
    const errors = [];
    const warnings = [];
    const hreflangValues = alternates.map(a => a.hreflang);

    // Check for x-default
    if (!hreflangValues.includes('x-default')) {
      errors.push('Missing x-default alternate');
    }

    // Check for duplicates
    const duplicates = hreflangValues.filter((value, index, self) => self.indexOf(value) !== index);
    if (duplicates.length > 0) {
      errors.push(`Duplicate hreflang values: ${duplicates.join(', ')}`);
    }

    // Validate language codes
    alternates.forEach(alt => {
      if (alt.hreflang !== 'x-default' && !this.isValidLanguageCode(alt.hreflang)) {
        errors.push(`Invalid language code: ${alt.hreflang}`);
      }
    });

    // Check for self-reference
    if (alternates.length > 0 && !alternates.some(a => a.hreflang === this.defaultLocale)) {
      warnings.push('Missing self-reference for default locale');
    }

    // Check URL format
    alternates.forEach(alt => {
      if (!alt.href.startsWith('http://') && !alt.href.startsWith('https://')) {
        errors.push(`Invalid URL format: ${alt.href}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Check if a language code is valid
   */
  isValidLanguageCode(code) {
    // Simple validation for ISO 639-1 codes (2-letter)
    // Can be extended to support language-region format (e.g., en-US)
    const simpleCode = /^[a-z]{2}$/;
    const regionCode = /^[a-z]{2}-[A-Z]{2}$/;

    return simpleCode.test(code) || regionCode.test(code);
  }

  /**
   * Get canonical URL for a path
   */
  getCanonicalUrl(path, locale = null) {
    const canonicalLocale = locale || this.defaultLocale;
    return this.buildUrl(path, canonicalLocale);
  }

  /**
   * Parse URL to extract locale and path
   */
  parseUrl(url) {
    // Remove base URL
    const relativePath = url.replace(this.baseUrl, '');

    // Check for locale prefix
    const localeMatch = relativePath.match(/^\/([a-z]{2})(\/.*)?$/);

    if (localeMatch && this.locales.includes(localeMatch[1])) {
      return {
        locale: localeMatch[1],
        path: localeMatch[2] || '/',
      };
    }

    // No locale prefix means default locale
    return {
      locale: this.defaultLocale,
      path: relativePath || '/',
    };
  }

  /**
   * Check if a locale is RTL (right-to-left)
   */
  isRtlLocale(locale) {
    const rtlLocales = ['ar', 'he', 'fa', 'ur'];
    return rtlLocales.includes(locale);
  }

  /**
   * Get locale display name
   */
  getLocaleName(locale) {
    const names = {
      en: 'English',
      ru: 'Русский',
      uk: 'Українська',
      ar: 'العربية',
      ko: '한국어',
      zh: '中文',
      tr: 'Türkçe',
      pt: 'Português',
    };

    return names[locale] || locale.toUpperCase();
  }

  /**
   * Get locale flag emoji (for UI)
   */
  getLocaleFlag(locale) {
    const flags = {
      en: '🇺🇸',
      ru: '🇷🇺',
      uk: '🇺🇦',
      ar: '🇸🇦',
      ko: '🇰🇷',
      zh: '🇨🇳',
      tr: '🇹🇷',
      pt: '🇧🇷',
    };

    return flags[locale] || '🌐';
  }
}

module.exports = HreflangGenerator;
