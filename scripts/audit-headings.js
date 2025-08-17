#!/usr/bin/env node

/**
 * Heading Hierarchy Audit Script
 * Validates heading structure across all pages for SEO and accessibility
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const Table = require('cli-table3');

/**
 * Audit heading hierarchy for a single page
 */
async function auditPageHeadings(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'CDLHelp Heading Auditor',
      },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);

    const headings = [];
    const issues = [];

    // Extract all headings with their context
    $('h1, h2, h3, h4, h5, h6').each((index, elem) => {
      const tag = elem.name;
      const level = parseInt(tag.substring(1));
      const text = $(elem).text().trim();
      const id = $(elem).attr('id');
      const className = $(elem).attr('class');

      // Get parent context for better reporting
      const parent = $(elem).parent();
      const parentTag = parent.prop('tagName');
      const isInArticle = $(elem).closest('article').length > 0;
      const isInSection = $(elem).closest('section').length > 0;

      headings.push({
        level,
        text,
        id,
        index,
        className,
        parentTag: parentTag ? parentTag.toLowerCase() : null,
        isInArticle,
        isInSection,
      });
    });

    // Check for H1 issues
    const h1s = headings.filter(h => h.level === 1);
    if (h1s.length === 0) {
      issues.push({
        type: 'error',
        message: '❌ No H1 tag found - every page must have exactly one H1',
        seoImpact: 'high',
      });
    } else if (h1s.length > 1) {
      issues.push({
        type: 'error',
        message: `❌ Multiple H1 tags found (${h1s.length})`,
        details: h1s.map(
          h => `   - "${h.text.substring(0, 60)}${h.text.length > 60 ? '...' : ''}"`
        ),
        seoImpact: 'high',
      });
    } else {
      // Check H1 quality
      const h1 = h1s[0];
      if (h1.text.length > 60) {
        issues.push({
          type: 'warning',
          message: `⚠️  H1 too long (${h1.text.length} chars) - should be under 60`,
          seoImpact: 'low',
        });
      }
      if (h1.text.length < 20) {
        issues.push({
          type: 'warning',
          message: `⚠️  H1 too short (${h1.text.length} chars) - may lack context`,
          seoImpact: 'medium',
        });
      }
    }

    // Check hierarchy sequence
    let prevLevel = 0;
    const skippedLevels = [];

    headings.forEach(h => {
      // Check for skipped levels
      if (h.level > prevLevel + 1 && prevLevel > 0) {
        skippedLevels.push({
          from: prevLevel,
          to: h.level,
          text: h.text.substring(0, 50),
        });
      }
      prevLevel = h.level;
    });

    if (skippedLevels.length > 0) {
      issues.push({
        type: 'warning',
        message: `⚠️  Skipped heading levels found (${skippedLevels.length} instances)`,
        details: skippedLevels.map(s => `   - H${s.from} → H${s.to}: "${s.text}..."`),
        seoImpact: 'medium',
      });
    }

    // Check for empty headings
    const emptyHeadings = headings.filter(h => !h.text || h.text.length === 0);
    if (emptyHeadings.length > 0) {
      issues.push({
        type: 'error',
        message: `❌ Empty heading tags found (${emptyHeadings.length})`,
        details: emptyHeadings.map(h => `   - Empty H${h.level} at position ${h.index + 1}`),
        seoImpact: 'high',
      });
    }

    // Check for missing IDs on important headings (for anchor links)
    const h2h3WithoutIds = headings.filter(h => (h.level === 2 || h.level === 3) && !h.id);

    if (h2h3WithoutIds.length > 0) {
      issues.push({
        type: 'info',
        message: `ℹ️  ${h2h3WithoutIds.length} H2/H3 headings without IDs (no anchor links)`,
        seoImpact: 'low',
      });
    }

    // Check for all caps headings
    const allCapsHeadings = headings.filter(
      h => h.text === h.text.toUpperCase() && h.text.length > 3
    );

    if (allCapsHeadings.length > 0) {
      issues.push({
        type: 'warning',
        message: `⚠️  ${allCapsHeadings.length} headings in ALL CAPS (use CSS for styling)`,
        seoImpact: 'low',
      });
    }

    // Calculate score
    let score = 100;
    issues.forEach(issue => {
      if (issue.type === 'error') {
        score -= issue.seoImpact === 'high' ? 20 : 10;
      } else if (issue.type === 'warning') {
        score -= issue.seoImpact === 'high' ? 10 : issue.seoImpact === 'medium' ? 5 : 2;
      }
    });

    return {
      url,
      headingCount: headings.length,
      h1Count: h1s.length,
      h2Count: headings.filter(h => h.level === 2).length,
      h3Count: headings.filter(h => h.level === 3).length,
      deepestLevel: headings.length > 0 ? Math.max(...headings.map(h => h.level)) : 0,
      issues,
      score: Math.max(0, score),
      hierarchy: headings.map(h => {
        const indent = '  '.repeat(h.level - 1);
        const text = h.text.substring(0, 50) + (h.text.length > 50 ? '...' : '');
        const idStr = h.id ? ` [#${h.id}]` : '';
        return `${indent}H${h.level}: ${text}${idStr}`;
      }),
    };
  } catch (error) {
    return {
      url,
      error: error.message,
      score: 0,
    };
  }
}

