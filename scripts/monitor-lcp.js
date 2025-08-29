const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const urls = [
  'https://www.cdlhelp.com',
  'http://localhost:3001/download',
  'http://localhost:3001/schools',
  'http://localhost:3001/ru',
  'http://localhost:3001/uk',
  'http://localhost:3001/ar',
];

/**
 * Measure LCP for a given URL
 * @param {string} url - The URL to test
 * @param {string} device - 'mobile' or 'desktop'
 * @returns {Promise<{url: string, device: string, lcp: number, fcp: number, cls: number}>}
 */
async function measureLCP(url, device = 'mobile') {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // Emulate device
    if (device === 'mobile') {
      await page.emulate({
        viewport: { width: 360, height: 640 },
        userAgent:
          'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
        isMobile: true,
        hasTouch: true,
      });
    } else {
      await page.setViewport({ width: 1920, height: 1080 });
    }

    // Set up performance observers
    await page.evaluateOnNewDocument(() => {
      window.performanceMetrics = {
        lcp: 0,
        fcp: 0,
        cls: 0,
        entries: [],
      };

      // LCP Observer
      new PerformanceObserver(entryList => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        window.performanceMetrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
        window.performanceMetrics.entries.push({
          type: 'lcp',
          time: window.performanceMetrics.lcp,
          element: lastEntry.element?.tagName || 'unknown',
        });
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      // FCP Observer
      new PerformanceObserver(entryList => {
        const entries = entryList.getEntries();
        for (const entry of entries) {
          if (entry.name === 'first-contentful-paint') {
            window.performanceMetrics.fcp = entry.startTime;
            window.performanceMetrics.entries.push({
              type: 'fcp',
              time: entry.startTime,
            });
          }
        }
      }).observe({ type: 'paint', buffered: true });

      // CLS Observer
      let clsValue = 0;
      new PerformanceObserver(entryList => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            window.performanceMetrics.cls = clsValue;
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });

    // Navigate to page
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    // Wait a bit more for any late renders
    await page.waitForTimeout(2000);

    // Get metrics
    const metrics = await page.evaluate(() => window.performanceMetrics);

    return {
      url,
      device,
      lcp: Math.round(metrics.lcp),
      fcp: Math.round(metrics.fcp),
      cls: Math.round(metrics.cls * 1000) / 1000,
      lcpElement: metrics.entries.find(e => e.type === 'lcp')?.element,
    };
  } finally {
    await browser.close();
  }
}

/**
 * Monitor all pages and generate report
 */
async function monitorAllPages() {
  console.log('🔍 Starting LCP Monitoring...');
  console.log('='.repeat(60));

  const results = [];
  const timestamp = new Date().toISOString();

  // Test both mobile and desktop for key pages
  for (const url of urls) {
    // Mobile test
    console.log(`\nTesting ${url} (mobile)...`);
    try {
      const mobileResult = await measureLCP(url, 'mobile');
      results.push(mobileResult);

      const lcpStatus = mobileResult.lcp < 2500 ? '✅' : mobileResult.lcp < 4000 ? '⚠️' : '❌';
      console.log(`  LCP: ${mobileResult.lcp}ms ${lcpStatus}`);
      console.log(`  FCP: ${mobileResult.fcp}ms`);
      console.log(`  CLS: ${mobileResult.cls}`);
      if (mobileResult.lcpElement) {
        console.log(`  LCP Element: ${mobileResult.lcpElement}`);
      }
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
      results.push({ url, device: 'mobile', error: error.message });
    }

    // Desktop test for homepage only
    if (url === 'https://www.cdlhelp.com') {
      console.log(`\nTesting ${url} (desktop)...`);
      try {
        const desktopResult = await measureLCP(url, 'desktop');
        results.push(desktopResult);

        const lcpStatus = desktopResult.lcp < 2500 ? '✅' : desktopResult.lcp < 4000 ? '⚠️' : '❌';
        console.log(`  LCP: ${desktopResult.lcp}ms ${lcpStatus}`);
        console.log(`  FCP: ${desktopResult.fcp}ms`);
        console.log(`  CLS: ${desktopResult.cls}`);
      } catch (error) {
        console.error(`  ❌ Error: ${error.message}`);
        results.push({ url, device: 'desktop', error: error.message });
      }
    }
  }

  // Generate summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));

  const mobileResults = results.filter(r => r.device === 'mobile' && !r.error);
  const failingMobile = mobileResults.filter(r => r.lcp > 2500);
  const warningMobile = mobileResults.filter(r => r.lcp > 2500 && r.lcp <= 4000);
  const passingMobile = mobileResults.filter(r => r.lcp <= 2500);

  console.log(`\nMobile Results:`);
  console.log(`  ✅ Good (< 2.5s): ${passingMobile.length} pages`);
  console.log(`  ⚠️  Needs Improvement (2.5-4s): ${warningMobile.length} pages`);
  console.log(`  ❌ Poor (> 4s): ${failingMobile.length - warningMobile.length} pages`);

  if (mobileResults.length > 0) {
    const avgLCP = Math.round(
      mobileResults.reduce((sum, r) => sum + r.lcp, 0) / mobileResults.length
    );
    const avgFCP = Math.round(
      mobileResults.reduce((sum, r) => sum + r.fcp, 0) / mobileResults.length
    );
    const avgCLS =
      Math.round((mobileResults.reduce((sum, r) => sum + r.cls, 0) / mobileResults.length) * 1000) /
      1000;

    console.log(`\nAverage Mobile Metrics:`);
    console.log(`  LCP: ${avgLCP}ms`);
    console.log(`  FCP: ${avgFCP}ms`);
    console.log(`  CLS: ${avgCLS}`);
  }

  // Save detailed report
  const report = {
    timestamp,
    summary: {
      totalPages: urls.length,
      mobilePassingLCP: passingMobile.length,
      mobileFailingLCP: failingMobile.length,
      averageMobileLCP:
        mobileResults.length > 0
          ? Math.round(mobileResults.reduce((sum, r) => sum + r.lcp, 0) / mobileResults.length)
          : null,
    },
    results,
  };

  const reportPath = path.join(__dirname, '..', 'lcp-monitoring-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📊 Detailed report saved to: lcp-monitoring-report.json`);

  // Exit with error if any mobile page exceeds 2.5s threshold
  if (failingMobile.length > 0) {
    console.error(`\n❌ ${failingMobile.length} mobile pages exceed 2.5s LCP threshold`);
    failingMobile.forEach(page => {
      console.error(`   - ${page.url}: ${page.lcp}ms`);
    });
    process.exit(1);
  } else {
    console.log(`\n✅ All mobile pages meet LCP threshold!`);
    process.exit(0);
  }
}

// Check if puppeteer is installed
try {
  require.resolve('puppeteer');
} catch (e) {
  console.error('❌ Puppeteer is not installed. Please run: npm install --save-dev puppeteer');
  process.exit(1);
}

// Run monitoring
if (require.main === module) {
  monitorAllPages().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { measureLCP, monitorAllPages };
