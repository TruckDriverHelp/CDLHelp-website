#!/usr/bin/env node

/**
 * Validate all hreflang URLs across the site
 * Identifies non-200 responses and provides recommendations
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'https://www.cdlhelp.com';
const LOCALES = ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'];

// Known existing pages (based on actual site data)
const KNOWN_PAGES = {
  // Static pages that exist in all locales
  universal: [
    '/',
    '/contact',
    '/download',
    '/blog',
    '/companies',
    '/cdl-texas',
    '/schools',
    '/pre-trip-inspection',
    '/dot-physical-exam',
    '/road-signs',
  ],

  // School state pages that exist
  schoolStates: [
    'florida',
    'ohio',
    'illinois',
    'california',
    'texas',
    'new-york',
    'pennsylvania',
    'washington',
    'wisconsin',
  ],

  // School city pages that actually exist
  schoolCities: {
    florida: ['miami', 'orlando', 'jacksonville'],
    ohio: ['columbus', 'cincinnati', 'cleveland'],
    illinois: ['chicago', 'springfield', 'rockford'],
  },

  // Content pages with different slugs per locale
  localizedContent: {
    'what-is-taught-in-cdl-schools': {
      en: 'what-is-taught-in-cdl-schools',
      ru: 'o-cdl-shkolakh',
      uk: 'choho-navchayut-u-shkolakh-cdl',
      ar: 'ma-yatimmu-tadrisuh-fi-madaris-cdl',
      ko: 'cdl-haggyoeseoneun-mueos-eul-galeuchimniga',
      zh: 'guanyu-cdl-xuexiao',
      tr: 'cdl-okul',
      pt: 'sobre-as-escolas',
    },
    'how-to-use-cdl-help': {
      en: 'how-to-use-cdl-help',
      ru: 'kak-ispolzovat-cdlhelp',
      uk: 'yak-vykorystovuvaty-dodatok-cdl-help',
      ar: 'kayfiyat-astikhdam-tatbiq-cdl-musaeda',
      ko: 'cdl-help-aeb-sayongbeob',
      zh: 'ruhe-shiyong-cdl-bangzhu-yingyongchengxu',
      tr: 'cdl-yardim-nasil-kullanilir',
      pt: 'como-usar-o-cdl-help',
    },
    'how-to-become-a-truck-driver': {
      en: 'how-to-become-a-truck-driver',
      ru: 'kak-stat-dalnoboishikom',
      uk: 'yak-staty-dalekobiinykom-v-Amerytsi',
      ar: 'kayfa-tusbih-sayiq-shahinat-fi-alwilayat-almutahida',
      ko: 'migug-eseo-teureog-unjeonsa-ga-doeneun-bangbeob',
      zh: 'ruhe-chengwei-meiguo-kache-siji',
      tr: 'nasil-kamyon-soforu-olunur',
      pt: 'como-se-tornar-motorista-de-caminhaoo',
    },
    'how-to-get-cdl': {
      en: 'how-to-get-cdl',
      ru: 'kak-poluchit-cdl',
      uk: 'yak-otrymaty-cdl',
      ar: 'kayfa-tahsil-cdl',
      ko: 'cdl-eobtneun-bangbeob',
      zh: 'ruhe-huode-cdl',
      tr: 'cdl-nasil-alinir',
      pt: 'como-obter-cdl',
    },
    'frequently-asked-questions': {
      en: 'frequently-asked-questions',
      ru: 'chasto-zadavaemye-voprosy',
      uk: 'chasti-zapytannya',
      ar: 'alas-ila-alshaeia-musaedat-cdl',
      ko: 'jaju-mudneun-jilmun-cdl-doum',
      zh: 'changjian-wenti-cdl-bangzhu',
      tr: 'sikca-sorulan-sorular',
      pt: 'perguntas-frequentes',
    },
  },
};

// Test a single URL
function testUrl(url) {
  return new Promise(resolve => {
    https
      .get(url, { timeout: 5000 }, res => {
        resolve({
          url,
          status: res.statusCode,
          ok: res.statusCode === 200,
        });
      })
      .on('error', err => {
        resolve({
          url,
          status: 'ERROR',
          error: err.message,
          ok: false,
        });
      })
      .on('timeout', () => {
        resolve({
          url,
          status: 'TIMEOUT',
          ok: false,
        });
      });
  });
}

// Generate all URLs that should exist
function generateExpectedUrls() {
  const urls = [];

  // Universal pages
  KNOWN_PAGES.universal.forEach(page => {
    LOCALES.forEach(locale => {
      const url = locale === 'en' ? `${BASE_URL}${page}` : `${BASE_URL}/${locale}${page}`;
      urls.push({ url, type: 'universal', page, locale });
    });
  });

  // School state pages
  KNOWN_PAGES.schoolStates.forEach(state => {
    LOCALES.forEach(locale => {
      const url =
        locale === 'en' ? `${BASE_URL}/schools/${state}` : `${BASE_URL}/${locale}/schools/${state}`;
      urls.push({ url, type: 'school-state', state, locale });
    });
  });

  // School city pages
  Object.entries(KNOWN_PAGES.schoolCities).forEach(([state, cities]) => {
    cities.forEach(city => {
      LOCALES.forEach(locale => {
        const url =
          locale === 'en'
            ? `${BASE_URL}/schools/${state}/${city}`
            : `${BASE_URL}/${locale}/schools/${state}/${city}`;
        urls.push({ url, type: 'school-city', state, city, locale });
      });
    });
  });

  // Localized content pages
  Object.entries(KNOWN_PAGES.localizedContent).forEach(([key, slugs]) => {
    Object.entries(slugs).forEach(([locale, slug]) => {
      const url = locale === 'en' ? `${BASE_URL}/${slug}` : `${BASE_URL}/${locale}/${slug}`;
      urls.push({ url, type: 'localized-content', key, locale, slug });
    });
  });

  return urls;
}

// Main validation function
async function validateHreflangUrls() {
  console.log('🔍 Validating hreflang URLs...\n');

  const urls = generateExpectedUrls();
  const results = {
    total: urls.length,
    success: 0,
    failed: [],
    byType: {},
  };

  // Test URLs in batches to avoid overwhelming the server
  const batchSize = 10;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(urlInfo =>
        testUrl(urlInfo.url).then(result => ({
          ...urlInfo,
          ...result,
        }))
      )
    );

    batchResults.forEach(result => {
      if (result.ok) {
        results.success++;
        process.stdout.write('✅');
      } else {
        results.failed.push(result);
        process.stdout.write('❌');

        // Track failures by type
        if (!results.byType[result.type]) {
          results.byType[result.type] = [];
        }
        results.byType[result.type].push(result);
      }
    });

    // Progress indicator
    if ((i + batchSize) % 50 === 0) {
      console.log(` ${i + batchSize}/${urls.length}`);
    }
  }

  console.log('\n\n' + '='.repeat(60));
  console.log('📊 Validation Summary:');
  console.log(`Total URLs tested: ${results.total}`);
  console.log(`✅ Successful (200): ${results.success}`);
  console.log(`❌ Failed: ${results.failed.length}`);

  if (results.failed.length > 0) {
    console.log('\n❌ Failed URLs by Type:');
    console.log('-'.repeat(60));

    Object.entries(results.byType).forEach(([type, failures]) => {
      console.log(`\n${type.toUpperCase()} (${failures.length} failures):`);
      failures.slice(0, 10).forEach(fail => {
        console.log(`  ${fail.url}`);
        console.log(`    Status: ${fail.status}`);
      });
      if (failures.length > 10) {
        console.log(`  ... and ${failures.length - 10} more`);
      }
    });

    // Generate fix recommendations
    console.log('\n💡 Recommendations:');
    console.log('-'.repeat(60));

    if (results.byType['school-city']) {
      console.log('\n1. Non-existent city pages:');
      console.log('   Remove these cities from hreflang generation or create the pages');
      const cities = new Set();
      results.byType['school-city'].forEach(f => cities.add(`${f.state}/${f.city}`));
      cities.forEach(city => console.log(`   - ${city}`));
    }

    if (results.byType['localized-content']) {
      console.log('\n2. Missing localized content:');
      console.log('   These content pages need proper slug translations in Strapi');
      const missing = new Set();
      results.byType['localized-content'].forEach(f => missing.add(f.key));
      missing.forEach(key => console.log(`   - ${key}`));
    }

    // Export failed URLs to file
    const outputPath = path.join(__dirname, '..', 'hreflang-validation-report.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`\n📄 Full report saved to: ${outputPath}`);
  }

  process.exit(results.failed.length > 0 ? 1 : 0);
}

// Run validation
validateHreflangUrls().catch(console.error);
