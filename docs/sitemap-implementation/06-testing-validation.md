# Testing and Validation Strategy

## Comprehensive Testing Framework

### Test Categories

1. **Unit Tests** - Individual component testing
2. **Integration Tests** - Component interaction testing
3. **End-to-End Tests** - Full workflow testing
4. **Performance Tests** - Load and stress testing
5. **Validation Tests** - XML and SEO compliance
6. **Regression Tests** - Prevent feature breakage

## Unit Testing

### Sitemap Generator Tests

```javascript
// tests/unit/SitemapGenerator.test.js

const { SitemapGenerator } = require('../../lib/sitemap/SitemapGenerator');
const { expect } = require('chai');
const sinon = require('sinon');

describe('SitemapGenerator', () => {
  let generator;
  let strapiStub;

  beforeEach(() => {
    generator = new SitemapGenerator({
      baseUrl: 'https://www.cdlhelp.com',
      locales: ['en', 'ru'],
    });

    strapiStub = sinon.stub(generator, 'fetchFromStrapi');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('generateStaticUrls', () => {
    it('should generate URLs for all static pages', async () => {
      const urls = await generator.generateStaticUrls('en');

      expect(urls).to.be.an('array');
      expect(urls.length).to.be.greaterThan(0);
      expect(urls[0]).to.have.property('loc');
      expect(urls[0]).to.have.property('priority');
      expect(urls[0]).to.have.property('changefreq');
    });

    it('should include correct locale prefix for non-English', async () => {
      const urls = await generator.generateStaticUrls('ru');

      expect(urls[0].loc).to.include('/ru/');
    });

    it('should not include locale prefix for English', async () => {
      const urls = await generator.generateStaticUrls('en');

      expect(urls[0].loc).to.not.include('/en/');
    });
  });

  describe('generateHreflangAlternates', () => {
    it('should generate alternates for all locales', () => {
      const alternates = generator.generateHreflangAlternates('/test-page');

      expect(alternates).to.be.an('array');
      expect(alternates).to.have.lengthOf(3); // en, ru, x-default

      const hreflangValues = alternates.map(a => a.hreflang);
      expect(hreflangValues).to.include('en');
      expect(hreflangValues).to.include('ru');
      expect(hreflangValues).to.include('x-default');
    });

    it('should generate correct URLs for each locale', () => {
      const alternates = generator.generateHreflangAlternates('/test-page');

      const enAlternate = alternates.find(a => a.hreflang === 'en');
      const ruAlternate = alternates.find(a => a.hreflang === 'ru');

      expect(enAlternate.href).to.equal('https://www.cdlhelp.com/test-page');
      expect(ruAlternate.href).to.equal('https://www.cdlhelp.com/ru/test-page');
    });
  });

  describe('calculatePriority', () => {
    it('should assign correct priority based on page type', () => {
      expect(generator.calculatePriority('/')).to.equal(1.0);
      expect(generator.calculatePriority('/cdl-practice-test')).to.be.at.least(0.8);
      expect(generator.calculatePriority('/privacy-policy')).to.be.at.most(0.5);
    });
  });

  describe('error handling', () => {
    it('should handle Strapi API failures gracefully', async () => {
      strapiStub.rejects(new Error('API Error'));

      const result = await generator.generateBlogUrls();

      expect(result).to.be.an('array');
      expect(result).to.be.empty;
    });

    it('should use cached data when available', async () => {
      const cachedData = [{ loc: '/test', priority: 0.5 }];
      sinon.stub(generator.cache, 'get').resolves(cachedData);

      const result = await generator.generateWithCache('test-key');

      expect(result).to.deep.equal(cachedData);
      expect(strapiStub.called).to.be.false;
    });
  });
});
```

### URL Validator Tests

