# Locale Management Strategy

## Overview

CDLHelp supports 8 locales with varying content availability. This document outlines the comprehensive strategy for managing multi-locale sitemaps with proper hreflang implementation.

## Supported Locales

| Locale     | Language   | Region | Code | Status       |
| ---------- | ---------- | ------ | ---- | ------------ |
| English    | English    | US     | en   | Default      |
| Russian    | Русский    | RU     | ru   | Full Support |
| Ukrainian  | Українська | UA     | uk   | Full Support |
| Arabic     | العربية    | SA     | ar   | Full Support |
| Korean     | 한국어     | KR     | ko   | Full Support |
| Chinese    | 中文       | CN     | zh   | Full Support |
| Turkish    | Türkçe     | TR     | tr   | Full Support |
| Portuguese | Português  | BR     | pt   | Full Support |

## Locale-Specific Page Availability

### Universal Pages (Available in All Locales)

```javascript
const UNIVERSAL_PAGES = [
  '/', // Homepage
  '/cdl-practice-test', // Main test page
  '/general-knowledge', // General Knowledge test
  '/air-brakes', // Air Brakes test
  '/combination-vehicles', // Combination test
  '/hazmat', // HazMat test
  '/download', // App download
  '/contact', // Contact page
  '/privacy-policy', // Privacy Policy
  '/terms-conditions', // Terms & Conditions
];
```

### Locale-Specific Pages

```javascript
const LOCALE_SPECIFIC_PAGES = {
  ru: [
    '/kak-poluchit-cdl', // How to get CDL (Russian)
    '/kak-stat-dalnoboishikom', // How to become trucker
    '/kak-ispolzovat-cdlhelp', // How to use CDLHelp
    '/o-cdl-shkolakh', // About CDL schools
    '/chasto-zadavaemye-voprosy', // FAQ
  ],
  uk: [
    '/yak-otrymaty-cdl', // How to get CDL (Ukrainian)
    '/pro-cdl-shkoly', // About CDL schools
  ],
  // Other locales may have specific pages
};
```

### Pages with Limited Locale Support

```javascript
const LIMITED_LOCALE_PAGES = {
  '/schools': ['en'], // Only English
  '/schools/[state]': ['en'], // Only English
  '/schools/[state]/[city]': ['en'], // Only English
  '/companies': ['en', 'ru'], // English and Russian
};
```

## Hreflang Implementation

### Complete Hreflang Matrix

```xml
<!-- Example for a universal page -->
<url>
  <loc>https://www.cdlhelp.com/cdl-practice-test</loc>
  <xhtml:link rel="alternate" hreflang="en" href="https://www.cdlhelp.com/cdl-practice-test"/>
  <xhtml:link rel="alternate" hreflang="ru" href="https://www.cdlhelp.com/ru/cdl-practice-test"/>
  <xhtml:link rel="alternate" hreflang="uk" href="https://www.cdlhelp.com/uk/cdl-practice-test"/>
  <xhtml:link rel="alternate" hreflang="ar" href="https://www.cdlhelp.com/ar/cdl-practice-test"/>
  <xhtml:link rel="alternate" hreflang="ko" href="https://www.cdlhelp.com/ko/cdl-practice-test"/>
  <xhtml:link rel="alternate" hreflang="zh" href="https://www.cdlhelp.com/zh/cdl-practice-test"/>
  <xhtml:link rel="alternate" hreflang="tr" href="https://www.cdlhelp.com/tr/cdl-practice-test"/>
  <xhtml:link rel="alternate" hreflang="pt" href="https://www.cdlhelp.com/pt/cdl-practice-test"/>
  <xhtml:link rel="alternate" hreflang="x-default" href="https://www.cdlhelp.com/cdl-practice-test"/>
</url>
```

### Hreflang Generator Implementation

