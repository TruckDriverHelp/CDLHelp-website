const { STATIC_PAGES, LOCALES, SITEMAP_CONFIG } = require('../config/static-pages');
const XmlBuilder = require('../utils/XmlBuilder');
const HreflangGenerator = require('../utils/HreflangGenerator');
const CacheManager = require('../utils/CacheManager');
const BlogFetcher = require('../fetchers/BlogFetcher');
const SchoolFetcher = require('../fetchers/SchoolFetcher');
const CompanyFetcher = require('../fetchers/CompanyFetcher');

class SitemapGenerator {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || SITEMAP_CONFIG.baseUrl;
    this.locales = config.locales || LOCALES.all;
    this.defaultLocale = config.defaultLocale || LOCALES.default;

    // Initialize utilities
    this.xmlBuilder = new XmlBuilder();
    this.hreflangGenerator = new HreflangGenerator({
      baseUrl: this.baseUrl,
      locales: this.locales,
      defaultLocale: this.defaultLocale,
    });
    this.cacheManager = new CacheManager();

    // Initialize fetchers
    this.blogFetcher = new BlogFetcher({
      baseUrl: process.env.STRAPI_HOST,
      apiKey: process.env.STRAPI_API_KEY,
    });
    this.schoolFetcher = new SchoolFetcher({
      baseUrl: process.env.STRAPI_HOST,
      apiKey: process.env.STRAPI_API_KEY,
    });
    this.companyFetcher = new CompanyFetcher({
      baseUrl: process.env.STRAPI_HOST,
      apiKey: process.env.STRAPI_API_KEY,
    });
  }

  /**
   * Generate all sitemaps and return sitemap index
   */
  async generateAll() {
    const sitemaps = [];

    try {
      // Generate static sitemaps for each locale
      for (const locale of this.locales) {
        const sitemap = await this.generateStaticSitemap(locale);
        if (sitemap) {
          sitemaps.push({
            loc: `${this.baseUrl}/sitemap-static-${locale}.xml`,
            lastmod: new Date().toISOString(),
          });
        }
      }

      // Generate dynamic content sitemaps
      const blogSitemap = await this.generateBlogSitemap();
      if (blogSitemap) {
        sitemaps.push({
          loc: `${this.baseUrl}/sitemap-blog.xml`,
          lastmod: new Date().toISOString(),
        });
      }

      const schoolsSitemap = await this.generateSchoolsSitemap();
      if (schoolsSitemap) {
        sitemaps.push({
          loc: `${this.baseUrl}/sitemap-schools.xml`,
          lastmod: new Date().toISOString(),
        });
      }

      const companiesSitemap = await this.generateCompaniesSitemap();
      if (companiesSitemap) {
        sitemaps.push({
          loc: `${this.baseUrl}/sitemap-companies.xml`,
          lastmod: new Date().toISOString(),
        });
      }

      // Generate sitemap index
      return this.xmlBuilder.buildSitemapIndex(sitemaps);
    } catch (error) {
      console.error('Error generating sitemaps:', error);
      throw error;
    }
  }

  /**
   * Generate static sitemap for a specific locale
   */
  async generateStaticSitemap(locale) {
    const cacheKey = `sitemap:static:${locale}`;

    // Check cache
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const urls = [];

      // Add universal pages
      for (const page of [
        ...STATIC_PAGES.universal,
        ...STATIC_PAGES.tests,
        ...STATIC_PAGES.guides,
      ]) {
        const url = await this.buildStaticUrl(page, locale);
        if (url) {
          urls.push(url);
        }
      }

      // Add locale-specific pages
      if (STATIC_PAGES.localeSpecific[locale]) {
        for (const page of STATIC_PAGES.localeSpecific[locale]) {
          const url = await this.buildStaticUrl(page, locale);
          if (url) {
            urls.push(url);
          }
        }
      }

      // Build XML
      const xml = this.xmlBuilder.buildSitemap(urls);

      // Cache the result
      await this.cacheManager.set(cacheKey, xml, 3600); // 1 hour cache

      return xml;
    } catch (error) {
      console.error(`Error generating static sitemap for locale ${locale}:`, error);
      return null;
    }
  }

  /**
   * Generate blog sitemap
   */
  async generateBlogSitemap() {
    const cacheKey = 'sitemap:blog';

    // Check cache
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const urls = [];

      // Fetch blog posts for each locale
      for (const locale of this.locales) {
        const posts = await this.blogFetcher.fetchAll({ locale });

        for (const post of posts) {
          const url = {
            loc: this.buildLocalizedUrl(`/blog/${post.slug}`, locale),
            lastmod: post.updatedAt || post.publishedAt,
            changefreq: 'weekly',
            priority: this.calculateBlogPriority(post.publishedAt),
            alternates: await this.generateBlogAlternates(post),
          };
          urls.push(url);
        }
      }

      // Build XML
      const xml = this.xmlBuilder.buildSitemap(urls);

      // Cache the result
      await this.cacheManager.set(cacheKey, xml, 21600); // 6 hours cache

      return xml;
    } catch (error) {
      console.error('Error generating blog sitemap:', error);
      return null;
    }
  }

  /**
   * Generate schools sitemap
   */
  async generateSchoolsSitemap() {
    const cacheKey = 'sitemap:schools';

    // Check cache
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const urls = [];

      // Schools are only in English
      const states = await this.schoolFetcher.fetchAllStates();

      for (const state of states) {
        // Add state page
        urls.push({
          loc: `${this.baseUrl}/schools/${state.slug}`,
          lastmod: new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.7,
        });

        // Add city pages
        const cities = await this.schoolFetcher.fetchCitiesByState(state.slug);
        for (const city of cities) {
          urls.push({
            loc: `${this.baseUrl}/schools/${state.slug}/${city.slug}`,
            lastmod: new Date().toISOString(),
            changefreq: 'monthly',
            priority: 0.6,
          });
        }
      }

      // Build XML
      const xml = this.xmlBuilder.buildSitemap(urls);

      // Cache the result
      await this.cacheManager.set(cacheKey, xml, 86400); // 24 hours cache

      return xml;
    } catch (error) {
      console.error('Error generating schools sitemap:', error);
      return null;
    }
  }

  /**
   * Generate companies sitemap
   */
  async generateCompaniesSitemap() {
    const cacheKey = 'sitemap:companies';

    // Check cache
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const urls = [];

      // Companies are available in English and Russian
      const supportedLocales = ['en', 'ru'];

      for (const locale of supportedLocales) {
        const companies = await this.companyFetcher.fetchAll({ locale });

        for (const company of companies) {
          urls.push({
            loc: this.buildLocalizedUrl(`/companies/${company.slug}`, locale),
            lastmod: company.updatedAt,
            changefreq: 'monthly',
            priority: 0.6,
            alternates: this.hreflangGenerator.generateAlternates(
              `/companies/${company.slug}`,
              supportedLocales
            ),
          });
        }
      }

      // Build XML
      const xml = this.xmlBuilder.buildSitemap(urls);

      // Cache the result
      await this.cacheManager.set(cacheKey, xml, 86400); // 24 hours cache

      return xml;
    } catch (error) {
      console.error('Error generating companies sitemap:', error);
      return null;
    }
  }

  /**
   * Build a static URL with hreflang alternates
   */
  async buildStaticUrl(page, locale) {
    const url = {
      loc: this.buildLocalizedUrl(page.path, locale),
      lastmod: new Date().toISOString(),
      changefreq: page.changefreq,
      priority: page.priority,
    };

    // Check if this page is available in all locales
    const availableLocales = this.getAvailableLocales(page.path);
    if (availableLocales.length > 1) {
      url.alternates = this.hreflangGenerator.generateAlternates(page.path, availableLocales);
    }

    return url;
  }

  /**
   * Build localized URL
   */
  buildLocalizedUrl(path, locale) {
    if (locale === this.defaultLocale) {
      return `${this.baseUrl}${path}`;
    }
    return `${this.baseUrl}/${locale}${path}`;
  }

  /**
   * Get available locales for a specific path
   */
  getAvailableLocales(path) {
    // Check if path has limited locale support
    if (STATIC_PAGES.limitedLocale[path]) {
      return STATIC_PAGES.limitedLocale[path];
    }

    // Check if it's a locale-specific page
    for (const [locale, pages] of Object.entries(STATIC_PAGES.localeSpecific)) {
      if (pages.some(p => p.path === path)) {
        return [locale];
      }
    }

    // Default to all locales
    return this.locales;
  }

  /**
   * Calculate blog post priority based on age
   */
  calculateBlogPriority(publishedAt) {
    const now = new Date();
    const published = new Date(publishedAt);
    const daysSincePublish = Math.floor((now - published) / (1000 * 60 * 60 * 24));

    if (daysSincePublish <= 7) return 0.9;
    if (daysSincePublish <= 30) return 0.8;
    if (daysSincePublish <= 90) return 0.7;
    if (daysSincePublish <= 180) return 0.6;
    return 0.5;
  }

  /**
   * Generate blog post alternates
   */
  async generateBlogAlternates(post) {
    const alternates = [];

    // Get all available translations
    if (post.localizations && post.localizations.length > 0) {
      for (const localization of post.localizations) {
        alternates.push({
          hreflang: localization.locale,
          href: this.buildLocalizedUrl(`/blog/${localization.slug}`, localization.locale),
        });
      }
    }

    // Add current locale
    alternates.push({
      hreflang: post.locale,
      href: this.buildLocalizedUrl(`/blog/${post.slug}`, post.locale),
    });

    // Add x-default
    alternates.push({
      hreflang: 'x-default',
      href: `${this.baseUrl}/blog/${post.slug}`,
    });

    return alternates;
  }

  /**
   * Generate sitemap index
   */
  generateSitemapIndex(sitemaps) {
    return this.xmlBuilder.buildSitemapIndex(sitemaps);
  }
}

module.exports = SitemapGenerator;