```javascript
// tests/unit/UrlValidator.test.js

const { UrlValidator } = require('../../lib/sitemap/UrlValidator');
const { expect } = require('chai');

describe('UrlValidator', () => {
  let validator;

  beforeEach(() => {
    validator = new UrlValidator();
  });

  describe('validate', () => {
    it('should accept valid HTTPS URLs', () => {
      const result = validator.validate('https://www.cdlhelp.com/page');

      expect(result.valid).to.be.true;
      expect(result.errors).to.be.empty;
    });

    it('should reject HTTP URLs', () => {
      const result = validator.validate('http://www.cdlhelp.com/page');

      expect(result.valid).to.be.false;
      expect(result.errors).to.include('Protocol must be one of: https');
    });

    it('should reject URLs exceeding maximum length', () => {
      const longUrl = 'https://www.cdlhelp.com/' + 'a'.repeat(2048);
      const result = validator.validate(longUrl);

      expect(result.valid).to.be.false;
      expect(result.errors[0]).to.include('exceeds maximum length');
    });

    it('should escape special characters', () => {
      const url = 'https://www.cdlhelp.com/page?param=value&other=<script>';
      const result = validator.validate(url);

      expect(result.escaped).to.include('&amp;');
      expect(result.escaped).to.include('&lt;');
    });

    it('should detect forbidden characters', () => {
      const url = 'https://www.cdlhelp.com/page<script>';
      const result = validator.validate(url);

      expect(result.valid).to.be.false;
      expect(result.errors[0]).to.include('forbidden character');
    });
  });

  describe('escapeUrl', () => {
    it('should escape XML entities', () => {
      const input = 'https://example.com?a=1&b="test"';
      const escaped = validator.escapeUrl(input);

      expect(escaped).to.equal('https://example.com?a=1&amp;b=&quot;test&quot;');
    });
  });
});
```

## Integration Testing

### Strapi Integration Tests

```javascript
// tests/integration/StrapiIntegration.test.js

const { StrapiClient } = require('../../lib/strapi/StrapiClient');
const { BlogFetcher } = require('../../lib/strapi/fetchers/BlogFetcher');
const nock = require('nock');
const { expect } = require('chai');

describe('Strapi Integration', () => {
  let client;
  let blogFetcher;
  const strapiUrl = 'http://localhost:1337';

  beforeEach(() => {
    client = new StrapiClient({
      baseUrl: strapiUrl,
      apiKey: 'test-api-key',
    });
    blogFetcher = new BlogFetcher(client);
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('BlogFetcher', () => {
    it('should fetch blog posts from Strapi', async () => {
      const mockData = {
        data: [
          {
            id: 1,
            attributes: {
              title: 'Test Post',
              slug: 'test-post',
              publishedAt: '2024-01-15',
              locale: 'en',
            },
          },
        ],
        meta: { pagination: { total: 1 } },
      };

      nock(strapiUrl).get('/api/articles').query(true).reply(200, mockData);

      const posts = await blogFetcher.fetchAll({ locale: 'en' });

      expect(posts).to.be.an('array');
      expect(posts).to.have.lengthOf(1);
      expect(posts[0]).to.have.property('slug', 'test-post');
      expect(posts[0]).to.have.property('url');
    });

    it('should handle pagination correctly', async () => {
      const page1 = {
        data: Array(100)
          .fill(null)
          .map((_, i) => ({
            id: i,
            attributes: { slug: `post-${i}`, publishedAt: '2024-01-15' },
          })),
        meta: { pagination: { page: 1, pageCount: 2 } },
      };

      const page2 = {
        data: Array(50)
          .fill(null)
          .map((_, i) => ({
            id: i + 100,
            attributes: { slug: `post-${i + 100}`, publishedAt: '2024-01-15' },
          })),
        meta: { pagination: { page: 2, pageCount: 2 } },
      };

      nock(strapiUrl)
        .get('/api/articles')
        .query(q => q['pagination[page]'] === '1')
        .reply(200, page1);

      nock(strapiUrl)
        .get('/api/articles')
        .query(q => q['pagination[page]'] === '2')
        .reply(200, page2);

      const posts = await blogFetcher.fetchAllPaginated();

      expect(posts).to.have.lengthOf(150);
    });

    it('should handle API errors gracefully', async () => {
      nock(strapiUrl)
        .get('/api/articles')
        .query(true)
        .reply(500, { error: 'Internal Server Error' });

      const posts = await blogFetcher.fetchAll();

      expect(posts).to.be.an('array');
      expect(posts).to.be.empty;
    });
  });
});
```

