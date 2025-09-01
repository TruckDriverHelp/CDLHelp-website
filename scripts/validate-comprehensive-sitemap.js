#!/usr/bin/env node

/**
 * Comprehensive Sitemap Validator
 * Validates all aspects of the sitemap against 2025 best practices
 */

const axios = require('axios');
const { parseString } = require('xml2js');
const fs = require('fs');
const path = require('path');

class ComprehensiveSitemapValidator {
  constructor(baseUrl) {
    this.baseUrl = baseUrl || 'https://www.cdlhelp.com';
    this.errors = [];
    this.warnings = [];
    this.info = [];
    this.stats = {};
  }

  /**
   * Validate a sitemap from URL or file
   */
  async validate(source) {
    console.log('🔍 Starting comprehensive sitemap validation...\n');

    let xml;

    // Load XML content
    if (source.startsWith('http')) {
      xml = await this.fetchSitemap(source);
    } else {
      xml = fs.readFileSync(source, 'utf8');
    }

    // Run all validations
    await this.validateXmlStructure(xml);
    await this.validateSizeAndLimits(xml);
    await this.validateUrls(xml);
    await this.validateHreflang(xml);
    await this.validateDates(xml);
    await this.validatePriorities(xml);
    await this.validateChangefreq(xml);

    // Generate report
    return this.generateReport();
  }

