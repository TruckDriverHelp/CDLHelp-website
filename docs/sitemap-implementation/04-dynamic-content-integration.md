# Dynamic Content Integration with Strapi

## Overview

This document details the integration strategy for dynamic content from Strapi CMS, including blog posts, school listings, company pages, and other database-driven content.

## Strapi Content Architecture

### Content Types

| Content Type    | API Endpoint        | Localized | Update Frequency | Est. Volume |
| --------------- | ------------------- | --------- | ---------------- | ----------- |
| Articles (Blog) | `/api/articles`     | Yes       | Daily            | 500+        |
| Schools         | `/api/schools`      | No        | Weekly           | 5000+       |
| Companies       | `/api/companies`    | Yes       | Monthly          | 1000+       |
| FAQs            | `/api/faqs`         | Yes       | Monthly          | 100+        |
| Testimonials    | `/api/testimonials` | Yes       | Weekly           | 200+        |

## Strapi API Integration

### Base Configuration

```javascript
// lib/strapi/StrapiClient.js

class StrapiClient {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || process.env.STRAPI_URL;
    this.apiKey = config.apiKey || process.env.STRAPI_API_KEY;
    this.timeout = config.timeout || 10000;
    this.retryAttempts = config.retryAttempts || 3;
  }

  async fetch(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: this.timeout,
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
      const response = await this.fetchWithRetry(url, mergedOptions);

      if (!response.ok) {
        throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Strapi API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  async fetchWithRetry(url, options, attempt = 1) {
    try {
      return await fetch(url, options);
    } catch (error) {
      if (attempt >= this.retryAttempts) {
        throw error;
      }

      const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));

      return this.fetchWithRetry(url, options, attempt + 1);
    }
  }

  buildQueryString(params) {
    const qs = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => qs.append(key, v));
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          qs.append(`${key}[${subKey}]`, subValue);
        });
      } else {
        qs.append(key, value);
      }
    });

    return qs.toString();
  }
}
```

### Content Fetchers

#### Blog Post Fetcher

```javascript
// lib/strapi/fetchers/BlogFetcher.js

class BlogFetcher {
  constructor(strapiClient) {
    this.client = strapiClient;
    this.cache = new Map();
  }

  async fetchAll(options = {}) {
    const { locale = 'en', limit = 1000, includeUnpublished = false } = options;

    const cacheKey = `blog:${locale}:${limit}:${includeUnpublished}`;

    // Check cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < 3600000) {
        // 1 hour cache
        return cached.data;
      }
    }

    const params = {
      locale,
      'pagination[limit]': limit,
      'pagination[page]': 1,
      'sort[0]': 'publishedAt:desc',
      populate: 'author,categories,seo,localizations',
    };

    if (!includeUnpublished) {
      params['filters[publishedAt][$notNull]'] = true;
    }

    const queryString = this.client.buildQueryString(params);
    const response = await this.client.fetch(`/api/articles?${queryString}`);

    const articles = await this.transformArticles(response.data, locale);

    // Cache the result
    this.cache.set(cacheKey, {
      data: articles,
      timestamp: Date.now(),
    });

    return articles;
  }

  async fetchBySlug(slug, locale = 'en') {
    const params = {
      locale,
      'filters[slug][$eq]': slug,
      populate: '*',
    };

    const queryString = this.client.buildQueryString(params);
    const response = await this.client.fetch(`/api/articles?${queryString}`);

    if (response.data.length === 0) {
      return null;
    }

    return this.transformArticle(response.data[0], locale);
  }

  async transformArticles(articles, locale) {
    return Promise.all(articles.map(article => this.transformArticle(article, locale)));
  }

  async transformArticle(article, locale) {
    const attributes = article.attributes;

    return {
      id: article.id,
      slug: attributes.slug,
      title: attributes.title,
      description: attributes.description,
      publishedAt: attributes.publishedAt,
      updatedAt: attributes.updatedAt,
      locale,
      url: this.buildUrl(attributes.slug, locale),
      alternates: this.buildAlternates(article),
      seo: {
        priority: this.calculatePriority(attributes.publishedAt),
        changefreq: this.calculateChangeFreq(attributes.updatedAt),
      },
    };
  }

  buildUrl(slug, locale) {
    const base = 'https://www.cdlhelp.com';
    return locale === 'en' ? `${base}/blog/${slug}` : `${base}/${locale}/blog/${slug}`;
  }

  buildAlternates(article) {
    const alternates = [];
    const localizations = article.attributes.localizations?.data || [];

    // Add current locale
    alternates.push({
      locale: article.attributes.locale,
      slug: article.attributes.slug,
      url: this.buildUrl(article.attributes.slug, article.attributes.locale),
    });

    // Add localizations
    localizations.forEach(loc => {
      alternates.push({
        locale: loc.attributes.locale,
        slug: loc.attributes.slug,
        url: this.buildUrl(loc.attributes.slug, loc.attributes.locale),
      });
    });

    return alternates;
  }

  calculatePriority(publishedAt) {
    const now = new Date();
    const published = new Date(publishedAt);
    const daysSincePublish = Math.floor((now - published) / (1000 * 60 * 60 * 24));

    if (daysSincePublish <= 7) return 0.9;
    if (daysSincePublish <= 30) return 0.8;
    if (daysSincePublish <= 90) return 0.7;
    if (daysSincePublish <= 180) return 0.6;
    return 0.5;
  }

  calculateChangeFreq(updatedAt) {
    const now = new Date();
    const updated = new Date(updatedAt);
    const daysSinceUpdate = Math.floor((now - updated) / (1000 * 60 * 60 * 24));

    if (daysSinceUpdate <= 1) return 'daily';
    if (daysSinceUpdate <= 7) return 'weekly';
    if (daysSinceUpdate <= 30) return 'monthly';
    return 'yearly';
  }
}
```