## End-to-End Testing

### Full Sitemap Generation Test

```javascript
// tests/e2e/SitemapGeneration.test.js

const request = require('supertest');
const app = require('../../server');
const { expect } = require('chai');
const xml2js = require('xml2js');

describe('E2E: Sitemap Generation', () => {
  let server;

  before(done => {
    server = app.listen(3001, done);
  });

  after(done => {
    server.close(done);
  });

  describe('GET /api/sitemap', () => {
    it('should return valid sitemap index XML', async () => {
      const response = await request(server)
        .get('/api/sitemap')
        .expect(200)
        .expect('Content-Type', /application\/xml/);

      const parser = new xml2js.Parser();
      const result = await parser.parseStringPromise(response.text);

      expect(result).to.have.property('sitemapindex');
      expect(result.sitemapindex).to.have.property('sitemap');
      expect(result.sitemapindex.sitemap).to.be.an('array');
      expect(result.sitemapindex.sitemap.length).to.be.greaterThan(0);
    });

    it('should include all expected sitemaps', async () => {
      const response = await request(server).get('/api/sitemap').expect(200);

      const parser = new xml2js.Parser();
      const result = await parser.parseStringPromise(response.text);

      const sitemapUrls = result.sitemapindex.sitemap.map(s => s.loc[0]);

      expect(sitemapUrls).to.include.members([
        'https://www.cdlhelp.com/sitemap-static-en.xml',
        'https://www.cdlhelp.com/sitemap-blog.xml',
        'https://www.cdlhelp.com/sitemap-schools.xml',
      ]);
    });
  });

  describe('GET /api/sitemap/static', () => {
    it('should return valid static sitemap', async () => {
      const response = await request(server)
        .get('/api/sitemap/static?locale=en')
        .expect(200)
        .expect('Content-Type', /application\/xml/);

      const parser = new xml2js.Parser();
      const result = await parser.parseStringPromise(response.text);

      expect(result).to.have.property('urlset');
      expect(result.urlset).to.have.property('url');
      expect(result.urlset.url).to.be.an('array');
    });

    it('should include hreflang annotations', async () => {
      const response = await request(server).get('/api/sitemap/static?locale=en').expect(200);

      const parser = new xml2js.Parser();
      const result = await parser.parseStringPromise(response.text);

      const firstUrl = result.urlset.url[0];
      expect(firstUrl).to.have.property('xhtml:link');

      const hreflangLinks = firstUrl['xhtml:link'];
      expect(hreflangLinks).to.be.an('array');

      const hreflangValues = hreflangLinks.map(link => link.$.hreflang);
      expect(hreflangValues).to.include('x-default');
    });
  });

  describe('Performance', () => {
    it('should generate static sitemap within 3 seconds', async () => {
      const start = Date.now();

      await request(server).get('/api/sitemap/static?locale=en').expect(200);

      const duration = Date.now() - start;
      expect(duration).to.be.lessThan(3000);
    });

    it('should handle concurrent requests', async () => {
      const requests = Array(10)
        .fill(null)
        .map(() => request(server).get('/api/sitemap/static?locale=en').expect(200));

      const results = await Promise.all(requests);

      // All requests should return the same content
      const firstContent = results[0].text;
      results.forEach(result => {
        expect(result.text).to.equal(firstContent);
      });
    });
  });
});
```

## Performance Testing

### Load Testing Script