```javascript
// lib/sitemap/HreflangGenerator.js

class HreflangGenerator {
  constructor(config) {
    this.baseUrl = config.baseUrl;
    this.locales = config.locales;
    this.defaultLocale = config.defaultLocale;
  }

  generateAlternates(path, availableLocales = null) {
    const alternates = [];
    const locales = availableLocales || this.locales;

    // Add all available locale versions
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

  buildUrl(path, locale) {
    // English (default) doesn't use locale prefix
    if (locale === this.defaultLocale) {
      return `${this.baseUrl}${path}`;
    }

    // Other locales use prefix
    return `${this.baseUrl}/${locale}${path}`;
  }

  validateHreflangSet(alternates) {
    const errors = [];
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

    return errors;
  }

  isValidLanguageCode(code) {
    // Simple validation for ISO 639-1 codes
    return /^[a-z]{2}(-[A-Z]{2})?$/.test(code);
  }
}
```

## Translation Availability Detection

```javascript
// lib/sitemap/TranslationDetector.js

class TranslationDetector {
  constructor() {
    this.translationCache = new Map();
  }

  async detectAvailableLocales(pagePath) {
    // Check cache first
    if (this.translationCache.has(pagePath)) {
      return this.translationCache.get(pagePath);
    }

    const availableLocales = [];

    // Check for translation files
    for (const locale of this.locales) {
      if (await this.hasTranslation(pagePath, locale)) {
        availableLocales.push(locale);
      }
    }

    // Cache the result
    this.translationCache.set(pagePath, availableLocales);
    return availableLocales;
  }

  async hasTranslation(pagePath, locale) {
    // Check multiple sources for translation availability

    // 1. Check translation JSON files
    const translationFile = this.getTranslationFilePath(pagePath, locale);
    if (await this.fileExists(translationFile)) {
      return true;
    }

    // 2. Check Strapi for localized content
    if (await this.hasStrapiTranslation(pagePath, locale)) {
      return true;
    }

    // 3. Check hardcoded locale-specific pages
    if (this.isLocaleSpecificPage(pagePath, locale)) {
      return true;
    }

    return false;
  }

  getTranslationFilePath(pagePath, locale) {
    const pageName = pagePath === '/' ? 'common' : pagePath.slice(1).replace(/\//g, '-');

    return `public/locales/${locale}/${pageName}.json`;
  }

  async hasStrapiTranslation(pagePath, locale) {
    // Check if Strapi has content for this locale
    if (pagePath.startsWith('/blog/')) {
      const slug = pagePath.replace('/blog/', '');
      return await this.checkStrapiBlogTranslation(slug, locale);
    }

    return false;
  }

  isLocaleSpecificPage(pagePath, locale) {
    return LOCALE_SPECIFIC_PAGES[locale]?.includes(pagePath) || false;
  }
}
```

## Locale Routing Strategy

### URL Structure

```javascript
// lib/sitemap/LocaleRouter.js

class LocaleRouter {
  constructor() {
    this.patterns = {
      default: '/:path*',
      localized: '/:locale/:path*',
    };
  }

  generateUrls(basePath, locales) {
    const urls = [];

    locales.forEach(locale => {
      urls.push({
        locale,
        url: this.buildLocalizedUrl(basePath, locale),
        canonical: locale === 'en',
      });
    });

    return urls;
  }

  buildLocalizedUrl(path, locale) {
    // Special handling for homepage
    if (path === '/') {
      return locale === 'en' ? '/' : `/${locale}`;
    }

    // English pages don't use locale prefix
    if (locale === 'en') {
      return path;
    }

    // Other locales use prefix
    return `/${locale}${path}`;
  }

  parseUrl(url) {
    const match = url.match(/^\/([a-z]{2})(\/.*)?$/);

    if (match && this.isValidLocale(match[1])) {
      return {
        locale: match[1],
        path: match[2] || '/',
      };
    }

    return {
      locale: 'en',
      path: url,
    };
  }

  isValidLocale(locale) {
    return ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'].includes(locale);
  }
}
```

## Content Fallback Strategy

