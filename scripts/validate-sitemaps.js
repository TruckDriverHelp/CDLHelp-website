#!/usr/bin/env node

/**
 * Sitemap Validation Script for CDL Help
 * Validates all sitemaps for compliance with Google's requirements
 */

const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');
const Table = require('cli-table3');

const SITE_URL = process.env.BASE_URL || 'https://www.cdlhelp.com';
const LOCAL_URL = 'http://localhost:3000';

// Use local URL in development
const BASE_URL = process.env.NODE_ENV === 'production' ? SITE_URL : LOCAL_URL;

/**
 * Validate a single sitemap
 */
async function validateSitemap(url, depth = 0) {
  const indent = '  '.repeat(depth);

  try {
    console.log(`${indent}Validating: ${url}`);

    const response = await axios.get(url, {
      timeout: 30000,
      maxContentLength: 52428800, // 50MB
    });

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });

    const result = parser.parse(response.data);

    let urlCount = 0;
    let errors = [];
    let warnings = [];
    const stats = {
      sizeKB: response.data.length / 1024,
      contentType: response.headers['content-type'],
    };

    // Check content type
    if (!stats.contentType || !stats.contentType.includes('xml')) {
      warnings.push(`Incorrect content-type: ${stats.contentType}`);
    }

    // Check for sitemap index
    if (result.sitemapindex) {
      const sitemaps = Array.isArray(result.sitemapindex.sitemap)
        ? result.sitemapindex.sitemap
        : [result.sitemapindex.sitemap];

      const childResults = [];
      for (const sitemap of sitemaps) {
        if (sitemap && sitemap.loc) {
          const childUrl = sitemap.loc.startsWith('http')
            ? sitemap.loc
            : `${BASE_URL}${sitemap.loc}`;

          const childResult = await validateSitemap(childUrl, depth + 1);
          childResults.push(childResult);
          urlCount += childResult.urlCount;
          errors = errors.concat(childResult.errors);
          warnings = warnings.concat(childResult.warnings);
        }
      }

      stats.childSitemaps = childResults.length;
    }

    // Check for URL set
    if (result.urlset) {
      const urls = result.urlset.url;
      const urlArray = Array.isArray(urls) ? urls : urls ? [urls] : [];
      urlCount = urlArray.length;

      // Validate URL count
      if (urlCount > 50000) {
        errors.push(`Exceeds 50,000 URL limit: ${urlCount} URLs`);
      } else if (urlCount > 45000) {
        warnings.push(`Approaching 50,000 URL limit: ${urlCount} URLs`);
      }

      // Check file size (50MB limit)
      if (stats.sizeKB > 51200) {
        errors.push(`Exceeds 50MB limit: ${(stats.sizeKB / 1024).toFixed(2)}MB`);
      } else if (stats.sizeKB > 40960) {
        warnings.push(`Approaching 50MB limit: ${(stats.sizeKB / 1024).toFixed(2)}MB`);
      }

      // Sample validation of URLs (check first 5 and random 5)
      const samplesToCheck = [];
      if (urlArray.length > 0) {
        // First 5
        samplesToCheck.push(...urlArray.slice(0, Math.min(5, urlArray.length)));

        // Random 5
        if (urlArray.length > 10) {
          for (let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * urlArray.length);
            samplesToCheck.push(urlArray[randomIndex]);
          }
        }
      }

      // Check for required fields and validate URLs
      for (const urlEntry of samplesToCheck) {
        if (!urlEntry.loc) {
          errors.push('URL entry missing required <loc> element');
          continue;
        }

        // Validate URL format
        try {
          new URL(urlEntry.loc);
        } catch (e) {
          errors.push(`Invalid URL format: ${urlEntry.loc}`);
        }

        // Check lastmod format if present
        if (urlEntry.lastmod) {
          const dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2}|Z)?)?$/;
          if (!dateRegex.test(urlEntry.lastmod)) {
            warnings.push(`Invalid lastmod format: ${urlEntry.lastmod}`);
          }
        }

        // Check priority range if present
        if (urlEntry.priority !== undefined) {
          const priority = parseFloat(urlEntry.priority);
          if (isNaN(priority) || priority < 0 || priority > 1) {
            warnings.push(`Invalid priority value: ${urlEntry.priority} (must be 0.0-1.0)`);
          }
        }

        // Check changefreq if present
        if (urlEntry.changefreq) {
          const validFreqs = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
          if (!validFreqs.includes(urlEntry.changefreq)) {
            warnings.push(`Invalid changefreq: ${urlEntry.changefreq}`);
          }
        }
      }

      // Check for special sitemap types
      if (response.data.includes('xmlns:image=')) {
        stats.type = 'image';
        console.log(`${indent}  Type: Image sitemap`);
      } else if (response.data.includes('xmlns:video=')) {
        stats.type = 'video';
        console.log(`${indent}  Type: Video sitemap`);
      } else if (response.data.includes('xmlns:news=')) {
        stats.type = 'news';
        console.log(`${indent}  Type: News sitemap`);
      } else {
        stats.type = 'standard';
      }
    }

    return {
      url,
      urlCount,
      errors,
      warnings,
      stats,
      valid: errors.length === 0,
    };
  } catch (error) {
    return {
      url,
      urlCount: 0,
      errors: [`Failed to fetch: ${error.message}`],
      warnings: [],
      stats: {},
      valid: false,
    };
  }
}