```javascript
// tests/performance/load-test.js

const autocannon = require('autocannon');
const { expect } = require('chai');

async function runLoadTest() {
  const results = await autocannon({
    url: 'http://localhost:3000',
    connections: 10, // Concurrent connections
    pipelining: 1,
    duration: 30, // Seconds
    requests: [
      {
        method: 'GET',
        path: '/api/sitemap',
      },
      {
        method: 'GET',
        path: '/api/sitemap/static?locale=en',
      },
      {
        method: 'GET',
        path: '/api/sitemap/blog',
      },
    ],
  });

  console.log('Load Test Results:');
  console.log('==================');
  console.log(`Requests/sec: ${results.requests.average}`);
  console.log(`Latency (ms): ${results.latency.mean}`);
  console.log(`Throughput (MB/s): ${results.throughput.average / 1024 / 1024}`);
  console.log(`Errors: ${results.errors}`);
  console.log(`Timeouts: ${results.timeouts}`);

  // Assertions
  expect(results.requests.average).to.be.greaterThan(100); // At least 100 req/s
  expect(results.latency.p99).to.be.lessThan(5000); // 99th percentile < 5s
  expect(results.errors).to.equal(0); // No errors
  expect(results.timeouts).to.equal(0); // No timeouts
}

runLoadTest().catch(console.error);
```

### Memory Usage Test

```javascript
// tests/performance/memory-test.js

const { performance } = require('perf_hooks');
const v8 = require('v8');

class MemoryProfiler {
  constructor() {
    this.snapshots = [];
  }

  takeSnapshot(label) {
    const heapStats = v8.getHeapStatistics();
    const memUsage = process.memoryUsage();

    this.snapshots.push({
      label,
      timestamp: Date.now(),
      heap: {
        used: memUsage.heapUsed / 1024 / 1024, // MB
        total: memUsage.heapTotal / 1024 / 1024,
        limit: heapStats.heap_size_limit / 1024 / 1024,
      },
      rss: memUsage.rss / 1024 / 1024,
      external: memUsage.external / 1024 / 1024,
    });
  }

  getReport() {
    return {
      snapshots: this.snapshots,
      peakHeap: Math.max(...this.snapshots.map(s => s.heap.used)),
      avgHeap: this.snapshots.reduce((sum, s) => sum + s.heap.used, 0) / this.snapshots.length,
    };
  }
}

async function testMemoryUsage() {
  const profiler = new MemoryProfiler();
  const generator = new SitemapGenerator();

  profiler.takeSnapshot('Initial');

  // Generate small sitemap
  await generator.generateStaticSitemap('en');
  profiler.takeSnapshot('After static generation');

  // Generate large sitemap (blog with 1000+ posts)
  await generator.generateBlogSitemap();
  profiler.takeSnapshot('After blog generation');

  // Force garbage collection
  if (global.gc) {
    global.gc();
    profiler.takeSnapshot('After GC');
  }

  const report = profiler.getReport();
  console.log('Memory Usage Report:', JSON.stringify(report, null, 2));

  // Assertions
  expect(report.peakHeap).to.be.lessThan(200); // Peak heap < 200MB
  expect(report.avgHeap).to.be.lessThan(150); // Average heap < 150MB
}

testMemoryUsage().catch(console.error);
```

## XML Validation

### Schema Validation

```javascript
// tests/validation/xml-validation.js

const libxml = require('libxmljs2');
const fs = require('fs').promises;
const path = require('path');

class XmlValidator {
  constructor() {
    this.sitemapSchema = null;
    this.loadSchemas();
  }

  async loadSchemas() {
    // Load sitemap XSD schema
    const schemaPath = path.join(__dirname, 'schemas', 'sitemap.xsd');
    const schemaContent = await fs.readFile(schemaPath, 'utf8');
    this.sitemapSchema = libxml.parseXml(schemaContent);
  }

  validateSitemap(xmlContent) {
    const xmlDoc = libxml.parseXml(xmlContent);
    const isValid = xmlDoc.validate(this.sitemapSchema);

    if (!isValid) {
      return {
        valid: false,
        errors: xmlDoc.validationErrors.map(err => ({
          line: err.line,
          column: err.column,
          message: err.message,
        })),
      };
    }

    return { valid: true, errors: [] };
  }

  validateStructure(xmlContent) {
    const xmlDoc = libxml.parseXml(xmlContent);
    const errors = [];

    // Check for required elements
    const urls = xmlDoc.find('//url', 'http://www.sitemaps.org/schemas/sitemap/0.9');

    urls.forEach((url, index) => {
      const loc = url.get('loc');
      if (!loc) {
        errors.push(`URL ${index}: Missing required <loc> element`);
      }

      const priority = url.get('priority');
      if (priority) {
        const value = parseFloat(priority.text());
        if (value < 0 || value > 1) {
          errors.push(`URL ${index}: Priority must be between 0.0 and 1.0`);
        }
      }

      const changefreq = url.get('changefreq');
      if (changefreq) {
        const validValues = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
        if (!validValues.includes(changefreq.text())) {
          errors.push(`URL ${index}: Invalid changefreq value: ${changefreq.text()}`);
        }
      }
    });

    return { valid: errors.length === 0, errors };
  }

  validateHreflang(xmlContent) {
    const xmlDoc = libxml.parseXml(xmlContent);
    const errors = [];
    const warnings = [];

    const urls = xmlDoc.find('//url', 'http://www.sitemaps.org/schemas/sitemap/0.9');

    urls.forEach((url, index) => {
      const loc = url.get('loc').text();
      const hreflangLinks = url.find('xhtml:link[@rel="alternate"]', {
        xhtml: 'http://www.w3.org/1999/xhtml',
      });

      if (hreflangLinks.length > 0) {
        const hreflangValues = hreflangLinks.map(link => link.attr('hreflang').value());

        // Check for x-default
        if (!hreflangValues.includes('x-default')) {
          warnings.push(`URL ${index} (${loc}): Missing x-default hreflang`);
        }

        // Check for self-reference
        const selfRef = hreflangLinks.find(link => link.attr('href').value() === loc);
        if (!selfRef) {
          errors.push(`URL ${index} (${loc}): Missing self-reference in hreflang`);
        }

        // Check for duplicates
        const duplicates = hreflangValues.filter((v, i, arr) => arr.indexOf(v) !== i);
        if (duplicates.length > 0) {
          errors.push(`URL ${index} (${loc}): Duplicate hreflang values: ${duplicates.join(', ')}`);
        }
      }
    });

    return { valid: errors.length === 0, errors, warnings };
  }
}

// Test runner
async function runValidation() {
  const validator = new XmlValidator();
  const sitemapPath = path.join(__dirname, '../../generated/sitemap.xml');
  const xmlContent = await fs.readFile(sitemapPath, 'utf8');

  console.log('Running XML Validation...');
  console.log('========================');

  // Schema validation
  const schemaResult = validator.validateSitemap(xmlContent);
  console.log('Schema Validation:', schemaResult.valid ? '✅ PASSED' : '❌ FAILED');
  if (!schemaResult.valid) {
    console.log('Errors:', schemaResult.errors);
  }

  // Structure validation
  const structureResult = validator.validateStructure(xmlContent);
  console.log('Structure Validation:', structureResult.valid ? '✅ PASSED' : '❌ FAILED');
  if (!structureResult.valid) {
    console.log('Errors:', structureResult.errors);
  }

  // Hreflang validation
  const hreflangResult = validator.validateHreflang(xmlContent);
  console.log('Hreflang Validation:', hreflangResult.valid ? '✅ PASSED' : '❌ FAILED');
  if (!hreflangResult.valid) {
    console.log('Errors:', hreflangResult.errors);
  }
  if (hreflangResult.warnings.length > 0) {
    console.log('Warnings:', hreflangResult.warnings);
  }
}

runValidation().catch(console.error);
```

## SEO Validation

### Google Search Console Validation