#### School Fetcher

```javascript
// lib/strapi/fetchers/SchoolFetcher.js

class SchoolFetcher {
  constructor(strapiClient) {
    this.client = strapiClient;
    this.statesCache = new Map();
  }

  async fetchAllStates() {
    if (this.statesCache.has('all')) {
      return this.statesCache.get('all');
    }

    const response = await this.client.fetch('/api/schools/states');
    const states = this.processStates(response.data);

    this.statesCache.set('all', states);
    return states;
  }

  async fetchByState(state) {
    const cacheKey = `state:${state}`;

    if (this.statesCache.has(cacheKey)) {
      return this.statesCache.get(cacheKey);
    }

    const params = {
      'filters[state][$eq]': state,
      'pagination[limit]': 1000,
      populate: 'city,programs',
    };

    const queryString = this.client.buildQueryString(params);
    const response = await this.client.fetch(`/api/schools?${queryString}`);

    const schools = this.processSchools(response.data, state);
    this.statesCache.set(cacheKey, schools);

    return schools;
  }

  async fetchCitiesByState(state) {
    const schools = await this.fetchByState(state);
    const cities = new Set();

    schools.forEach(school => {
      if (school.city) {
        cities.add(school.city);
      }
    });

    return Array.from(cities).sort();
  }

  processStates(data) {
    // Group schools by state and generate URLs
    const stateMap = new Map();

    data.forEach(item => {
      const state = item.state;
      if (!stateMap.has(state)) {
        stateMap.set(state, {
          name: state,
          slug: this.stateToSlug(state),
          schoolCount: 0,
          cities: new Set(),
          url: `/schools/${this.stateToSlug(state)}`,
        });
      }

      const stateData = stateMap.get(state);
      stateData.schoolCount++;
      if (item.city) {
        stateData.cities.add(item.city);
      }
    });

    return Array.from(stateMap.values()).map(state => ({
      ...state,
      cities: Array.from(state.cities),
    }));
  }

  processSchools(schools, state) {
    return schools.map(school => ({
      id: school.id,
      name: school.attributes.name,
      city: school.attributes.city,
      state: school.attributes.state,
      address: school.attributes.address,
      phone: school.attributes.phone,
      website: school.attributes.website,
      programs: school.attributes.programs,
      url: this.buildSchoolUrl(state, school.attributes.city, school.id),
      lastmod: school.attributes.updatedAt,
      priority: 0.6,
      changefreq: 'monthly',
    }));
  }

  buildSchoolUrl(state, city, id) {
    const stateSlug = this.stateToSlug(state);
    const citySlug = this.cityToSlug(city);

    return `/schools/${stateSlug}/${citySlug}#school-${id}`;
  }

  stateToSlug(state) {
    return state.toLowerCase().replace(/\s+/g, '-');
  }

  cityToSlug(city) {
    return city
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  }
}
```

### Webhook Integration

```javascript
// pages/api/webhook/strapi.js

