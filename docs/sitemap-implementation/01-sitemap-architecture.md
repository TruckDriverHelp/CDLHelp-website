# CDLHelp Sitemap Architecture

## Overview

This document outlines the comprehensive sitemap architecture for CDLHelp, designed to handle multi-locale content, dynamic Strapi-generated pages, and optimal SEO performance.

## Architecture Components

### 1. Core Sitemap Structure

```
sitemap-index.xml (Main Entry Point)
├── sitemap-static-en.xml       (English static pages)
├── sitemap-static-ru.xml       (Russian static pages)
├── sitemap-static-uk.xml       (Ukrainian static pages)
├── sitemap-static-ar.xml       (Arabic static pages)
├── sitemap-static-ko.xml       (Korean static pages)
├── sitemap-static-zh.xml       (Chinese static pages)
├── sitemap-static-tr.xml       (Turkish static pages)
├── sitemap-static-pt.xml       (Portuguese static pages)
├── sitemap-blog.xml           (All blog posts, all locales)
├── sitemap-schools.xml        (School listings)
├── sitemap-companies.xml      (Company pages)
├── sitemap-media.xml          (Images and videos)
└── sitemap-news.xml           (News content for Google News)
```

### 2. URL Structure Pattern

#### Static Pages

```
https://www.cdlhelp.com/[page]              (English - default)
https://www.cdlhelp.com/ru/[page]           (Russian)
https://www.cdlhelp.com/uk/[page]           (Ukrainian)
https://www.cdlhelp.com/ar/[page]           (Arabic)
https://www.cdlhelp.com/ko/[page]           (Korean)
https://www.cdlhelp.com/zh/[page]           (Chinese)
https://www.cdlhelp.com/tr/[page]           (Turkish)
https://www.cdlhelp.com/pt/[page]           (Portuguese)
```

#### Dynamic Content

```
/blog/[slug]                    (Blog posts)
/schools/[state]               (State school listings)
/schools/[state]/[city]        (City-specific schools)
/companies/[slug]              (Trucking companies)
/pre-trip-inspection/guide     (Consolidated guide)
```

### 3. Page Categories

#### Tier 1: Critical Pages (Priority 1.0)

- Homepage (all locales)
- CDL Practice Tests main page
- Download app page

#### Tier 2: Primary Content (Priority 0.8-0.9)

- General Knowledge test
- Air Brakes test
- Combination Vehicles test
- HazMat test
- Pre-trip Inspection guide
- Blog index
- Schools index

#### Tier 3: Secondary Content (Priority 0.6-0.7)

- Individual blog posts
- State school pages
- Company pages
- About page
- Contact page

#### Tier 4: Supporting Pages (Priority 0.3-0.5)

- Privacy Policy
- Terms and Conditions
- FAQ pages
- Archive pages

### 4. Hreflang Implementation

Each URL entry includes complete hreflang annotations:

```xml
<url>
  <loc>https://www.cdlhelp.com/cdl-practice-test</loc>
  <lastmod>2024-01-15</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
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

### 5. Dynamic Content Handling

#### Blog Posts

- Fetched from Strapi API
- Include publication date as lastmod
- Priority based on recency and engagement
- Separate entries for each locale version

#### School Pages

- State-level pages generated from database
- City pages generated dynamically
- Include location-specific metadata
- Update frequency: monthly

#### Company Pages

- Generated from Strapi content
- Include company-specific metadata
- Priority based on company size/prominence

### 6. Performance Optimization

#### Caching Strategy

```javascript
// Cache durations
const CACHE_DURATIONS = {
  static: 24 * 60 * 60, // 24 hours for static pages
  blog: 6 * 60 * 60, // 6 hours for blog content
  schools: 7 * 24 * 60 * 60, // 1 week for school data
  index: 1 * 60 * 60, // 1 hour for sitemap index
};
```

#### Generation Methods

1. **Build-time Generation**: Static pages during build
2. **On-demand Generation**: Dynamic content with caching
3. **Incremental Updates**: Webhook-triggered updates from Strapi

### 7. File Size Management

- Split sitemaps when approaching 40,000 URLs (safety margin)
- Compress large sitemaps with gzip
- Stream generation for memory efficiency
- Pagination for dynamic content queries

### 8. Error Handling

#### URL Validation

- Verify all URLs return 200 status
- Check for redirect chains
- Validate locale availability
- Ensure no duplicate URLs

#### Fallback Mechanisms

- Default to English for missing translations
- Graceful handling of Strapi API failures
- Cached version serving during regeneration
- Error logging and monitoring

### 9. Search Engine Integration

#### Submission Points

1. Google Search Console
2. Bing Webmaster Tools
3. Yandex Webmaster (for Russian content)
4. Baidu (for Chinese content)

#### Ping Services

```javascript
const PING_URLS = ['https://www.google.com/ping?sitemap=', 'https://www.bing.com/ping?sitemap='];
```

### 10. Monitoring Metrics

#### Key Performance Indicators

- Indexation rate per locale
- Discovery time for new content
- Crawl errors by category
- Generation time per sitemap
- Cache hit rates

#### Alert Thresholds

- Generation time > 5 seconds
- Error rate > 1%
- Indexation rate < 80%
- Crawl errors > 10 per day

## Implementation Phases

### Phase 1: Foundation (Week 1)

- Core sitemap generator
- Static page handling
- Basic locale support

### Phase 2: Dynamic Content (Week 2)

- Strapi integration
- Blog post generation
- School/company pages

### Phase 3: Optimization (Week 3)

- Caching implementation
- Performance tuning
- Error handling

### Phase 4: Monitoring (Week 4)

- Analytics integration
- Alert system
- Documentation

## Success Criteria

1. All indexable pages included in sitemaps
2. Generation time < 3 seconds for static sitemaps
3. 100% valid XML structure
4. Proper hreflang implementation
5. Automated updates for dynamic content
6. Zero broken URLs in sitemaps
7. Search engine acceptance without errors

## Next Steps

Proceed to [02-implementation-strategy.md](./02-implementation-strategy.md) for detailed implementation guidelines.
