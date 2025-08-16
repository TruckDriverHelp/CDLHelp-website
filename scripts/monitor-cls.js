#!/usr/bin/env node

/**
 * Script to monitor CLS (Cumulative Layout Shift) using Puppeteer
 * Measures CLS for both mobile and desktop viewports
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const TARGET_URL = process.env.URL || 'http://localhost:3000';
const OUTPUT_FILE = 'cls-monitoring-report.json';

async function measureCLS(page, viewport) {
  // Set viewport
  await page.setViewport(viewport);

  // Navigate to the page
  await page.goto(TARGET_URL, {
    waitUntil: 'networkidle0',
    timeout: 30000,
  });

  // Wait for any lazy-loaded content
  await page.waitForTimeout(3000);

  // Scroll to trigger any lazy loading
  await page.evaluate(() => {
    return new Promise(resolve => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 100);
    });
  });

  // Wait for layout to stabilize
  await page.waitForTimeout(2000);

  // Get CLS and other metrics
  const metrics = await page.evaluate(() => {
    return new Promise(resolve => {
      let cls = 0;
      const shifts = [];

      // Create observer for layout shifts
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            cls += entry.value;
            shifts.push({
              value: entry.value,
              startTime: entry.startTime,
              sources: entry.sources?.map(s => ({
                node: s.node?.tagName || 'unknown',
              })),
            });
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });

      // Get LCP
      let lcp = 0;
      new PerformanceObserver(list => {
        const entries = list.getEntries();
        lcp = entries[entries.length - 1]?.renderTime || entries[entries.length - 1]?.loadTime || 0;
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      // Get FID (if available)
      let fid = 0;
      new PerformanceObserver(list => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          fid = entries[0].processingStart - entries[0].startTime;
        }
      }).observe({ type: 'first-input', buffered: true });

      // Simulate user interaction to trigger FID
      setTimeout(() => {
        document.body.click();
      }, 1000);

      // Collect metrics after delay
      setTimeout(() => {
        resolve({
          cls: parseFloat(cls.toFixed(4)),
          lcp: lcp,
          fid: fid,
          shifts: shifts,
          shiftCount: shifts.length,
        });
      }, 3000);
    });
  });

  return metrics;
}

async function runCLSMonitoring() {
  console.log(`🔍 Monitoring CLS for ${TARGET_URL}...`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // Enable console logging
    page.on('console', msg => {
      if (msg.text().includes('CLS')) {
        console.log('Browser log:', msg.text());
      }
    });

    // Test mobile viewport
    console.log('\n📱 Testing Mobile...');
    const mobileMetrics = await measureCLS(page, {
      width: 375,
      height: 667,
      isMobile: true,
      hasTouch: true,
    });

    // Test desktop viewport
    console.log('\n💻 Testing Desktop...');
    const desktopMetrics = await measureCLS(page, {
      width: 1920,
      height: 1080,
      isMobile: false,
    });

    // Generate report
    const report = {
      url: TARGET_URL,
      timestamp: new Date().toISOString(),
      mobile: mobileMetrics,
      desktop: desktopMetrics,
      summary: {
        mobileCLS: mobileMetrics.cls,
        desktopCLS: desktopMetrics.cls,
        status: mobileMetrics.cls < 0.1 && desktopMetrics.cls < 0.1 ? 'PASS' : 'FAIL',
        recommendation:
          mobileMetrics.cls >= 0.1
            ? 'Mobile CLS needs improvement (target: <0.1)'
            : desktopMetrics.cls >= 0.1
              ? 'Desktop CLS needs improvement (target: <0.1)'
              : 'CLS is within acceptable range',
      },
    };

    // Save report
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));

    // Console output
    console.log('\n📊 CLS Monitoring Results:');
    console.log('─'.repeat(50));
    console.log(`Mobile CLS:  ${mobileMetrics.cls} ${mobileMetrics.cls < 0.1 ? '✅' : '❌'}`);
    console.log(`Desktop CLS: ${desktopMetrics.cls} ${desktopMetrics.cls < 0.1 ? '✅' : '❌'}`);
    console.log('─'.repeat(50));
    console.log(`Mobile Shifts:  ${mobileMetrics.shiftCount}`);
    console.log(`Desktop Shifts: ${desktopMetrics.shiftCount}`);
    console.log('─'.repeat(50));

    if (mobileMetrics.shifts.length > 0) {
      console.log('\n📱 Top Mobile Layout Shifts:');
      mobileMetrics.shifts
        .sort((a, b) => b.value - a.value)
        .slice(0, 3)
        .forEach((shift, i) => {
          console.log(
            `  ${i + 1}. Value: ${shift.value.toFixed(4)} - Time: ${shift.startTime.toFixed(0)}ms`
          );
        });
    }

    if (desktopMetrics.shifts.length > 0) {
      console.log('\n💻 Top Desktop Layout Shifts:');
      desktopMetrics.shifts
        .sort((a, b) => b.value - a.value)
        .slice(0, 3)
        .forEach((shift, i) => {
          console.log(
            `  ${i + 1}. Value: ${shift.value.toFixed(4)} - Time: ${shift.startTime.toFixed(0)}ms`
          );
        });
    }

    console.log(`\n📄 Full report saved to: ${OUTPUT_FILE}`);

    // Exit with appropriate code
    process.exit(report.summary.status === 'PASS' ? 0 : 1);
  } catch (error) {
    console.error('❌ Error during CLS monitoring:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run the monitoring
runCLSMonitoring().catch(error => {
  console.error('Failed to run CLS monitoring:', error);
  process.exit(1);
});