  /**
   * Fetch sitemap from URL
   */
  async fetchSitemap(url) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'CDLHelp-Sitemap-Validator/1.0',
        },
      });
      return response.data;
    } catch (error) {
      this.errors.push(`Failed to fetch sitemap: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validate XML structure
   */
  async validateXmlStructure(xml) {
    console.log('📋 Validating XML structure...');

    // Check XML declaration
    if (!xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
      this.errors.push('Missing or incorrect XML declaration');
    }

    // Check namespaces
    if (!xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
      this.errors.push('Missing sitemap namespace');
    }

    if (xml.includes('hreflang') && !xml.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"')) {
      this.warnings.push('Using hreflang but missing xhtml namespace');
    }

    // Parse XML to check structure
    return new Promise(resolve => {
      parseString(xml, (err, result) => {
        if (err) {
          this.errors.push(`Invalid XML structure: ${err.message}`);
        } else {
          this.info.push('✅ Valid XML structure');

          // Check for required elements
          if (result.urlset) {
            const urls = result.urlset.url || [];
            this.stats.urlCount = urls.length;

            // Check each URL has required loc element
            urls.forEach((url, index) => {
              if (!url.loc || !url.loc[0]) {
                this.errors.push(`URL at index ${index} missing <loc> element`);
              }
            });
          } else if (result.sitemapindex) {
            this.stats.type = 'index';
            this.stats.sitemapCount = (result.sitemapindex.sitemap || []).length;
          }
        }
        resolve();
      });
    });
  }

  /**
   * Validate size and limits
   */
  async validateSizeAndLimits(xml) {
    console.log('📏 Validating size and limits...');

    const sizeInBytes = Buffer.byteLength(xml, 'utf8');
    const sizeInMB = sizeInBytes / (1024 * 1024);

    this.stats.sizeInMB = sizeInMB.toFixed(2);

    // Check file size limit (50MB)
    if (sizeInMB > 50) {
      this.errors.push(`Sitemap exceeds 50MB limit: ${sizeInMB.toFixed(2)}MB`);
    } else if (sizeInMB > 10) {
      this.warnings.push(
        `Large sitemap (${sizeInMB.toFixed(2)}MB). Consider splitting for better performance.`
      );
    } else {
      this.info.push(`✅ File size OK: ${sizeInMB.toFixed(2)}MB`);
    }

    // Check URL count limit (50,000)
    const urlCount = (xml.match(/<url>/g) || []).length;

    if (urlCount > 50000) {
      this.errors.push(`Exceeds 50,000 URL limit: ${urlCount} URLs`);
    } else if (urlCount > 40000) {
      this.warnings.push(`Approaching URL limit: ${urlCount} URLs (max: 50,000)`);
    } else {
      this.info.push(`✅ URL count OK: ${urlCount} URLs`);
    }
  }

  /**
   * Validate URLs
   */
  async validateUrls(xml) {
    console.log('🔗 Validating URLs...');

    const urlMatches = xml.match(/<loc>([^<]+)<\/loc>/g) || [];
    const urls = urlMatches.map(match => match.replace(/<\/?loc>/g, ''));

    const urlIssues = [];

    urls.forEach((url, index) => {
      // Check for absolute URLs
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        urlIssues.push(`URL ${index + 1}: Not absolute - ${url}`);
      }

      // Check URL length
      if (url.length > 2048) {
        urlIssues.push(
          `URL ${index + 1}: Exceeds 2048 character limit - ${url.substring(0, 50)}...`
        );
      }

      // Check for proper encoding
      try {
        new URL(url);
      } catch (e) {
        urlIssues.push(`URL ${index + 1}: Malformed - ${url}`);
      }

      // Check for special characters that should be encoded
      if (url.match(/[<>"{}|\\^`\s]/)) {
        this.warnings.push(`URL ${index + 1} contains unencoded special characters: ${url}`);
      }
    });

    if (urlIssues.length > 0) {
      urlIssues.forEach(issue => this.errors.push(issue));
    } else {
      this.info.push(`✅ All ${urls.length} URLs are valid`);
    }

    // Sample URL accessibility check (first 5 URLs)
    console.log('🌐 Checking URL accessibility (sample)...');
    const sampleSize = Math.min(5, urls.length);
    const sample = urls.slice(0, sampleSize);

    for (const url of sample) {
      try {
        const response = await axios.head(url, {
          timeout: 5000,
          validateStatus: () => true,
        });

        if (response.status === 200) {
          this.info.push(`✅ ${url} - OK`);
        } else if (response.status === 301 || response.status === 302) {
          this.warnings.push(`URL redirects (${response.status}): ${url}`);
        } else if (response.status === 404) {
          this.errors.push(`URL not found (404): ${url}`);
        } else {
          this.warnings.push(`URL returns ${response.status}: ${url}`);
        }
      } catch (error) {
        this.warnings.push(`Could not check URL: ${url} - ${error.message}`);
      }
    }
  }

  /**
   * Validate hreflang implementation
   */
  async validateHreflang(xml) {
    console.log('🌍 Validating hreflang implementation...');

    const hreflangMatches = xml.match(/<xhtml:link[^>]*>/g) || [];

    if (hreflangMatches.length === 0) {
      this.info.push('ℹ️ No hreflang annotations found');
      return;
    }

    const hreflangData = {};
    const validHreflangCodes = [
      'en',
      'en-US',
      'en-GB',
      'en-CA',
      'en-AU',
      'es',
      'es-ES',
      'es-MX',
      'es-AR',
      'ru',
      'ru-RU',
      'uk',
      'uk-UA',
      'ar',
      'ar-SA',
      'ar-AE',
      'ko',
      'ko-KR',
      'zh',
      'zh-CN',
      'zh-TW',
      'zh-HK',
      'tr',
      'tr-TR',
      'pt',
      'pt-BR',
      'pt-PT',
      'x-default',
    ];

    // Parse hreflang data
    hreflangMatches.forEach(match => {
      const hreflangMatch = match.match(/hreflang="([^"]+)"/);
      const hrefMatch = match.match(/href="([^"]+)"/);

      if (hreflangMatch && hrefMatch) {
        const hreflang = hreflangMatch[1];
        const href = hrefMatch[1];

        // Validate hreflang code
        if (!validHreflangCodes.includes(hreflang) && !hreflang.match(/^[a-z]{2}(-[A-Z]{2})?$/)) {
          this.errors.push(`Invalid hreflang code: ${hreflang}`);
        }

        // Store for reciprocal checking
        if (!hreflangData[href]) {
          hreflangData[href] = [];
        }
        hreflangData[href].push(hreflang);
      }
    });

    // Check for x-default
    const hasXDefault = Object.values(hreflangData).some(codes => codes.includes('x-default'));
    if (!hasXDefault) {
      this.warnings.push('Missing x-default hreflang annotation');
    }

    // Check for reciprocal links (simplified check)
    const urlCount = Object.keys(hreflangData).length;
    const expectedAnnotations = urlCount > 0 ? Object.values(hreflangData)[0].length : 0;

    Object.entries(hreflangData).forEach(([url, codes]) => {
      if (codes.length !== expectedAnnotations) {
        this.warnings.push(
          `Inconsistent hreflang annotations for ${url}: has ${codes.length}, expected ${expectedAnnotations}`
        );
      }
    });

    this.info.push(`✅ Found ${hreflangMatches.length} hreflang annotations`);
    this.stats.hreflangCount = hreflangMatches.length;
  }

  /**
   * Validate dates
   */
  async validateDates(xml) {
    console.log('📅 Validating dates...');

    const dateMatches = xml.match(/<lastmod>([^<]+)<\/lastmod>/g) || [];
    const dates = dateMatches.map(match => match.replace(/<\/?lastmod>/g, ''));

    if (dates.length === 0) {
      this.warnings.push('No lastmod dates found. Consider adding for better crawl efficiency.');
      return;
    }

    const invalidDates = [];
    const futureDates = [];
    const now = new Date();

    dates.forEach((dateStr, index) => {
      // Check format (W3C Datetime)
      if (!dateStr.match(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2}|Z)?)?$/)) {
        invalidDates.push(`Invalid date format at position ${index + 1}: ${dateStr}`);
      }

      // Check if date is in the future
      const date = new Date(dateStr);
      if (date > now) {
        futureDates.push(`Future date at position ${index + 1}: ${dateStr}`);
      }
    });

    if (invalidDates.length > 0) {
      invalidDates.forEach(issue => this.errors.push(issue));
    }

    if (futureDates.length > 0) {
      futureDates.forEach(issue => this.warnings.push(issue));
    }

    if (invalidDates.length === 0 && futureDates.length === 0) {
      this.info.push(`✅ All ${dates.length} dates are valid`);
    }
  }

  /**
   * Validate priorities
   */
  async validatePriorities(xml) {
    console.log('🎯 Validating priorities...');

    const priorityMatches = xml.match(/<priority>([^<]+)<\/priority>/g) || [];

    if (priorityMatches.length === 0) {
      this.info.push('ℹ️ No priority values found (using default 0.5)');
      return;
    }

    const priorities = priorityMatches.map(match =>
      parseFloat(match.replace(/<\/?priority>/g, ''))
    );
    const invalidPriorities = [];

    priorities.forEach((priority, index) => {
      if (isNaN(priority) || priority < 0 || priority > 1) {
        invalidPriorities.push(`Invalid priority at position ${index + 1}: ${priority}`);
      }
    });

    if (invalidPriorities.length > 0) {
      invalidPriorities.forEach(issue => this.errors.push(issue));
    } else {
      const avgPriority = (priorities.reduce((a, b) => a + b, 0) / priorities.length).toFixed(2);
      this.info.push(`✅ All ${priorities.length} priorities valid (avg: ${avgPriority})`);
    }
  }

  /**
   * Validate changefreq values
   */
  async validateChangefreq(xml) {
    console.log('🔄 Validating changefreq values...');

    const changefreqMatches = xml.match(/<changefreq>([^<]+)<\/changefreq>/g) || [];

    if (changefreqMatches.length === 0) {
      this.info.push('ℹ️ No changefreq values found');
      return;
    }

    const validValues = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
    const changefreqs = changefreqMatches.map(match => match.replace(/<\/?changefreq>/g, ''));
    const invalidChangefreqs = [];

    changefreqs.forEach((freq, index) => {
      if (!validValues.includes(freq)) {
        invalidChangefreqs.push(`Invalid changefreq at position ${index + 1}: ${freq}`);
      }
    });

    if (invalidChangefreqs.length > 0) {
      invalidChangefreqs.forEach(issue => this.errors.push(issue));
    } else {
      this.info.push(`✅ All ${changefreqs.length} changefreq values are valid`);
    }
  }

  /**
   * Generate validation report
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      url: this.baseUrl,
      stats: this.stats,
      errors: this.errors,
      warnings: this.warnings,
      info: this.info,
      summary: {
        hasErrors: this.errors.length > 0,
        errorCount: this.errors.length,
        warningCount: this.warnings.length,
        infoCount: this.info.length,
        isValid: this.errors.length === 0,
      },
    };

    // Print report to console
    console.log('\n' + '='.repeat(60));
    console.log('📊 SITEMAP VALIDATION REPORT');
    console.log('='.repeat(60));

    console.log('\n📈 Statistics:');
    Object.entries(this.stats).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });

    if (this.errors.length > 0) {
      console.log('\n❌ Errors (' + this.errors.length + '):');
      this.errors.forEach(error => console.log(`  • ${error}`));
    }

    if (this.warnings.length > 0) {
      console.log('\n⚠️ Warnings (' + this.warnings.length + '):');
      this.warnings.forEach(warning => console.log(`  • ${warning}`));
    }

    if (this.info.length > 0) {
      console.log('\nℹ️ Information:');
      this.info.forEach(info => console.log(`  • ${info}`));
    }

    console.log('\n' + '='.repeat(60));

    if (report.summary.isValid) {
      console.log('✅ SITEMAP IS VALID');
    } else {
      console.log('❌ SITEMAP HAS ERRORS - Please fix the issues above');
    }

    console.log('='.repeat(60) + '\n');

    // Save report to file
    const reportPath = path.join(__dirname, '..', `sitemap-validation-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Full report saved to: ${reportPath}`);

    return report;
  }
}

// Run validation
async function main() {
  const args = process.argv.slice(2);
  const source = args[0] || 'https://www.cdlhelp.com/api/sitemap-comprehensive.xml';

  console.log(`🚀 Validating sitemap: ${source}\n`);

  const validator = new ComprehensiveSitemapValidator('https://www.cdlhelp.com');

  try {
    const report = await validator.validate(source);
    process.exit(report.summary.isValid ? 0 : 1);
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = ComprehensiveSitemapValidator;
