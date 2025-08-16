const axios = require('axios');
const cheerio = require('cheerio');

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.cdlhelp.com';

// Expected hreflang locale codes (proper format)
const EXPECTED_HREFLANG_CODES = [
  'en-US',
  'ru-RU',
  'uk-UA',
  'ar-SA',
  'ko-KR',
  'zh-CN',
  'tr-TR',
  'pt-BR',
];

// URL paths use simple codes
const URL_LOCALE_PATHS = {
  'en-US': '', // English has no prefix
  'ru-RU': '/ru',
  'uk-UA': '/uk',
  'ar-SA': '/ar',
  'ko-KR': '/ko',
  'zh-CN': '/zh',
  'tr-TR': '/tr',
  'pt-BR': '/pt',
};

async function validatePageSEO(path) {
  const url = `${SITE_URL}${path}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEO Validator)',
      },
      timeout: 10000,
    });
    const $ = cheerio.load(response.data);

    const issues = [];
    const warnings = [];

    // 1. Check hreflang tags
    const hreflangTags = [];
    $('link[rel="alternate"][hreflang]').each((i, elem) => {
      hreflangTags.push({
        hreflang: $(elem).attr('hreflang'),
        href: $(elem).attr('href'),
      });
    });

    // Validate x-default
    const xDefault = hreflangTags.find(t => t.hreflang === 'x-default');
    if (!xDefault) {
      issues.push('❌ Missing x-default hreflang');
    } else if (!xDefault.href.endsWith('.com/') && !xDefault.href.match(/\.com\/[^/]+$/)) {
      warnings.push(`⚠️  x-default points to: ${xDefault.href}`);
    }

    // Validate all expected locales are present with proper codes
    const foundLocales = hreflangTags.map(t => t.hreflang).filter(h => h !== 'x-default');
    EXPECTED_HREFLANG_CODES.forEach(expectedLocale => {
      if (!foundLocales.includes(expectedLocale)) {
        issues.push(`❌ Missing hreflang for ${expectedLocale}`);
      }
    });

    // Check for incorrect locale formats
    hreflangTags.forEach(tag => {
      if (tag.hreflang !== 'x-default') {
        // Should be in format xx-YY
        if (!tag.hreflang.match(/^[a-z]{2}-[A-Z]{2}$/)) {
          issues.push(`❌ Incorrect hreflang format: ${tag.hreflang} (should be like en-US)`);
        }

        // URLs should NOT contain the full locale code
        if (
          tag.href.includes('/en-US/') ||
          tag.href.includes('/ru-RU/') ||
          tag.href.includes('/uk-UA/') ||
          tag.href.includes('/zh-CN/')
        ) {
          issues.push(`❌ URL contains full locale code: ${tag.href}`);
        }
      }
    });

    // 2. Check for H1 tag
    const h1 = $('h1');
    if (h1.length === 0) {
      issues.push('❌ Missing H1 tag');
    } else if (h1.length > 1) {
      issues.push(`❌ Multiple H1 tags (${h1.length})`);
    } else {
      const h1Text = h1.text().trim();
      if (!h1Text) {
        issues.push('❌ H1 tag is empty');
      } else if (h1Text.length > 60) {
        warnings.push(
          `⚠️  H1 might be too long (${h1Text.length} chars): "${h1Text.substring(0, 50)}..."`
        );
      }
    }

    // 3. Check canonical URL
    const canonical = $('link[rel="canonical"]').attr('href');
    if (!canonical) {
      issues.push('❌ Missing canonical URL');
    } else if (!canonical.startsWith('http')) {
      issues.push('❌ Canonical URL must be absolute');
    }

    // 4. Check meta description
    const metaDesc = $('meta[name="description"]').attr('content');
    if (!metaDesc) {
      issues.push('❌ Missing meta description');
    } else if (metaDesc.length < 120) {
      warnings.push(`⚠️  Meta description too short (${metaDesc.length} chars, recommend 150-160)`);
    } else if (metaDesc.length > 160) {
      warnings.push(`⚠️  Meta description too long (${metaDesc.length} chars, max 160)`);
    }

    // 5. Check title tag
    const title = $('title').text();
    if (!title) {
      issues.push('❌ Missing title tag');
    } else if (title.length > 60) {
      warnings.push(`⚠️  Title too long (${title.length} chars, max 60)`);
    }

    // 6. Check Open Graph tags
    const ogTitle = $('meta[property="og:title"]').attr('content');
    const ogDesc = $('meta[property="og:description"]').attr('content');
    const ogImage = $('meta[property="og:image"]').attr('content');
    const ogLocale = $('meta[property="og:locale"]').attr('content');

    if (!ogTitle) issues.push('❌ Missing og:title');
    if (!ogDesc) issues.push('❌ Missing og:description');
    if (!ogImage) issues.push('❌ Missing og:image');
    if (!ogLocale) {
      issues.push('❌ Missing og:locale');
    } else if (!ogLocale.match(/^[a-z]{2}_[A-Z]{2}$/) && !ogLocale.match(/^[a-z]{2}-[A-Z]{2}$/)) {
      warnings.push(`⚠️  og:locale format might be incorrect: ${ogLocale}`);
    }

    return {
      url,
      issues,
      warnings,
      stats: {
        hreflangCount: hreflangTags.length,
        hasXDefault: !!xDefault,
        h1Count: h1.length,
        titleLength: title ? title.length : 0,
        descLength: metaDesc ? metaDesc.length : 0,
      },
    };
  } catch (error) {
    return {
      url,
      error: error.message,
      issues: [`❌ Failed to fetch page: ${error.message}`],
      warnings: [],
    };
  }
}

async function validateAll() {
  console.log('🔍 SEO Validation Report');
  console.log('='.repeat(60));
  console.log(`Validating: ${SITE_URL}`);
  console.log('='.repeat(60));

  // Test key pages
  const paths = [
    '/', // Homepage English
    '/download', // English subpage
    '/schools', // English subpage
    '/ru', // Russian homepage
    '/ru/download', // Russian subpage
    '/uk', // Ukrainian homepage
    '/ar', // Arabic homepage
  ];

  let totalIssues = 0;
  let totalWarnings = 0;
  const results = [];

  for (const path of paths) {
    process.stdout.write(`\nChecking ${path}...`);
    const result = await validatePageSEO(path);
    results.push(result);

    totalIssues += result.issues.length;
    totalWarnings += result.warnings.length;

    if (result.issues.length === 0 && result.warnings.length === 0) {
      console.log(' ✅ PASS');
      if (result.stats) {
        console.log(
          `  📊 ${result.stats.hreflangCount} hreflang tags, H1: ${result.stats.h1Count}, Title: ${result.stats.titleLength} chars`
        );
      }
    } else {
      console.log(' ⚠️  ISSUES FOUND');

      if (result.issues.length > 0) {
        console.log('  Critical Issues:');
        result.issues.forEach(issue => console.log(`    ${issue}`));
      }

      if (result.warnings.length > 0) {
        console.log('  Warnings:');
        result.warnings.forEach(warning => console.log(`    ${warning}`));
      }
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Pages checked: ${results.length}`);
  console.log(`Total critical issues: ${totalIssues}`);
  console.log(`Total warnings: ${totalWarnings}`);

  if (totalIssues > 0) {
    console.log('\n❌ SEO validation FAILED - Critical issues must be fixed');
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log('\n⚠️  SEO validation passed with warnings');
    process.exit(0);
  } else {
    console.log('\n✅ SEO validation PASSED - All checks passed!');
    process.exit(0);
  }
}

// Run validation
if (require.main === module) {
  validateAll().catch(error => {
    console.error('Fatal error during validation:', error);
    process.exit(1);
  });
}

module.exports = { validatePageSEO, validateAll };
