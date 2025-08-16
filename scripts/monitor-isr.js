#!/usr/bin/env node

/**
 * Script to monitor ISR cache performance
 * Analyzes cache hit rates and regeneration patterns
 */

const isrMonitor = require('../lib/isr-monitor');
const path = require('path');
const fs = require('fs').promises;

async function runISRAnalysis() {
  console.log('🔍 ISR Cache Analysis');
  console.log('='.repeat(60));

  // Analyze cache directory
  console.log('\n📁 Cache Directory Analysis:');
  const cacheAnalysis = await isrMonitor.analyzeCacheDir();

  if (cacheAnalysis.error) {
    console.error('Error analyzing cache:', cacheAnalysis.error);
  } else {
    console.log(`Total Cache Size: ${cacheAnalysis.totalSizeFormatted}`);
    console.log(`Total Files: ${cacheAnalysis.fileCount}`);

    if (cacheAnalysis.oldestFile) {
      console.log(`Oldest File: ${new Date(cacheAnalysis.oldestFile.mtime).toISOString()}`);
    }

    if (cacheAnalysis.newestFile) {
      console.log(`Newest File: ${new Date(cacheAnalysis.newestFile.mtime).toISOString()}`);
    }

    // Show top 5 largest cached pages
    if (cacheAnalysis.pages && cacheAnalysis.pages.length > 0) {
      console.log('\n📊 Top 5 Largest Cached Pages:');
      cacheAnalysis.pages.slice(0, 5).forEach((page, i) => {
        console.log(
          `  ${i + 1}. ${page.path} - ${isrMonitor.formatSize(page.size)} (${page.age} old)`
        );
      });
    }
  }

  // Check specific page cache status
  const pagesToCheck = ['/', '/blog', '/road-signs/test', '/ru', '/ar'];

  console.log('\n📄 Page Cache Status:');
  console.log('-'.repeat(60));

  for (const pagePath of pagesToCheck) {
    const status = await isrMonitor.getCacheStatus(pagePath);

    if (status.exists) {
      const staleIndicator = status.isStale ? '⚠️ STALE' : '✅ FRESH';
      console.log(`${pagePath.padEnd(20)} ${staleIndicator} Age: ${status.ageFormatted}`);

      if (status.revalidate) {
        console.log(`${''.padEnd(20)} Revalidate: ${status.revalidate}s`);
      }
    } else {
      console.log(`${pagePath.padEnd(20)} ❌ NOT CACHED`);
    }
  }

  // Display current stats (if available from runtime)
  const stats = isrMonitor.getStats();

  if (stats.totalRequests > 0) {
    console.log('\n📈 Runtime Statistics:');
    console.log('-'.repeat(60));
    console.log(`Cache Hit Rate:  ${stats.hitRate}`);
    console.log(`Stale Rate:      ${stats.staleRate}`);
    console.log(`Total Requests:  ${stats.totalRequests}`);
    console.log(`Regenerations:   ${stats.regenerations}`);
    console.log(`Avg Regen Time:  ${stats.avgRegenerationTime}`);
    console.log(`Errors:          ${stats.errors}`);
  }

  // Export stats to file
  const reportPath = path.join(process.cwd(), 'isr-analysis-report.json');
  await isrMonitor.exportStats(reportPath);

  console.log('\n✅ Analysis complete!');
  console.log(`📄 Detailed report saved to: ${reportPath}`);
}

// Run the analysis
runISRAnalysis().catch(error => {
  console.error('Failed to run ISR analysis:', error);
  process.exit(1);
});
