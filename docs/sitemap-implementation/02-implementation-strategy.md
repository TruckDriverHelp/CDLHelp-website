# Implementation Strategy

## Overview

This document provides a detailed, step-by-step implementation strategy for the CDLHelp sitemap system, including code structure, API design, and deployment procedures.

## Core Implementation Components

### 1. Sitemap Generator Class Structure

```javascript
// lib/sitemap/SitemapGenerator.js

class SitemapGenerator {
  constructor(config) {
    this.baseUrl = config.baseUrl || 'https://www.cdlhelp.com';
    this.locales = config.locales || ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'];
    this.defaultLocale = config.defaultLocale || 'en';
    this.strapiUrl = config.strapiUrl;
    this.cacheManager = new CacheManager();
    this.validator = new SitemapValidator();
  }

  async generateAll() {
    const sitemaps = await Promise.all([
      this.generateStaticSitemaps(),
      this.generateBlogSitemap(),
      this.generateSchoolsSitemap(),
      this.generateCompaniesSitemap(),
      this.generateMediaSitemap(),
    ]);

    return this.generateIndex(sitemaps);
  }

  async generateStaticSitemaps() {
    const sitemaps = [];

    for (const locale of this.locales) {
      const sitemap = await this.generateLocaleStaticSitemap(locale);
      sitemaps.push({
        url: `${this.baseUrl}/sitemap-static-${locale}.xml`,
        lastmod: new Date().toISOString(),
      });
    }

    return sitemaps;
  }
}
```

### 2. API Endpoint Structure

```javascript
// pages/api/sitemap/index.js

export default async function handler(req, res) {
  try {
    // Check cache first
    const cached = await cache.get('sitemap:index');
    if (cached) {
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.status(200).send(cached);
    }

    // Generate fresh sitemap
    const generator = new SitemapGenerator({
      baseUrl: process.env.BASE_URL,
      strapiUrl: process.env.STRAPI_URL,
    });

    const sitemapIndex = await generator.generateIndex();

    // Cache the result
    await cache.set('sitemap:index', sitemapIndex, 3600);

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(sitemapIndex);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
}
```

### 3. Static Page Configuration

```javascript
// config/static-pages.js

export const STATIC_PAGES = {
  common: [
    { path: '/', priority: 1.0, changefreq: 'daily' },
    { path: '/cdl-practice-test', priority: 0.9, changefreq: 'weekly' },
    { path: '/download', priority: 0.9, changefreq: 'monthly' },
    { path: '/about', priority: 0.7, changefreq: 'monthly' },
    { path: '/contact', priority: 0.7, changefreq: 'monthly' },
    { path: '/privacy-policy', priority: 0.3, changefreq: 'yearly' },
    { path: '/terms-conditions', priority: 0.3, changefreq: 'yearly' },
  ],

  tests: [
    { path: '/general-knowledge', priority: 0.8, changefreq: 'weekly' },
    { path: '/air-brakes', priority: 0.8, changefreq: 'weekly' },
    { path: '/combination-vehicles', priority: 0.8, changefreq: 'weekly' },
    { path: '/hazmat', priority: 0.8, changefreq: 'weekly' },
    { path: '/tanker', priority: 0.7, changefreq: 'weekly' },
    { path: '/double-triple', priority: 0.7, changefreq: 'weekly' },
    { path: '/passenger', priority: 0.7, changefreq: 'weekly' },
    { path: '/school-bus', priority: 0.7, changefreq: 'weekly' },
  ],

  guides: [
    { path: '/pre-trip-inspection/guide', priority: 0.8, changefreq: 'monthly' },
    { path: '/kak-poluchit-cdl', priority: 0.7, changefreq: 'monthly' },
    { path: '/kak-stat-dalnoboishikom', priority: 0.7, changefreq: 'monthly' },
  ],

  // Locale-specific pages
  localeSpecific: {
    ru: [
      { path: '/kak-ispolzovat-cdlhelp', priority: 0.6, changefreq: 'monthly' },
      { path: '/o-cdl-shkolakh', priority: 0.6, changefreq: 'monthly' },
      { path: '/chasto-zadavaemye-voprosy', priority: 0.5, changefreq: 'monthly' },
    ],
    // Add other locale-specific pages
  },
};
```

