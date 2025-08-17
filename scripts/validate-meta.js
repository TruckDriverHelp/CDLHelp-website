#!/usr/bin/env node

/**
 * Meta Tag Validation Script
 * Validates meta tags across all pages for SEO optimization
 */

const axios = require('axios');
const cheerio = require('cheerio');
const chalk = require('chalk');
const Table = require('cli-table3');

// Meta tag length limits
const LIMITS = {
  title: { min: 30, max: 60, optimal: 50 },
  description: { min: 120, max: 160, optimal: 155 },
};

/**
 * Validate meta tags for a single page
 */
async function validatePageMeta(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'CDLHelp Meta Validator',
      },
    });
    const $ = cheerio.load(response.data);

    // Extract meta information
    const title = $('title').text();
    const description = $('meta[name="description"]').attr('content') || '';
    const keywords = $('meta[name="keywords"]').attr('content') || '';
    const ogTitle = $('meta[property="og:title"]').attr('content') || '';
    const ogDescription = $('meta[property="og:description"]').attr('content') || '';
    const ogImage = $('meta[property="og:image"]').attr('content') || '';
    const twitterTitle = $('meta[name="twitter:title"]').attr('content') || '';
    const twitterDescription = $('meta[name="twitter:description"]').attr('content') || '';
    const twitterImage = $('meta[name="twitter:image"]').attr('content') || '';
    const canonical = $('link[rel="canonical"]').attr('href') || '';

    const issues = [];
    const warnings = [];
    const successes = [];

    // Validate title
    if (!title) {
      issues.push('Missing title tag');
    } else {
      if (title.length > LIMITS.title.max) {
        issues.push(`Title too long: ${title.length} chars (max: ${LIMITS.title.max})`);
      } else if (title.length < LIMITS.title.min) {
        issues.push(`Title too short: ${title.length} chars (min: ${LIMITS.title.min})`);
      } else if (title.length > LIMITS.title.optimal) {
        warnings.push(`Title near limit: ${title.length} chars (optimal: ${LIMITS.title.optimal})`);
      } else {
        successes.push(`Title length optimal: ${title.length} chars`);
      }
    }

    // Validate description
    if (!description) {
      issues.push('Missing meta description');
    } else {
      if (description.length > LIMITS.description.max) {
        issues.push(
          `Description too long: ${description.length} chars (max: ${LIMITS.description.max})`
        );
      } else if (description.length < LIMITS.description.min) {
        issues.push(
          `Description too short: ${description.length} chars (min: ${LIMITS.description.min})`
        );
      } else {
        successes.push(`Description length optimal: ${description.length} chars`);
      }
    }

    // Check Open Graph tags
    if (!ogTitle) warnings.push('Missing Open Graph title');
    if (!ogDescription) warnings.push('Missing Open Graph description');
    if (!ogImage) issues.push('Missing Open Graph image');
    else successes.push('Open Graph image present');

    // Check Twitter Card tags
    if (!twitterTitle) warnings.push('Missing Twitter Card title');
    if (!twitterDescription) warnings.push('Missing Twitter Card description');
    if (!twitterImage) warnings.push('Missing Twitter Card image');

    // Check canonical
    if (!canonical) {
      warnings.push('Missing canonical URL');
    } else {
      successes.push('Canonical URL present');
    }

    // Check for duplicate meta tags
    const metaTags = {};
    $('meta').each((i, elem) => {
      const name = $(elem).attr('name') || $(elem).attr('property');
      if (name) {
        metaTags[name] = (metaTags[name] || 0) + 1;
      }
    });

    Object.entries(metaTags).forEach(([name, count]) => {
      if (count > 1) {
        issues.push(`Duplicate meta tag: ${name} (${count} times)`);
      }
    });

    // Check hreflang tags
    const hreflangTags = $('link[rel="alternate"][hreflang]');
    if (hreflangTags.length > 0) {
      successes.push(`${hreflangTags.length} hreflang tags found`);
    } else {
      warnings.push('No hreflang tags found');
    }

    return {
      url,
      title: {
        text: title ? title.substring(0, 50) + (title.length > 50 ? '...' : '') : '',
        length: title?.length || 0,
      },
      description: {
        text: description
          ? description.substring(0, 50) + (description.length > 50 ? '...' : '')
          : '',
        length: description?.length || 0,
      },
      hasOGImage: !!ogImage,
      hasCanonical: !!canonical,
      hreflangCount: hreflangTags.length,
      issues,
      warnings,
      successes,
      score: calculateScore(issues, warnings, successes),
    };
  } catch (error) {
    return {
      url,
      error: error.message,
      issues: [`Failed to fetch: ${error.message}`],
      warnings: [],
      successes: [],
      score: 0,
    };
  }
}

/**
 * Calculate SEO score based on issues
 */
function calculateScore(issues, warnings, successes) {
  const baseScore = 100;
  const issueWeight = 15;
  const warningWeight = 5;

  let score = baseScore - issues.length * issueWeight - warnings.length * warningWeight;
  return Math.max(0, Math.min(100, score));
}

/**
 * Validate all pages
 */