/**
 * Test sample URLs from sitemap
 */
async function testSampleUrls(sitemapUrl, count = 3) {
  try {
    const response = await axios.get(sitemapUrl);
    const parser = new XMLParser();
    const result = parser.parse(response.data);

    if (!result.urlset || !result.urlset.url) {
      return { tested: 0, failed: [] };
    }

    const urls = Array.isArray(result.urlset.url) ? result.urlset.url : [result.urlset.url];
    const samplesToTest = urls.slice(0, count).map(u => u.loc);
    const failed = [];

    for (const url of samplesToTest) {
      try {
        await axios.head(url, { timeout: 5000 });
      } catch (e) {
        failed.push(url);
      }
    }

    return { tested: samplesToTest.length, failed };
  } catch (error) {
    return { tested: 0, failed: [], error: error.message };
  }
}

/**
 * Main validation function
 */
async function validateAllSitemaps() {
  console.log('📋 CDL Help Sitemap Validation\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  // Start with sitemap index
  const indexUrl = `${BASE_URL}/api/sitemap-index.xml`;
  const result = await validateSitemap(indexUrl);

  // Create summary table
  const table = new Table({
    head: ['Metric', 'Value', 'Status'],
    colWidths: [25, 30, 15],
  });

  table.push(
    ['Total URLs', result.urlCount.toString(), result.urlCount > 45000 ? '⚠️ Warning' : '✅ OK'],
    [
      'Total Size',
      `${(result.stats.sizeKB / 1024).toFixed(2)} MB`,
      result.stats.sizeKB > 40960 ? '⚠️ Warning' : '✅ OK',
    ],
    [
      'Total Errors',
      result.errors.length.toString(),
      result.errors.length > 0 ? '❌ Failed' : '✅ OK',
    ],
    [
      'Total Warnings',
      result.warnings.length.toString(),
      result.warnings.length > 0 ? '⚠️ Warning' : '✅ OK',
    ]
  );

  console.log('\n📊 Validation Summary:\n');
  console.log(table.toString());

  // Show errors if any
  if (result.errors.length > 0) {
    console.log('\n❌ Errors found:\n');
    result.errors.forEach((err, i) => {
      console.log(`  ${i + 1}. ${err}`);
    });
  }

  // Show warnings if any
  if (result.warnings.length > 0) {
    console.log('\n⚠️  Warnings:\n');
    result.warnings.forEach((warn, i) => {
      console.log(`  ${i + 1}. ${warn}`);
    });
  }

  // Test sample URLs
  console.log('\n🔍 Testing sample URLs...\n');
  const sitemaps = [
    '/api/sitemap.xml',
    '/api/sitemap-images.xml',
    '/api/sitemap-videos.xml',
    '/api/sitemap-news.xml',
  ];

  for (const sitemap of sitemaps) {
    const testResult = await testSampleUrls(`${BASE_URL}${sitemap}`);
    if (testResult.tested > 0) {
      console.log(`  ${sitemap}: Tested ${testResult.tested} URLs`);
      if (testResult.failed.length > 0) {
        console.log(`    ❌ Failed URLs:`);
        testResult.failed.forEach(url => console.log(`      - ${url}`));
      } else {
        console.log(`    ✅ All tested URLs are accessible`);
      }
    }
  }

  // Recommendations
  if (result.errors.length > 0 || result.warnings.length > 0) {
    console.log('\n💡 Recommendations:\n');

    if (result.urlCount > 45000) {
      console.log('  • Consider splitting sitemaps further to stay under 45,000 URLs');
    }

    if (result.stats.sizeKB > 40960) {
      console.log('  • Consider compressing or splitting large sitemaps');
    }

    if (result.errors.some(e => e.includes('Invalid URL'))) {
      console.log('  • Fix invalid URL formats in sitemaps');
    }

    if (result.warnings.some(w => w.includes('lastmod'))) {
      console.log('  • Ensure lastmod dates follow W3C datetime format');
    }
  } else {
    console.log('\n✨ All sitemaps are valid and compliant!');
  }

  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    summary: {
      totalUrls: result.urlCount,
      totalSizeKB: result.stats.sizeKB,
      errors: result.errors.length,
      warnings: result.warnings.length,
      valid: result.valid,
    },
    details: result,
  };

  require('fs').writeFileSync('sitemap-validation-report.json', JSON.stringify(report, null, 2));

  console.log('\n📄 Detailed report saved to sitemap-validation-report.json');

  // Exit with error code if validation failed
  if (!result.valid) {
    process.exit(1);
  }
}

// Run validation
if (require.main === module) {
  validateAllSitemaps().catch(error => {
    console.error('\n❌ Validation failed:', error.message);
    process.exit(1);
  });
}

module.exports = { validateSitemap, testSampleUrls };