### 4. Dynamic Content Fetchers

```javascript
// lib/sitemap/fetchers/BlogFetcher.js

class BlogFetcher {
  constructor(strapiUrl, apiKey) {
    this.strapiUrl = strapiUrl;
    this.apiKey = apiKey;
  }

  async fetchAll(locale = 'en') {
    try {
      const response = await fetch(
        `${this.strapiUrl}/api/articles?locale=${locale}&pagination[limit]=1000`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      const data = await response.json();

      return data.data.map(article => ({
        url: this.buildUrl(article, locale),
        lastmod: article.attributes.updatedAt,
        changefreq: 'weekly',
        priority: this.calculatePriority(article),
        alternates: this.getAlternates(article),
      }));
    } catch (error) {
      console.error(`Failed to fetch blogs for locale ${locale}:`, error);
      return [];
    }
  }

  calculatePriority(article) {
    const daysSincePublish = this.daysSince(article.attributes.publishedAt);

    if (daysSincePublish < 7) return 0.9;
    if (daysSincePublish < 30) return 0.8;
    if (daysSincePublish < 90) return 0.7;
    return 0.6;
  }

  buildUrl(article, locale) {
    const slug = article.attributes.slug;
    return locale === 'en' ? `/blog/${slug}` : `/${locale}/blog/${slug}`;
  }
}
```

### 5. Cache Management

```javascript
// lib/sitemap/CacheManager.js

class CacheManager {
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    });
  }

  async get(key) {
    try {
      return await this.redis.get(key);
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    try {
      return await this.redis.set(key, value, 'EX', ttl);
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async invalidate(pattern) {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
      return true;
    } catch (error) {
      console.error('Cache invalidation error:', error);
      return false;
    }
  }
}
```

### 6. XML Generation

```javascript
// lib/sitemap/XmlBuilder.js

class XmlBuilder {
  constructor() {
    this.xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  }

  buildSitemap(urls) {
    const urlset = urls.map(url => this.buildUrl(url)).join('\n');

    return `${this.xmlHeader}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlset}