async function validateAllPages() {
  const baseUrl = process.argv[2] || 'http://localhost:3000';

  console.log(chalk.bold.blue('\n📋 CDL Help Meta Tag Validator\n'));
  console.log(chalk.gray(`Base URL: ${baseUrl}\n`));

  const pages = [
    '',
    '/download',
    '/schools',
    '/companies',
    '/contact',
    '/road-signs/test',
    '/blog',
    '/ru',
    '/ar',
    '/zh',
  ];

  const results = [];

  // Create progress indicator
  console.log(chalk.yellow('Validating pages...\n'));

  for (const page of pages) {
    const url = `${baseUrl}${page}`;
    process.stdout.write(chalk.gray(`Checking ${url}...`));

    const result = await validatePageMeta(url);
    results.push(result);

    // Clear line and show result
    process.stdout.clearLine();
    process.stdout.cursorTo(0);

    if (result.error) {
      console.log(chalk.red(`✗ ${url} - Error`));
    } else if (result.issues.length > 0) {
      console.log(chalk.red(`✗ ${url} - ${result.issues.length} issues`));
    } else if (result.warnings.length > 0) {
      console.log(chalk.yellow(`⚠ ${url} - ${result.warnings.length} warnings`));
    } else {
      console.log(chalk.green(`✓ ${url} - Valid`));
    }
  }

  // Summary table
  console.log(chalk.bold.blue('\n📊 Validation Summary\n'));

  const table = new Table({
    head: [
      chalk.white('Page'),
      chalk.white('Score'),
      chalk.white('Title'),
      chalk.white('Desc'),
      chalk.white('OG'),
      chalk.white('Issues'),
    ],
    colWidths: [25, 8, 8, 8, 6, 8],
  });

  results.forEach(result => {
    if (!result.error) {
      table.push([
        result.url.replace(baseUrl, '') || '/',
        result.score >= 80
          ? chalk.green(result.score)
          : result.score >= 60
            ? chalk.yellow(result.score)
            : chalk.red(result.score),
        result.title.length > 0
          ? result.title.length >= LIMITS.title.min && result.title.length <= LIMITS.title.max
            ? chalk.green(result.title.length)
            : chalk.red(result.title.length)
          : chalk.red('0'),
        result.description.length > 0
          ? result.description.length >= LIMITS.description.min &&
            result.description.length <= LIMITS.description.max
            ? chalk.green(result.description.length)
            : chalk.red(result.description.length)
          : chalk.red('0'),
        result.hasOGImage ? chalk.green('✓') : chalk.red('✗'),
        result.issues.length > 0 ? chalk.red(result.issues.length) : chalk.green('0'),
      ]);
    }
  });

  console.log(table.toString());

  // Detailed issues report
  const pagesWithIssues = results.filter(r => r.issues.length > 0 || r.warnings.length > 0);

  if (pagesWithIssues.length > 0) {
    console.log(chalk.bold.yellow('\n⚠️  Issues Found:\n'));

    pagesWithIssues.forEach(result => {
      console.log(chalk.bold(`\n${result.url}:`));

      if (result.issues.length > 0) {
        console.log(chalk.red('  Critical Issues:'));
        result.issues.forEach(issue => {
          console.log(chalk.red(`    • ${issue}`));
        });
      }

      if (result.warnings.length > 0) {
        console.log(chalk.yellow('  Warnings:'));
        result.warnings.forEach(warning => {
          console.log(chalk.yellow(`    • ${warning}`));
        });
      }
    });
  }

  // Overall statistics
  const totalIssues = results.reduce((sum, r) => sum + (r.issues?.length || 0), 0);
  const totalWarnings = results.reduce((sum, r) => sum + (r.warnings?.length || 0), 0);
  const averageScore = Math.round(
    results.reduce((sum, r) => sum + (r.score || 0), 0) / results.length
  );

  console.log(chalk.bold.blue('\n📈 Overall Statistics:\n'));
  console.log(`  Total Pages Checked: ${results.length}`);
  console.log(
    `  Critical Issues: ${totalIssues > 0 ? chalk.red(totalIssues) : chalk.green(totalIssues)}`
  );
  console.log(
    `  Warnings: ${totalWarnings > 0 ? chalk.yellow(totalWarnings) : chalk.green(totalWarnings)}`
  );
  console.log(
    `  Average Score: ${
      averageScore >= 80
        ? chalk.green(averageScore + '%')
        : averageScore >= 60
          ? chalk.yellow(averageScore + '%')
          : chalk.red(averageScore + '%')
    }`
  );

  // Recommendations
  if (totalIssues > 0 || totalWarnings > 0) {
    console.log(chalk.bold.blue('\n💡 Recommendations:\n'));

    const recommendations = new Set();

    results.forEach(r => {
      r.issues?.forEach(issue => {
        if (issue.includes('Missing Open Graph image')) {
          recommendations.add('Add Open Graph images to all pages for better social sharing');
        }
        if (issue.includes('too short')) {
          recommendations.add('Expand short meta descriptions to include more keywords and CTAs');
        }
        if (issue.includes('too long')) {
          recommendations.add(
            'Shorten long titles and descriptions to prevent truncation in SERPs'
          );
        }
      });

      r.warnings?.forEach(warning => {
        if (warning.includes('hreflang')) {
          recommendations.add('Add hreflang tags for international SEO');
        }
        if (warning.includes('canonical')) {
          recommendations.add('Add canonical URLs to prevent duplicate content issues');
        }
      });
    });

    [...recommendations].forEach(rec => {
      console.log(chalk.cyan(`  • ${rec}`));
    });
  } else {
    console.log(chalk.bold.green('\n✨ All pages have valid meta tags!'));
  }

  // Exit with error if critical issues found
  if (totalIssues > 0) {
    process.exit(1);
  }
}

// Check if chalk is installed
try {
  require.resolve('chalk');
  require.resolve('cli-table3');
} catch (e) {
  console.log('Installing required dependencies...');
  require('child_process').execSync('npm install chalk cli-table3', { stdio: 'inherit' });
}

// Run validation
if (require.main === module) {
  validateAllPages().catch(error => {
    console.error(chalk.red('\n❌ Validation failed:'), error.message);
    process.exit(1);
  });
}

module.exports = { validatePageMeta, validateAllPages };
