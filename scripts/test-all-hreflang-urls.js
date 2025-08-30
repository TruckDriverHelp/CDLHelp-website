#!/usr/bin/env node

/**
 * Test all hreflang URLs to ensure they return 200 status codes
 */

const https = require('https');
const http = require('http');

// All supported locales
const locales = ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'];

// Test URLs patterns
const urlPatterns = [
  // Schools index
  '/schools',

  // State pages
  '/schools/florida',
  '/schools/ohio',
  '/schools/illinois',
  '/schools/california',
  '/schools/texas',
  '/schools/new-york',
  '/schools/pennsylvania',
  '/schools/washington',
  '/schools/wisconsin',

  // City pages
  '/schools/florida/miami',
  '/schools/florida/orlando',
  '/schools/florida/jacksonville',
  '/schools/ohio/columbus',
  '/schools/ohio/cincinnati',
  '/schools/illinois/chicago',
  '/schools/california/los-angeles',
  '/schools/california/sacramento',
  '/schools/texas/houston',
  '/schools/texas/dallas',
  '/schools/new-york/buffalo',
  '/schools/pennsylvania/philadelphia',
  '/schools/washington/seattle',
  '/schools/wisconsin/milwaukee',

  // Other important pages
  '/cdl-texas',
  '/what-is-taught-in-cdl-schools',
  '/how-to-use-cdl-help',
  '/how-to-become-a-truck-driver',
  '/how-to-get-cdl',
  '/frequently-asked-questions',
  '/contact',
  '/blog',
  '/download',
  '/pre-trip-inspection',
  '/dot-physical',
  '/road-signs',
];

// Function to test a URL
function testUrl(url) {
  return new Promise(resolve => {
    const protocol = url.startsWith('https') ? https : http;

    const options = {
      method: 'HEAD',
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; HreflangTester/1.0)',
      },
    };

    const req = protocol.request(url, options, res => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        testUrl(res.headers.location).then(resolve);
      } else {
        resolve({
          url,
          status: res.statusCode,
          ok: res.statusCode === 200,
        });
      }
    });

    req.on('error', error => {
      resolve({
        url,
        status: 'ERROR',
        error: error.message,
        ok: false,
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        status: 'TIMEOUT',
        ok: false,
      });
    });

    req.end();
  });
}

// Main test function
async function testAllHreflangUrls() {
  console.log('🔍 Testing all hreflang URLs...\n');

  const results = {
    total: 0,
    success: 0,
    failed: [],
  };

  const baseUrl = 'https://www.cdlhelp.com';

  for (const pattern of urlPatterns) {
    for (const locale of locales) {
      const url = locale === 'en' ? `${baseUrl}${pattern}` : `${baseUrl}/${locale}${pattern}`;

      results.total++;

      const result = await testUrl(url);

      if (result.ok) {
        results.success++;
        process.stdout.write('✅');
      } else {
        results.failed.push(result);
        process.stdout.write('❌');
      }

      // Add a small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log(` ${pattern}`);
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary:');
  console.log(`Total URLs tested: ${results.total}`);
  console.log(`✅ Successful (200): ${results.success}`);
  console.log(`❌ Failed: ${results.failed.length}`);

  if (results.failed.length > 0) {
    console.log('\n❌ Failed URLs:');
    console.log('-'.repeat(60));

    for (const fail of results.failed) {
      console.log(`${fail.url}`);
      console.log(`  Status: ${fail.status}`);
      if (fail.error) {
        console.log(`  Error: ${fail.error}`);
      }
    }

    // Group failed URLs by pattern
    console.log('\n📋 Failed URL Patterns:');
    const patterns = {};
    for (const fail of results.failed) {
      const match = fail.url.match(/\/([a-z]{2})?\/?(.+)$/);
      if (match) {
        const pattern = match[2] || '/';
        patterns[pattern] = patterns[pattern] || [];
        patterns[pattern].push(fail.url);
      }
    }

    for (const [pattern, urls] of Object.entries(patterns)) {
      console.log(`\n/${pattern}:`);
      urls.forEach(url => console.log(`  - ${url}`));
    }
  }

  // Exit with error code if there are failures
  process.exit(results.failed.length > 0 ? 1 : 0);
}

// Run the tests
testAllHreflangUrls().catch(console.error);