```javascript
// lib/sitemap/ContentFallback.js

class ContentFallback {
  constructor() {
    this.fallbackChain = {
      uk: ['ru', 'en'], // Ukrainian falls back to Russian, then English
      pt: ['es', 'en'], // Portuguese falls back to Spanish, then English
      default: ['en'], // All others fall back to English
    };
  }

  async getContent(path, requestedLocale) {
    // Try requested locale first
    let content = await this.fetchContent(path, requestedLocale);
    if (content) return { content, locale: requestedLocale, isFallback: false };

    // Try fallback chain
    const chain = this.fallbackChain[requestedLocale] || this.fallbackChain.default;

    for (const fallbackLocale of chain) {
      content = await this.fetchContent(path, fallbackLocale);
      if (content) {
        return {
          content,
          locale: fallbackLocale,
          isFallback: true,
          originalLocale: requestedLocale,
        };
      }
    }

    // No content found
    return null;
  }

  shouldIncludeInSitemap(path, locale) {
    // Only include if:
    // 1. Content exists in the requested locale
    // 2. OR it's a critical page with fallback content

    const criticalPages = ['/', '/cdl-practice-test', '/download'];
    const hasNativeContent = this.hasContent(path, locale);
    const isCritical = criticalPages.includes(path);

    return hasNativeContent || isCritical;
  }
}
```

## Locale-Specific Sitemap Generation

```javascript
// lib/sitemap/LocaleSitemapGenerator.js

class LocaleSitemapGenerator {
  constructor(locale, config) {
    this.locale = locale;
    this.config = config;
    this.detector = new TranslationDetector();
    this.router = new LocaleRouter();
  }

  async generate() {
    const urls = [];

    // Add universal pages
    for (const page of UNIVERSAL_PAGES) {
      const url = await this.generateUrl(page);
      if (url) urls.push(url);
    }

    // Add locale-specific pages
    const specificPages = LOCALE_SPECIFIC_PAGES[this.locale] || [];
    for (const page of specificPages) {
      const url = await this.generateUrl(page);
      if (url) urls.push(url);
    }

    // Add dynamic content
    const dynamicUrls = await this.generateDynamicUrls();
    urls.push(...dynamicUrls);

    return this.buildXml(urls);
  }

  async generateUrl(path) {
    // Check if content exists for this locale
    const hasContent = await this.detector.hasTranslation(path, this.locale);
    if (!hasContent && !this.shouldUseFallback(path)) {
      return null;
    }

    const fullUrl = this.router.buildLocalizedUrl(path, this.locale);
    const alternates = await this.generateAlternates(path);

    return {
      loc: `${this.config.baseUrl}${fullUrl}`,
      lastmod: await this.getLastModified(path),
      changefreq: this.getChangeFrequency(path),
      priority: this.getPriority(path),
      alternates,
    };
  }

  async generateAlternates(path) {
    const availableLocales = await this.detector.detectAvailableLocales(path);
    const alternates = [];

    for (const locale of availableLocales) {
      const url = this.router.buildLocalizedUrl(path, locale);
      alternates.push({
        hreflang: locale,
        href: `${this.config.baseUrl}${url}`,
      });
    }

    // Add x-default
    alternates.push({
      hreflang: 'x-default',
      href: `${this.config.baseUrl}${path}`,
    });

    return alternates;
  }
}
```

## Locale Validation Rules

