#!/usr/bin/env node

/**
 * Generate Sitemap Script
 * Creates the comprehensive sitemap XML file for CDL Help
 */

const fs = require('fs');
const path = require('path');
const ComprehensiveSitemapGenerator = require('../lib/sitemap/comprehensive-generator');

async function generateSitemap() {
  console.log('🚀 Generating comprehensive sitemap for CDL Help...\n');

  try {
    // Initialize the generator
    const generator = new ComprehensiveSitemapGenerator({
      baseUrl: 'https://www.cdlhelp.com',
      locales: ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'],
      defaultLocale: 'en',
      maxUrlsPerSitemap: 45000,
    });

    // Generate the comprehensive sitemap
    console.log('📝 Creating sitemap with all pages and languages...');
    const sitemap = generator.generateCompleteSitemap();

    // Validate the generated sitemap
    console.log('✔️ Validating sitemap...');
    const validation = generator.validateSitemap(sitemap);

    // Display validation results
    console.log('\n📊 Validation Results:');
    console.log(`  - URL Count: ${validation.stats.urlCount}`);
    console.log(`  - File Size: ${validation.stats.sizeInMB} MB`);
    console.log(`  - Valid: ${validation.valid ? '✅ Yes' : '❌ No'}`);

    if (validation.errors && validation.errors.length > 0) {
      console.log('\n❌ Errors:');
      validation.errors.forEach(error => console.log(`  - ${error}`));
    }

    if (validation.warnings && validation.warnings.length > 0) {
      console.log('\n⚠️ Warnings:');
      validation.warnings.forEach(warning => console.log(`  - ${warning}`));
    }

    // Save the sitemap to public directory
    const outputPath = path.join(__dirname, '..', 'public', 'sitemap-comprehensive.xml');
    fs.writeFileSync(outputPath, sitemap, 'utf8');
    console.log(`\n✅ Sitemap saved to: ${outputPath}`);

    // Also save a pretty-printed version for review
    const prettyPath = path.join(__dirname, '..', 'public', 'sitemap-comprehensive-pretty.xml');
    const prettySitemap = sitemap
      .replace(/></g, '>\n<')
      .replace(/(<[^\/][^>]*>)(<[^\/])/g, '$1\n$2');
    fs.writeFileSync(prettyPath, prettySitemap, 'utf8');
    console.log(`✅ Pretty version saved to: ${prettyPath}`);

    // Generate sitemap index
    console.log('\n📝 Generating sitemap index...');
    const sitemapIndex = generator.generateSitemapIndex();
    const indexPath = path.join(__dirname, '..', 'public', 'sitemap-index-new.xml');
    fs.writeFileSync(indexPath, sitemapIndex, 'utf8');
    console.log(`✅ Sitemap index saved to: ${indexPath}`);

    // Generate statistics report
    const stats = {
      generated: new Date().toISOString(),
      baseUrl: 'https://www.cdlhelp.com',
      locales: ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'],
      statistics: {
        totalUrls: validation.stats.urlCount,
        fileSize: `${validation.stats.sizeInMB} MB`,
        estimatedPages: Math.floor(validation.stats.urlCount / 8), // Divided by number of languages
        valid: validation.valid,
      },
      files: {
        sitemap: outputPath,
        sitemapPretty: prettyPath,
        sitemapIndex: indexPath,
      },
    };

    const statsPath = path.join(__dirname, '..', 'sitemap-generation-stats.json');
    fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), 'utf8');
    console.log(`\n📊 Statistics saved to: ${statsPath}`);

    console.log('\n🎉 Sitemap generation complete!');
    console.log('================================');
    console.log('Next steps:');
    console.log('1. Review the generated sitemap files');
    console.log('2. Test with the validation script');
    console.log('3. Deploy to production');
    console.log('4. Submit to Google Search Console and Bing Webmaster Tools');

    return stats;
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the generator
if (require.main === module) {
  generateSitemap();
}

module.exports = generateSitemap;
