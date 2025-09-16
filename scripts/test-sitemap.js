#!/usr/bin/env node

/**
 * Test script for sitemap generation
 * Run with: node scripts/test-sitemap.js
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TESTS = [
  {
    name: 'Sitemap Index',
    url: '/api/sitemap',
    expectedContent: ['<sitemapindex', '</sitemapindex>', '<sitemap>', '<loc>'],
  },
  {
    name: 'Static Sitemap (English)',
    url: '/api/sitemap/static-en',
    expectedContent: ['<urlset', '</urlset>', '<url>', '<loc>', 'cdlhelp.com'],
  },
  {
    name: 'Static Sitemap (Russian)',
    url: '/api/sitemap/static-ru',
    expectedContent: ['<urlset', '</urlset>', '<url>', '<loc>', '/ru/'],
  },
  {
    name: 'Blog Sitemap',
    url: '/api/sitemap/blog',
    expectedContent: ['<urlset', '</urlset>', '<url>', '<loc>', '/blog/'],
  },
  {
    name: 'Schools Sitemap',
    url: '/api/sitemap/schools',
    expectedContent: ['<urlset', '</urlset>', '<url>', '<loc>', '/schools/'],
  },
  {
    name: 'Companies Sitemap',
    url: '/api/sitemap/companies',
    expectedContent: ['<urlset', '</urlset>', '<url>', '<loc>', '/companies/'],
  },
  {
    name: 'Sitemap.xml Rewrite',
    url: '/sitemap.xml',
    expectedContent: ['<sitemapindex', '</sitemapindex>'],
  },
];

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

/**
 * Make HTTP request
 */
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const fullUrl = new URL(url, BASE_URL);
    const client = fullUrl.protocol === 'https:' ? https : http;

    const options = {
      hostname: fullUrl.hostname,
      port: fullUrl.port,
      path: fullUrl.pathname + fullUrl.search,
      method: 'GET',
      headers: {
        Accept: 'application/xml',
      },
    };

    const req = client.request(options, res => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

/**
 * Validate XML structure
 */
function validateXml(xml) {
  const errors = [];

  // Check XML declaration
  if (!xml.startsWith('<?xml')) {
    errors.push('Missing XML declaration');
  }

  // Check for balanced tags
  const openTags = xml.match(/<([^/>]+)>/g) || [];
  const closeTags = xml.match(/<\/([^>]+)>/g) || [];

  // Basic check for common sitemap elements
  if (!xml.includes('<urlset') && !xml.includes('<sitemapindex')) {
    errors.push('Missing root element (urlset or sitemapindex)');
  }

  return errors;
}

/**
 * Count URLs in sitemap
 */
function countUrls(xml) {
  const urlMatches = xml.match(/<url>/g) || [];
  const sitemapMatches = xml.match(/<sitemap>/g) || [];
  return urlMatches.length + sitemapMatches.length;
}

/**
 * Extract URLs from sitemap
 */
function extractUrls(xml) {
  const urls = [];
  const regex = /<loc>([^<]+)<\/loc>/g;
  let match;

  while ((match = regex.exec(xml)) !== null) {
    urls.push(match[1]);
  }

  return urls;
}

/**
 * Run single test
 */
async function runTest(test) {
  const startTime = Date.now();

  try {
    console.log(`${colors.blue}Testing: ${test.name}${colors.reset}`);
    console.log(`${colors.gray}URL: ${test.url}${colors.reset}`);

    const response = await makeRequest(test.url);
    const duration = Date.now() - startTime;

    // Check status code
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }

    // Check content type
    const contentType = response.headers['content-type'];
    if (!contentType || !contentType.includes('xml')) {
      console.log(
        `${colors.yellow}  ⚠ Warning: Content-Type is not XML: ${contentType}${colors.reset}`
      );
    }

    // Check expected content
    for (const expected of test.expectedContent) {
      if (!response.body.includes(expected)) {
        throw new Error(`Missing expected content: ${expected}`);
      }
    }

    // Validate XML structure
    const xmlErrors = validateXml(response.body);
    if (xmlErrors.length > 0) {
      throw new Error(`XML validation errors: ${xmlErrors.join(', ')}`);
    }

    // Count URLs
    const urlCount = countUrls(response.body);

    // Extract and display sample URLs
    const urls = extractUrls(response.body);
    const sampleUrls = urls.slice(0, 3);

    console.log(`${colors.green}  ✓ PASSED${colors.reset} (${duration}ms)`);
    console.log(`${colors.gray}    - Status: ${response.status}`);
    console.log(`    - URLs/Sitemaps: ${urlCount}`);
    if (sampleUrls.length > 0) {
      console.log(`    - Sample URLs:`);
      sampleUrls.forEach(url => {
        console.log(`      • ${url.substring(0, 60)}${url.length > 60 ? '...' : ''}`);
      });
    }
    console.log(`${colors.reset}`);

    return { success: true, duration, urlCount };
  } catch (error) {
    const duration = Date.now() - startTime;
    console.log(`${colors.red}  ✗ FAILED${colors.reset} (${duration}ms)`);
    console.log(`${colors.red}    Error: ${error.message}${colors.reset}\n`);

    return { success: false, error: error.message, duration };
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log(`${colors.blue}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.blue}Sitemap Testing Suite${colors.reset}`);
  console.log(`${colors.gray}Base URL: ${BASE_URL}${colors.reset}`);
  console.log(`${colors.blue}${'='.repeat(60)}${colors.reset}\n`);

  const results = [];
  let totalUrls = 0;

  for (const test of TESTS) {
    const result = await runTest(test);
    results.push({ ...result, name: test.name });
    if (result.urlCount) {
      totalUrls += result.urlCount;
    }
  }

  // Print summary
  console.log(`${colors.blue}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.blue}Test Summary${colors.reset}`);
  console.log(`${colors.blue}${'='.repeat(60)}${colors.reset}`);

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  console.log(`Total URLs: ${totalUrls}`);
  console.log(`Total Time: ${totalDuration}ms`);
  console.log(`Average Time: ${Math.round(totalDuration / results.length)}ms`);

  if (failed > 0) {
    console.log(`\n${colors.red}Failed Tests:${colors.reset}`);
    results
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`  - ${r.name}: ${r.error}`);
      });
  }

  console.log(`\n${colors.blue}${'='.repeat(60)}${colors.reset}`);

  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

// Handle errors
process.on('unhandledRejection', error => {
  console.error(`${colors.red}Unhandled error: ${error.message}${colors.reset}`);
  process.exit(1);
});

// Run tests
runAllTests().catch(error => {
  console.error(`${colors.red}Test suite error: ${error.message}${colors.reset}`);
  process.exit(1);
});
