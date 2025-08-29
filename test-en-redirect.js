#!/usr/bin/env node

/**
 * Test script to verify that /en/* URLs will redirect properly
 * Run this after deploying to verify the fix is working
 */

const https = require('https');
const { URL } = require('url');

const urlsToTest = [
  'http://localhost:3001/en/frequently-asked-questions',
  'http://localhost:3001/en/how-to-become-a-truck-driver',
  'http://localhost:3001/en/how-to-use-cdl-help',
  'http://localhost:3001/en/schools/california',
  'http://localhost:3001/en/pre-trip-inspection/tractor-front/1',
];

async function testRedirect(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname,
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RedirectTest/1.0)',
      },
    };

    https
      .request(options, res => {
        const result = {
          url,
          statusCode: res.statusCode,
          location: res.headers.location,
          success: false,
        };

        if (res.statusCode === 301 || res.statusCode === 302) {
          const expectedLocation = url.replace('/en/', '/');
          result.success =
            res.headers.location === expectedLocation.replace('https://www.cdlhelp.com', '');
          result.expectedLocation = expectedLocation;
        }

        resolve(result);
      })
      .on('error', reject)
      .end();
  });
}

async function runTests() {
  console.log('Testing /en/* URL redirects...\n');

  for (const url of urlsToTest) {
    try {
      const result = await testRedirect(url);
      const status = result.success ? '✓' : '✗';
      console.log(`${status} ${url}`);
      console.log(`  Status: ${result.statusCode}`);
      if (result.location) {
        console.log(`  Location: ${result.location}`);
      }
      if (!result.success && result.expectedLocation) {
        console.log(`  Expected: ${result.expectedLocation}`);
      }
      console.log('');
    } catch (error) {
      console.log(`✗ ${url}`);
      console.log(`  Error: ${error.message}\n`);
    }
  }
}

console.log('Note: This test should be run AFTER deploying the fixes.\n');
console.log('Expected behavior:');
console.log('- All /en/* URLs should return 301 status code');
console.log('- Location header should point to URL without /en/ prefix\n');

runTests();