</urlset>`;
  }

  buildUrl(url) {
    let xml = '  <url>\n';
    xml += `    <loc>${this.escape(url.loc)}</loc>\n`;

    if (url.lastmod) {
      xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    }

    if (url.changefreq) {
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    }

    if (url.priority !== undefined) {
      xml += `    <priority>${url.priority}</priority>\n`;
    }

    // Add hreflang links
    if (url.alternates) {
      url.alternates.forEach(alt => {
        xml += `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${this.escape(alt.href)}"/>\n`;
      });
    }

    xml += '  </url>';
    return xml;
  }

  buildIndex(sitemaps) {
    const sitemapEntries = sitemaps
      .map(
        sitemap =>
          `  <sitemap>
    <loc>${this.escape(sitemap.loc)}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`
      )
      .join('\n');

    return `${this.xmlHeader}
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</sitemapindex>`;
  }

  escape(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
```

### 7. Deployment Configuration

```yaml
# .github/workflows/sitemap-update.yml

name: Update Sitemaps

on:
  schedule:
    - cron: '0 */6 * * *' # Every 6 hours
  workflow_dispatch:
  webhook:
    - from: strapi
      events: [content.update, content.create, content.delete]

jobs:
  update-sitemaps:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Generate sitemaps
        env:
          STRAPI_API_KEY: ${{ secrets.STRAPI_API_KEY }}
          BASE_URL: ${{ secrets.BASE_URL }}
          REDIS_URL: ${{ secrets.REDIS_URL }}
        run: npm run generate:sitemaps

      - name: Validate sitemaps
        run: npm run validate:sitemaps

      - name: Ping search engines
        if: success()
        run: npm run ping:search-engines

      - name: Notify on failure
        if: failure()
        uses: actions/notify@v1
        with:
          webhook: ${{ secrets.SLACK_WEBHOOK }}
          message: 'Sitemap generation failed!'
```

### 8. Environment Configuration

```bash
# .env.local

# Base Configuration
BASE_URL=https://www.cdlhelp.com
DEFAULT_LOCALE=en
SUPPORTED_LOCALES=en,ru,uk,ar,ko,zh,tr,pt

# Strapi Configuration
STRAPI_HOST=146.190.47.164
STRAPI_PORT=1337
STRAPI_API_KEY=your-api-key-here

# Cache Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
CACHE_TTL_STATIC=86400    # 24 hours
CACHE_TTL_DYNAMIC=21600   # 6 hours
CACHE_TTL_INDEX=3600      # 1 hour

# Performance Settings
MAX_URLS_PER_SITEMAP=45000
ENABLE_GZIP=true
STREAM_THRESHOLD=10000

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
ENABLE_METRICS=true
```

### 9. Next.js Configuration Updates

```javascript
// next.config.js additions

module.exports = {
  // ... existing config

  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      {
        source: '/sitemap-:type.xml',
        destination: '/api/sitemap/[type]',
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/api/sitemap/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};
```

### 10. Error Handling and Recovery

```javascript
// lib/sitemap/ErrorHandler.js

class SitemapErrorHandler {
  constructor() {
    this.retryAttempts = 3;
    this.retryDelay = 1000;
  }

  async withRetry(fn, context = '') {
    let lastError;

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        console.error(`Attempt ${attempt} failed for ${context}:`, error.message);

        if (attempt < this.retryAttempts) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }

    // All retries failed
    this.logError(context, lastError);
    throw new Error(`Failed after ${this.retryAttempts} attempts: ${context}`);
  }

  async withFallback(primary, fallback, context = '') {
    try {
      return await primary();
    } catch (error) {
      console.warn(`Primary failed for ${context}, using fallback:`, error.message);
      return await fallback();
    }
  }

  logError(context, error) {
    // Send to monitoring service
    if (process.env.SENTRY_DSN) {
      Sentry.captureException(error, {
        tags: {
          context,
          component: 'sitemap',
        },
      });
    }

    // Log to file/console
    console.error(`[SITEMAP ERROR] ${context}:`, error);
  }
}
```

## Implementation Timeline

### Week 1: Foundation

- Day 1-2: Set up project structure and dependencies
- Day 3-4: Implement core generator classes
- Day 5: Create static page configurations
- Day 6-7: Build XML generation utilities

### Week 2: Dynamic Content

- Day 1-2: Implement Strapi fetchers
- Day 3-4: Add blog post generation
- Day 5: Add school/company page generation
- Day 6-7: Testing and refinement

### Week 3: Optimization

- Day 1-2: Implement caching layer
- Day 3-4: Add streaming for large sitemaps
- Day 5: Performance optimization
- Day 6-7: Load testing

### Week 4: Deployment

- Day 1-2: Set up CI/CD pipeline
- Day 3: Configure monitoring
- Day 4: Production deployment
- Day 5-7: Monitoring and adjustments

## Success Metrics

1. **Generation Performance**
   - Static sitemaps: < 1 second
   - Dynamic sitemaps: < 5 seconds
   - Full regeneration: < 30 seconds

2. **Reliability**
   - Uptime: > 99.9%
   - Error rate: < 0.1%
   - Recovery time: < 1 minute

3. **SEO Impact**
   - Indexation rate: > 90%
   - Discovery time: < 24 hours
   - Crawl errors: < 1%

## Next Steps

Continue to [03-locale-management.md](./03-locale-management.md) for detailed locale handling implementation.