```javascript
// lib/sitemap/LocaleValidator.js

class LocaleValidator {
  constructor() {
    this.rules = [
      this.validateHreflangCompleteness,
      this.validateUrlConsistency,
      this.validateLocaleAvailability,
      this.validateCanonicalUrls,
      this.validateAlternateLinks,
    ];
  }

  async validate(sitemap) {
    const errors = [];
    const warnings = [];

    for (const rule of this.rules) {
      const result = await rule.call(this, sitemap);
      errors.push(...result.errors);
      warnings.push(...result.warnings);
    }

    return { errors, warnings, isValid: errors.length === 0 };
  }

  validateHreflangCompleteness(sitemap) {
    const errors = [];
    const warnings = [];

    sitemap.urls.forEach(url => {
      if (!url.alternates || url.alternates.length === 0) {
        warnings.push(`Missing alternates for ${url.loc}`);
      }

      // Check for x-default
      const hasDefault = url.alternates?.some(a => a.hreflang === 'x-default');
      if (!hasDefault) {
        errors.push(`Missing x-default for ${url.loc}`);
      }

      // Check for self-reference
      const selfRef = url.alternates?.some(a => a.href === url.loc);
      if (!selfRef) {
        errors.push(`Missing self-reference for ${url.loc}`);
      }
    });

    return { errors, warnings };
  }

  validateUrlConsistency(sitemap) {
    const errors = [];
    const warnings = [];

    sitemap.urls.forEach(url => {
      // Check URL format
      if (!url.loc.startsWith('https://')) {
        errors.push(`URL must use HTTPS: ${url.loc}`);
      }

      // Check for trailing slashes
      if (url.loc.endsWith('/') && url.loc !== 'https://www.cdlhelp.com/') {
        warnings.push(`URL has trailing slash: ${url.loc}`);
      }
    });

    return { errors, warnings };
  }
}
```

## Monitoring and Analytics

```javascript
// lib/sitemap/LocaleMonitor.js

class LocaleMonitor {
  constructor() {
    this.metrics = {
      urlsPerLocale: {},
      missingTranslations: {},
      fallbackUsage: {},
      generationTime: {},
    };
  }

  trackGeneration(locale, urls, duration) {
    this.metrics.urlsPerLocale[locale] = urls.length;
    this.metrics.generationTime[locale] = duration;
  }

  trackMissingTranslation(path, locale) {
    if (!this.metrics.missingTranslations[locale]) {
      this.metrics.missingTranslations[locale] = [];
    }
    this.metrics.missingTranslations[locale].push(path);
  }

  trackFallback(path, requestedLocale, fallbackLocale) {
    const key = `${requestedLocale}->${fallbackLocale}`;
    if (!this.metrics.fallbackUsage[key]) {
      this.metrics.fallbackUsage[key] = [];
    }
    this.metrics.fallbackUsage[key].push(path);
  }

  generateReport() {
    return {
      summary: {
        totalLocales: Object.keys(this.metrics.urlsPerLocale).length,
        totalUrls: Object.values(this.metrics.urlsPerLocale).reduce((a, b) => a + b, 0),
        averageUrlsPerLocale: this.calculateAverage(Object.values(this.metrics.urlsPerLocale)),
      },
      localeBreakdown: this.metrics.urlsPerLocale,
      missingTranslations: this.metrics.missingTranslations,
      fallbackUsage: this.metrics.fallbackUsage,
      performance: this.metrics.generationTime,
    };
  }

  calculateAverage(numbers) {
    if (numbers.length === 0) return 0;
    return numbers.reduce((a, b) => a + b, 0) / numbers.length;
  }
}
```

## Best Practices

### 1. Translation Coverage

- Maintain at least 80% translation coverage for each locale
- Prioritize high-traffic pages for translation
- Use fallback only for non-critical content

### 2. URL Consistency

- Always use consistent URL patterns across locales
- Maintain URL structure even with translations
- Avoid locale-specific URL slugs when possible

### 3. Hreflang Implementation

- Include all available translations in hreflang
- Always include x-default
- Ensure bidirectional references

### 4. Performance Optimization

- Cache locale detection results
- Pre-generate locale-specific sitemaps
- Use CDN for locale-specific content

### 5. Monitoring

- Track translation coverage metrics
- Monitor fallback usage
- Alert on missing critical translations

## Next Steps

Continue to [04-dynamic-content-integration.md](./04-dynamic-content-integration.md) for Strapi and dynamic content handling.
