/**
 * Comprehensive Sitemap Generator for CDL Help
 * Handles all pages, localization, and follows 2025 best practices
 */

class ComprehensiveSitemapGenerator {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || 'https://www.cdlhelp.com';
    this.locales = config.locales || ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'];
    this.defaultLocale = config.defaultLocale || 'en';
    this.maxUrlsPerSitemap = config.maxUrlsPerSitemap || 45000;
  }

  /**
   * Generate complete sitemap with all pages and proper hreflang
   */
  generateCompleteSitemap() {
    const urls = [];

    // Add all static pages
    this.getStaticPages().forEach(page => {
      const urlEntry = this.createUrlEntry(page);
      urls.push(urlEntry);
    });

    // Add school pages
    this.getSchoolPages().forEach(page => {
      const urlEntry = this.createUrlEntry(page);
      urls.push(urlEntry);
    });

    // Add pre-trip inspection pages
    this.getPreTripPages().forEach(page => {
      const urlEntry = this.createUrlEntry(page);
      urls.push(urlEntry);
    });

    // Add localized content pages
    this.getLocalizedContentPages().forEach(page => {
      const urlEntry = this.createUrlEntry(page);
      urls.push(urlEntry);
    });

    return this.buildSitemapXml(urls);
  }

  /**
   * Create URL entry with all locales and hreflang
   */
  createUrlEntry(page) {
    const entries = [];

    // Create entry for each locale
    this.locales.forEach(locale => {
      const url = this.buildUrlForLocale(page.path, locale);
      const alternates = this.buildAlternatesForPage(page);

      entries.push({
        loc: url,
        lastmod: page.lastmod || new Date().toISOString().split('T')[0],
        changefreq: page.changefreq || 'monthly',
        priority: page.priority || 0.5,
        alternates: alternates,
      });
    });

    return entries;
  }

  /**
   * Build URL for specific locale
   */
  buildUrlForLocale(path, locale) {
    if (locale === this.defaultLocale) {
      return `${this.baseUrl}${path}`;
    }
    return `${this.baseUrl}/${locale}${path}`;
  }

  /**
   * Build hreflang alternates for a page
   */
  buildAlternatesForPage(page) {
    const alternates = [];

    // Add alternate for each locale
    this.locales.forEach(locale => {
      const hreflangCode = this.getHreflangCode(locale);
      const href = this.buildUrlForLocale(page.path, locale);

      alternates.push({
        hreflang: hreflangCode,
        href: href,
      });
    });

    // Add x-default pointing to English version
    alternates.push({
      hreflang: 'x-default',
      href: this.buildUrlForLocale(page.path, this.defaultLocale),
    });

    return alternates;
  }

  /**
   * Get proper hreflang code for locale
   */
  getHreflangCode(locale) {
    const mapping = {
      en: 'en-US',
      ru: 'ru-RU',
      uk: 'uk-UA',
      ar: 'ar',
      ko: 'ko-KR',
      zh: 'zh-CN',
      tr: 'tr-TR',
      pt: 'pt-BR',
    };
    return mapping[locale] || locale;
  }

  /**
   * Get all static pages
   */
  getStaticPages() {
    return [
      // Main pages
      { path: '/', priority: 1.0, changefreq: 'daily' },
      { path: '/cdl-texas', priority: 0.8, changefreq: 'monthly' },
      { path: '/companies', priority: 0.7, changefreq: 'weekly' },
      { path: '/contact', priority: 0.7, changefreq: 'monthly' },
      { path: '/cookies-policy', priority: 0.3, changefreq: 'yearly' },
      { path: '/dot-physical-exam', priority: 0.7, changefreq: 'monthly' },
      { path: '/dot-physical-exam/search', priority: 0.6, changefreq: 'monthly' },
      { path: '/download', priority: 0.9, changefreq: 'weekly' },
      { path: '/blog', priority: 0.8, changefreq: 'daily' },
      { path: '/privacy-policy', priority: 0.3, changefreq: 'yearly' },
      { path: '/road-signs/test', priority: 0.7, changefreq: 'monthly' },
      { path: '/schools', priority: 0.8, changefreq: 'weekly' },
      { path: '/terms-conditions', priority: 0.3, changefreq: 'yearly' },
      { path: '/404', priority: 0.1, changefreq: 'yearly' },

      // How-to pages
      { path: '/how-to-activate-promo', priority: 0.5, changefreq: 'yearly' },

      // Blog articles
      {
        path: '/blog/eldt-requirements-what-new-cdl-drivers-need-to-know',
        priority: 0.6,
        changefreq: 'yearly',
      },
      {
        path: '/blog/essential-cdl-endorsements-guide-for-new-truckers',
        priority: 0.6,
        changefreq: 'yearly',
      },
      { path: '/blog/how-to-get-cdl-permit', priority: 0.6, changefreq: 'yearly' },
      {
        path: '/blog/manual-vs-automatic-transmission-in-cdl-training-which-should-you-choose',
        priority: 0.6,
        changefreq: 'yearly',
      },
    ];
  }

  /**
   * Get all school pages (states and cities)
   */
  getSchoolPages() {
    const pages = [];

    // States with schools
    const states = [
      'alabama',
      'alaska',
      'arizona',
      'arkansas',
      'california',
      'colorado',
      'connecticut',
      'delaware',
      'florida',
      'georgia',
      'hawaii',
      'idaho',
      'illinois',
      'indiana',
      'iowa',
      'kansas',
      'kentucky',
      'louisiana',
      'maine',
      'maryland',
      'massachusetts',
      'michigan',
      'minnesota',
      'mississippi',
      'missouri',
      'montana',
      'nebraska',
      'nevada',
      'new-hampshire',
      'new-jersey',
      'new-mexico',
      'new-york',
      'north-carolina',
      'north-dakota',
      'ohio',
      'oklahoma',
      'oregon',
      'pennsylvania',
      'rhode-island',
      'south-carolina',
      'south-dakota',
      'tennessee',
      'texas',
      'utah',
      'vermont',
      'virginia',
      'washington',
      'west-virginia',
      'wisconsin',
      'wyoming',
    ];

    // Add state pages
    states.forEach(state => {
      pages.push({
        path: `/schools/${state}`,
        priority: 0.7,
        changefreq: 'monthly',
      });

      // Also add /school/[state] format
      pages.push({
        path: `/school/${state}`,
        priority: 0.6,
        changefreq: 'monthly',
      });
    });

    // Cities with schools
    const cities = {
      california: ['los-angeles', 'sacramento'],
      florida: ['jacksonville', 'miami', 'orlando'],
      illinois: ['chicago'],
      'new-york': ['new-york'],
      ohio: ['cincinnati', 'columbus'],
      pennsylvania: ['philadelphia'],
      washington: ['seattle'],
      wisconsin: ['milwaukee'],
    };

    // Add city pages
    Object.entries(cities).forEach(([state, cityList]) => {
      cityList.forEach(city => {
        pages.push({
          path: `/schools/${state}/${city}`,
          priority: 0.6,
          changefreq: 'monthly',
        });
      });
    });

    return pages;
  }

  /**
   * Get all pre-trip inspection pages
   */
  getPreTripPages() {
    const pages = [{ path: '/pre-trip-inspection/guide', priority: 0.8, changefreq: 'yearly' }];

    // Add all 19 sections
    const sections = [
      '1-tractor-front',
      '2-tractor-side',
      '3-engine-driver-side',
      '4-engine-passenger-side',
      '5-front-suspension',
      '6-front-brakes',
      '7-tractor-coupling',
      '8-front-of-trailer',
      '9-rear-wheels',
      '10-drive-axle-suspension',
      '11-drive-brakes',
      '12-coupling-system',
      '13-side-of-trailer',
      '14-trailer-suspension',
      '15-trailer-brakes',
      '16-trailer-wheels',
      '17-rear-of-trailer',
      '18-in-cab-inspection',
      '19-brakes',
    ];

    sections.forEach(section => {
      pages.push({
        path: `/pre-trip-inspection/${section}`,
        priority: 0.6,
        changefreq: 'yearly',
      });
    });

    return pages;
  }

  /**
   * Get localized content pages with different slugs per locale
   */
  getLocalizedContentPages() {
    const pages = [];

    const localizedContent = {
      'frequently-asked-questions': {
        en: '/frequently-asked-questions',
        ru: '/chasto-zadavaemye-voprosy',
        uk: '/chasti-zapytannya',
        ar: '/alas-ila-alshaeia-musaedat-cdl',
        ko: '/jaju-mudneun-jilmun-cdl-doum',
        zh: '/changjian-wenti-cdl-bangzhu',
        tr: '/sikca-sorulan-sorular',
        pt: '/perguntas-frequentes',
      },
      'how-to-become-a-truck-driver': {
        en: '/how-to-become-a-truck-driver',
        ru: '/kak-stat-dalnoboishikom',
        uk: '/yak-staty-dalekobiinykom-v-Amerytsi',
        ar: '/kayfa-tusbih-sayiq-shahinat-fi-alwilayat-almutahida',
        ko: '/migug-eseo-teureog-unjeonsa-ga-doeneun-bangbeob',
        zh: '/ruhe-chengwei-meiguo-kache-siji',
        tr: '/nasil-kamyon-soforu-olunur',
        pt: '/como-se-tornar-motorista-de-caminhaoo',
      },
      'how-to-get-cdl': {
        en: '/how-to-get-cdl',
        ru: '/kak-poluchit-cdl',
        uk: '/yak-otrymaty-cdl',
        ar: '/kayfa-tahsil-cdl',
        ko: '/cdl-eobtneun-bangbeob',
        zh: '/ruhe-huode-cdl',
        tr: '/cdl-nasil-alinir',
        pt: '/como-obter-cdl',
      },
      'how-to-use-cdl-help': {
        en: '/how-to-use-cdl-help',
        ru: '/kak-ispolzovat-cdlhelp',
        uk: '/yak-vykorystovuvaty-dodatok-cdl-help',
        ar: '/kayfiyat-astikhdam-tatbiq-cdl-musaeda',
        ko: '/cdl-help-aeb-sayongbeob',
        zh: '/ruhe-shiyong-cdl-bangzhu-yingyongchengxu',
        tr: '/cdl-yardim-nasil-kullanilir',
        pt: '/como-usar-o-cdl-help',
      },
      'what-is-taught-in-cdl-schools': {
        en: '/what-is-taught-in-cdl-schools',
        ru: '/o-cdl-shkolakh',
        uk: '/choho-navchayut-u-shkolakh-cdl',
        ar: '/ma-yatimmu-tadrisuh-fi-madaris-cdl',
        ko: '/cdl-haggyoeseoneun-mueos-eul-galeuchimniga',
        zh: '/guanyu-cdl-xuexiao',
        tr: '/cdl-okul',
        pt: '/sobre-as-escolas',
      },
    };

    // Create entries for localized content
    Object.entries(localizedContent).forEach(([key, paths]) => {
      // We need special handling for these as they have different URLs per locale
      Object.entries(paths).forEach(([locale, path]) => {
        const fullPath = locale === 'en' ? path : `/${locale}${path}`;

        // Build alternates specifically for this content
        const alternates = [];
        Object.entries(paths).forEach(([altLocale, altPath]) => {
          const altFullPath = altLocale === 'en' ? altPath : `/${altLocale}${altPath}`;
          alternates.push({
            hreflang: this.getHreflangCode(altLocale),
            href: `${this.baseUrl}${altFullPath}`,
          });
        });

        // Add x-default
        alternates.push({
          hreflang: 'x-default',
          href: `${this.baseUrl}${paths.en}`,
        });

        pages.push({
          loc: `${this.baseUrl}${fullPath}`,
          lastmod: new Date().toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: 0.7,
          alternates: alternates,
          skipStandardAlternates: true, // Flag to skip standard alternate generation
        });
      });
    });

    return pages;
  }

  /**
   * Build XML from URL entries
   */
  buildSitemapXml(urlEntries) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

    // Flatten nested arrays
    const flatUrls = urlEntries.flat();

    flatUrls.forEach(url => {
      // Skip if this is a special entry handled elsewhere
      if (url.skipStandardAlternates) {
        xml += this.buildUrlXml(url);
        return;
      }

      xml += this.buildUrlXml(url);
    });

    xml += '</urlset>';
    return xml;
  }

  /**
   * Build XML for single URL entry
   */
  buildUrlXml(url) {
    let xml = '  <url>\n';
    xml += `    <loc>${this.escapeXml(url.loc)}</loc>\n`;

    if (url.lastmod) {
      xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    }

    if (url.changefreq) {
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    }

    if (url.priority !== undefined) {
      xml += `    <priority>${url.priority}</priority>\n`;
    }

    // Add hreflang alternates
    if (url.alternates && url.alternates.length > 0) {
      url.alternates.forEach(alt => {
        xml += `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" `;
        xml += `href="${this.escapeXml(alt.href)}"/>\n`;
      });
    }

    xml += '  </url>\n';
    return xml;
  }

  /**
   * Generate sitemap index
   */
  generateSitemapIndex() {
    const timestamp = new Date().toISOString();

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    const sitemaps = [
      '/sitemap-static.xml',
      '/sitemap-schools.xml',
      '/sitemap-blog.xml',
      '/sitemap-images.xml',
      '/sitemap-videos.xml',
      '/sitemap-news.xml',
    ];

    // Add locale-specific sitemaps
    this.locales.forEach(locale => {
      if (locale !== this.defaultLocale) {
        sitemaps.push(`/sitemap-${locale}.xml`);
      }
    });

    sitemaps.forEach(path => {
      xml += '  <sitemap>\n';
      xml += `    <loc>${this.baseUrl}${path}</loc>\n`;
      xml += `    <lastmod>${timestamp}</lastmod>\n`;
      xml += '  </sitemap>\n';
    });

    xml += '</sitemapindex>';
    return xml;
  }

  /**
   * Escape XML special characters
   */
  escapeXml(str) {
    if (!str) return '';
    return str
      .toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Validate sitemap
   */
  validateSitemap(xml) {
    const errors = [];
    const warnings = [];

    // Check size
    const sizeInBytes = Buffer.byteLength(xml, 'utf8');
    const sizeInMB = sizeInBytes / (1024 * 1024);

    if (sizeInMB > 50) {
      errors.push(`Sitemap exceeds 50MB limit: ${sizeInMB.toFixed(2)}MB`);
    } else if (sizeInMB > 10) {
      warnings.push(`Large sitemap: ${sizeInMB.toFixed(2)}MB`);
    }

    // Check URL count
    const urlCount = (xml.match(/<url>/g) || []).length;
    if (urlCount > 50000) {
      errors.push(`Exceeds 50,000 URL limit: ${urlCount} URLs`);
    } else if (urlCount > 40000) {
      warnings.push(`Approaching URL limit: ${urlCount} URLs`);
    }

    // Check for required elements
    if (!xml.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
      errors.push('Missing XML declaration');
    }

    if (!xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
      errors.push('Missing sitemap namespace');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      stats: {
        urlCount,
        sizeInMB: sizeInMB.toFixed(2),
      },
    };
  }
}

module.exports = ComprehensiveSitemapGenerator;