export default async function handler(req, res) {
  // Verify webhook signature
  const signature = req.headers['x-strapi-signature'];
  if (!verifyWebhookSignature(req.body, signature)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const { event, model, entry } = req.body;

  try {
    switch (event) {
      case 'entry.create':
      case 'entry.update':
        await handleContentUpdate(model, entry);
        break;

      case 'entry.delete':
        await handleContentDelete(model, entry);
        break;

      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Processing failed' });
  }
}

async function handleContentUpdate(model, entry) {
  const cache = new CacheManager();

  switch (model) {
    case 'article':
      // Invalidate blog sitemap cache
      await cache.invalidate('sitemap:blog:*');
      await regenerateBlogSitemap();
      break;

    case 'school':
      // Invalidate school sitemap cache
      await cache.invalidate('sitemap:schools:*');
      await regenerateSchoolSitemap();
      break;

    case 'company':
      // Invalidate company sitemap cache
      await cache.invalidate('sitemap:companies:*');
      await regenerateCompanySitemap();
      break;
  }

  // Ping search engines about the update
  await pingSearchEngines();
}

async function handleContentDelete(model, entry) {
  // Similar to update, but may need to remove URLs from sitemap
  await handleContentUpdate(model, entry);
}

function verifyWebhookSignature(payload, signature) {
  const secret = process.env.STRAPI_WEBHOOK_SECRET;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  const digest = hmac.digest('hex');

  return signature === digest;
}
```

## Pagination and Streaming

### Large Dataset Handling

```javascript
// lib/strapi/PaginatedFetcher.js

class PaginatedFetcher {
  constructor(client, endpoint, pageSize = 100) {
    this.client = client;
    this.endpoint = endpoint;
    this.pageSize = pageSize;
  }

  async *fetchPages(params = {}) {
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const paginatedParams = {
        ...params,
        'pagination[page]': page,
        'pagination[pageSize]': this.pageSize,
      };

      const queryString = this.client.buildQueryString(paginatedParams);
      const response = await this.client.fetch(`${this.endpoint}?${queryString}`);

      yield response.data;

      hasMore = response.meta.pagination.page < response.meta.pagination.pageCount;
      page++;
    }
  }

  async fetchAll(params = {}) {
    const allData = [];

    for await (const pageData of this.fetchPages(params)) {
      allData.push(...pageData);
    }

    return allData;
  }

  async stream(params = {}, processor) {
    for await (const pageData of this.fetchPages(params)) {
      await processor(pageData);
    }
  }
}
```

### Streaming Sitemap Generation

```javascript
// lib/sitemap/StreamingSitemapGenerator.js

class StreamingSitemapGenerator {
  constructor(response) {
    this.response = response;
    this.xmlStream = new Transform({
      transform(chunk, encoding, callback) {
        this.push(chunk);
        callback();
      },
    });
  }

  async generate(dataFetcher) {
    // Set response headers
    this.response.setHeader('Content-Type', 'application/xml');
    this.response.setHeader('Transfer-Encoding', 'chunked');

    // Start XML document
    this.writeHeader();

    // Stream data
    await dataFetcher.stream({}, async batch => {
      for (const item of batch) {
        const urlXml = this.buildUrlXml(item);
        this.write(urlXml);
      }
    });

    // End XML document
    this.writeFooter();
    this.end();
  }

  writeHeader() {
    const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`;
    this.write(header);
  }

  writeFooter() {
    this.write('</urlset>');
  }

  write(data) {
    this.xmlStream.write(data);
  }

  end() {
    this.xmlStream.end();
  }

  buildUrlXml(item) {
    // Build XML for a single URL entry
    return `
  <url>
    <loc>${this.escape(item.url)}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
    ${this.buildAlternatesXml(item.alternates)}
  </url>`;
  }

  buildAlternatesXml(alternates) {
    if (!alternates || alternates.length === 0) return '';

    return alternates
      .map(
        alt =>
          `<xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${this.escape(alt.href)}"/>`
      )
      .join('\n    ');
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

## Performance Optimization

### Query Optimization

```javascript
// lib/strapi/QueryOptimizer.js

class QueryOptimizer {
  constructor() {
    this.queryCache = new Map();
  }

  optimizeQuery(baseQuery, options = {}) {
    const optimized = { ...baseQuery };

    // Only fetch required fields
    if (options.fields) {
      optimized['fields'] = options.fields.join(',');
    }

    // Limit population depth
    if (options.populate) {
      optimized['populate'] = this.optimizePopulation(options.populate);
    }

    // Add filters for better performance
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        optimized[`filters[${key}]`] = value;
      });
    }

    return optimized;
  }

  optimizePopulation(populate) {
    // Limit population to only required fields
    if (typeof populate === 'string') {
      return populate;
    }

    const optimized = {};
    Object.entries(populate).forEach(([key, value]) => {
      if (value === true) {
        optimized[key] = { fields: ['id', 'slug', 'locale'] };
      } else {
        optimized[key] = value;
      }
    });

    return optimized;
  }

  async batchFetch(ids, fetcher, batchSize = 50) {
    const batches = [];

    for (let i = 0; i < ids.length; i += batchSize) {
      const batch = ids.slice(i, i + batchSize);
      batches.push(batch);
    }

    const results = await Promise.all(batches.map(batch => fetcher(batch)));

    return results.flat();
  }
}
```

### Caching Strategy

```javascript
// lib/strapi/CacheStrategy.js

class StrapiCacheStrategy {
  constructor() {
    this.strategies = {
      articles: { ttl: 3600, invalidateOn: ['create', 'update', 'delete'] },
      schools: { ttl: 86400, invalidateOn: ['update', 'delete'] },
      companies: { ttl: 86400, invalidateOn: ['update', 'delete'] },
      faqs: { ttl: 604800, invalidateOn: ['update'] },
    };
  }

  getCacheTTL(contentType) {
    return this.strategies[contentType]?.ttl || 3600;
  }

  shouldInvalidate(contentType, event) {
    const strategy = this.strategies[contentType];
    return strategy?.invalidateOn.includes(event) || false;
  }

  generateCacheKey(contentType, params) {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {});

    const paramString = JSON.stringify(sortedParams);
    const hash = crypto.createHash('md5').update(paramString).digest('hex');

    return `strapi:${contentType}:${hash}`;
  }

  async getCached(key, fetcher, ttl) {
    const cached = await cache.get(key);

    if (cached) {
      return JSON.parse(cached);
    }

    const fresh = await fetcher();
    await cache.set(key, JSON.stringify(fresh), ttl);

    return fresh;
  }
}
```

## Error Handling and Fallbacks

```javascript
// lib/strapi/ErrorHandler.js

class StrapiErrorHandler {
  constructor() {
    this.fallbackData = new Map();
  }

  async handleFetchError(error, context) {
    console.error(`Strapi fetch error in ${context}:`, error);

    // Try fallback data
    if (this.fallbackData.has(context)) {
      console.log(`Using fallback data for ${context}`);
      return this.fallbackData.get(context);
    }

    // Try cached version even if expired
    const expiredCache = await this.getExpiredCache(context);
    if (expiredCache) {
      console.log(`Using expired cache for ${context}`);
      return expiredCache;
    }

    // Return empty data structure
    return this.getEmptyDataStructure(context);
  }

  async getExpiredCache(context) {
    // Attempt to retrieve expired cache data
    try {
      const cacheKey = `strapi:${context}:*`;
      const keys = await cache.keys(cacheKey);

      if (keys.length > 0) {
        const data = await cache.get(keys[0], { ignoreExpiry: true });
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to retrieve expired cache:', error);
    }

    return null;
  }

  getEmptyDataStructure(context) {
    const structures = {
      articles: [],
      schools: [],
      companies: [],
      faqs: [],
    };

    return structures[context] || [];
  }

  setFallbackData(context, data) {
    this.fallbackData.set(context, data);
  }
}
```

## Monitoring and Analytics

```javascript
// lib/strapi/Monitor.js

class StrapiMonitor {
  constructor() {
    this.metrics = {
      apiCalls: 0,
      cacheHits: 0,
      cacheMisses: 0,
      errors: 0,
      avgResponseTime: 0,
      contentCounts: {},
    };
  }

  trackApiCall(endpoint, duration, success) {
    this.metrics.apiCalls++;

    if (!success) {
      this.metrics.errors++;
    }

    // Update average response time
    this.metrics.avgResponseTime =
      (this.metrics.avgResponseTime * (this.metrics.apiCalls - 1) + duration) /
      this.metrics.apiCalls;
  }

  trackCache(hit) {
    if (hit) {
      this.metrics.cacheHits++;
    } else {
      this.metrics.cacheMisses++;
    }
  }

  trackContent(type, count) {
    this.metrics.contentCounts[type] = count;
  }

  getMetrics() {
    return {
      ...this.metrics,
      cacheHitRate: this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses),
      errorRate: this.metrics.errors / this.metrics.apiCalls,
    };
  }

  reset() {
    this.metrics = {
      apiCalls: 0,
      cacheHits: 0,
      cacheMisses: 0,
      errors: 0,
      avgResponseTime: 0,
      contentCounts: {},
    };
  }
}
```

## Best Practices

1. **Always use pagination** for large datasets to prevent memory issues
2. **Implement caching** at multiple levels (API, processed data, XML)
3. **Handle errors gracefully** with fallbacks and retries
4. **Monitor API usage** to stay within rate limits
5. **Use webhooks** for real-time updates instead of polling
6. **Optimize queries** to fetch only required fields
7. **Batch operations** when possible to reduce API calls
8. **Stream large responses** to prevent memory overflow
9. **Validate data** before including in sitemaps
10. **Track metrics** for performance optimization

## Next Steps

Continue to [05-technical-specifications.md](./05-technical-specifications.md) for detailed technical requirements and XML specifications.