/**
 * Audit all pages
 */
async function auditAllPages() {
  const baseUrl = process.argv[2] || 'http://localhost:3000';

  console.log('\n📋 CDL Help Heading Hierarchy Audit\n');
  console.log(`Base URL: ${baseUrl}\n`);

  const pages = [
    '',
    '/download',
    '/schools',
    '/companies',
    '/contact',
    '/road-signs/test',
    '/faq',
    '/blog',
    '/cdl-texas',
    '/ru',
  ];

  const results = [];

  console.log('Auditing pages...\n');

  // Audit each page
  for (const page of pages) {
    const url = `${baseUrl}${page}`;

    const result = await auditPageHeadings(url);
    results.push(result);

    if (result.error) {
      console.log(`✗ ${page || '/'} - Error: ${result.error}`);
    } else if (result.issues.filter(i => i.type === 'error').length > 0) {
      const errorCount = result.issues.filter(i => i.type === 'error').length;
      console.log(`✗ ${page || '/'} - ${errorCount} errors (Score: ${result.score})`);
    } else if (result.issues.length > 0) {
      console.log(`⚠ ${page || '/'} - ${result.issues.length} issues (Score: ${result.score})`);
    } else {
      console.log(`✓ ${page || '/'} - Valid (Score: ${result.score})`);
    }
  }

  // Summary table
  console.log('\n📊 Audit Summary\n');

  const table = new Table({
    head: ['Page', 'Score', 'H1', 'H2', 'H3', 'Total', 'Issues'],
    colWidths: [20, 8, 6, 6, 6, 8, 10],
  });

  results.forEach(result => {
    if (!result.error) {
      const page = result.url.replace(baseUrl, '') || '/';
      table.push([
        page,
        result.score.toString(),
        result.h1Count.toString(),
        result.h2Count.toString(),
        result.h3Count.toString(),
        result.headingCount,
        result.issues.length > 0
          ? result.issues.filter(i => i.type === 'error').length +
            '/' +
            result.issues.filter(i => i.type === 'warning').length
          : '0',
      ]);
    }
  });

  console.log(table.toString());

  // Detailed issues report
  const pagesWithIssues = results.filter(r => r.issues && r.issues.length > 0);

  if (pagesWithIssues.length > 0) {
    console.log('\n⚠️  Issues Found:\n');

    pagesWithIssues.forEach(result => {
      const page = result.url.replace(baseUrl, '') || '/';
      console.log(`\n${page}:`);

      const errors = result.issues.filter(i => i.type === 'error');
      const warnings = result.issues.filter(i => i.type === 'warning');
      const info = result.issues.filter(i => i.type === 'info');

      if (errors.length > 0) {
        errors.forEach(issue => {
          console.log(`  ${issue.message}`);
          if (issue.details) {
            issue.details.forEach(detail => console.log(detail));
          }
        });
      }

      if (warnings.length > 0) {
        warnings.forEach(issue => {
          console.log(`  ${issue.message}`);
          if (issue.details) {
            issue.details.forEach(detail => console.log(detail));
          }
        });
      }

      if (info.length > 0) {
        info.forEach(issue => {
          console.log(`  ${issue.message}`);
        });
      }
    });
  }

  // Example hierarchy for worst performing page
  const worstPage = results.filter(r => !r.error).sort((a, b) => a.score - b.score)[0];

  if (worstPage && worstPage.hierarchy && worstPage.hierarchy.length > 0) {
    const page = worstPage.url.replace(baseUrl, '') || '/';
    console.log(`\n📝 Example Hierarchy (${page}):\n`);
    console.log('First 10 headings:');
    worstPage.hierarchy.slice(0, 10).forEach(h => console.log(h));
    if (worstPage.hierarchy.length > 10) {
      console.log(`... and ${worstPage.hierarchy.length - 10} more`);
    }
  }

  // Overall statistics
  const totalErrors = results.reduce(
    (sum, r) => sum + (r.issues ? r.issues.filter(i => i.type === 'error').length : 0),
    0
  );
  const totalWarnings = results.reduce(
    (sum, r) => sum + (r.issues ? r.issues.filter(i => i.type === 'warning').length : 0),
    0
  );
  const averageScore = Math.round(
    results.filter(r => !r.error).reduce((sum, r) => sum + r.score, 0) /
      results.filter(r => !r.error).length
  );
  const pagesWithoutH1 = results.filter(r => r.h1Count === 0).length;
  const pagesWithMultipleH1 = results.filter(r => r.h1Count > 1).length;

  console.log('\n📈 Overall Statistics:\n');
  console.log(`  Total Pages Audited: ${results.length}`);
  console.log(`  Average Score: ${averageScore}%`);
  console.log(`  Total Errors: ${totalErrors}`);
  console.log(`  Total Warnings: ${totalWarnings}`);
  console.log(`  Pages without H1: ${pagesWithoutH1}`);
  console.log(`  Pages with multiple H1s: ${pagesWithMultipleH1}`);

  // Recommendations
  if (totalErrors > 0 || totalWarnings > 0) {
    console.log('\n💡 Recommendations:\n');

    if (pagesWithoutH1 > 0) {
      console.log('  • Add exactly one H1 tag to pages missing them');
    }
    if (pagesWithMultipleH1 > 0) {
      console.log('  • Remove duplicate H1 tags (only one H1 per page)');
    }

    const hasSkippedLevels = results.some(
      r => r.issues && r.issues.some(i => i.message.includes('Skipped'))
    );
    if (hasSkippedLevels) {
      console.log('  • Fix skipped heading levels for proper hierarchy');
    }

    const hasMissingIds = results.some(
      r => r.issues && r.issues.some(i => i.message.includes('without IDs'))
    );
    if (hasMissingIds) {
      console.log('  • Add IDs to H2/H3 headings for anchor link support');
    }
  } else {
    console.log('\n✨ All pages have valid heading hierarchies!');
  }

  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    baseUrl,
    summary: {
      totalPages: results.length,
      averageScore,
      totalErrors,
      totalWarnings,
      pagesWithoutH1,
      pagesWithMultipleH1,
    },
    results: results.map(r => ({
      ...r,
      hierarchy: r.hierarchy ? r.hierarchy.slice(0, 20) : [],
    })),
  };

  fs.writeFileSync('heading-audit-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Detailed report saved to heading-audit-report.json');

  // Exit with error code if there are critical issues
  if (totalErrors > 0) {
    process.exit(1);
  }
}

// Run audit
if (require.main === module) {
  auditAllPages().catch(error => {
    console.error('\n❌ Audit failed:', error.message);
    process.exit(1);
  });
}

module.exports = { auditPageHeadings, auditAllPages };