```javascript
// tests/validation/seo-validation.js

const { google } = require('googleapis');
const searchconsole = google.searchconsole('v1');

class SEOValidator {
  constructor(siteUrl, credentials) {
    this.siteUrl = siteUrl;
    this.auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });
  }

  async validateSitemap(sitemapUrl) {
    const auth = await this.auth.getClient();

    // Get sitemap status from Search Console
    const response = await searchconsole.sitemaps.get({
      auth,
      siteUrl: this.siteUrl,
      feedpath: sitemapUrl,
    });

    const sitemap = response.data;
    const errors = [];
    const warnings = [];

    // Check for errors
    if (sitemap.errors > 0) {
      errors.push(`Sitemap has ${sitemap.errors} errors reported by Google`);
    }

    // Check for warnings
    if (sitemap.warnings > 0) {
      warnings.push(`Sitemap has ${sitemap.warnings} warnings reported by Google`);
    }

    // Check indexation rate
    const indexationRate = sitemap.submitted > 0 ? (sitemap.indexed / sitemap.submitted) * 100 : 0;

    if (indexationRate < 80) {
      warnings.push(`Low indexation rate: ${indexationRate.toFixed(2)}%`);
    }

    // Check last download date
    const lastDownload = new Date(sitemap.lastDownloaded);
    const daysSinceDownload = (Date.now() - lastDownload) / (1000 * 60 * 60 * 24);

    if (daysSinceDownload > 7) {
      warnings.push(`Sitemap hasn't been downloaded for ${daysSinceDownload.toFixed(0)} days`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      stats: {
        submitted: sitemap.submitted,
        indexed: sitemap.indexed,
        indexationRate: `${indexationRate.toFixed(2)}%`,
        lastDownloaded: sitemap.lastDownloaded,
      },
    };
  }

  async getCrawlErrors() {
    const auth = await this.auth.getClient();

    const response = await searchconsole.urlCrawlErrorsCounts.query({
      auth,
      siteUrl: this.siteUrl,
      fields: 'countPerTypes',
    });

    return response.data.countPerTypes || [];
  }
}
```

## Automated Test Suite

### Test Configuration

```javascript
// tests/config/test-config.js

module.exports = {
  testEnvironment: {
    baseUrl: process.env.TEST_BASE_URL || 'http://localhost:3000',
    strapiUrl: process.env.TEST_STRAPI_URL || 'http://localhost:1337',
    redisUrl: process.env.TEST_REDIS_URL || 'redis://localhost:6379',
  },

  testData: {
    locales: ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'],
    samplePages: ['/', '/cdl-practice-test', '/general-knowledge', '/blog', '/schools'],
  },

  performance: {
    maxResponseTime: 3000, // ms
    minRequestsPerSecond: 100,
    maxMemoryUsage: 200, // MB
  },

  validation: {
    minIndexationRate: 80, // %
    maxCrawlErrors: 10,
    maxXmlErrors: 0,
  },
};
```

### Test Runner

```json
// package.json test scripts

{
  "scripts": {
    "test": "npm run test:unit && npm run test:integration && npm run test:e2e",
    "test:unit": "mocha tests/unit/**/*.test.js",
    "test:integration": "mocha tests/integration/**/*.test.js --timeout 10000",
    "test:e2e": "mocha tests/e2e/**/*.test.js --timeout 30000",
    "test:performance": "node tests/performance/load-test.js",
    "test:validation": "node tests/validation/xml-validation.js",
    "test:seo": "node tests/validation/seo-validation.js",
    "test:watch": "mocha tests/**/*.test.js --watch",
    "test:coverage": "nyc npm test",
    "test:ci": "npm run test:coverage && npm run test:performance"
  }
}
```

## Continuous Testing

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml

name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      redis:
        image: redis:alpine
        ports:
          - 6379:6379

      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: test
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Run performance tests
        run: npm run test:performance

      - name: Run validation tests
        run: npm run test:validation

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
```

## Next Steps

Continue to [07-monitoring-maintenance.md](./07-monitoring-maintenance.md) for monitoring and maintenance procedures.
