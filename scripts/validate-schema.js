#!/usr/bin/env node

/**
 * Script to validate Schema.org structured data implementation
 * Uses Google's Rich Results Test API to validate schema markup
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.URL || 'http://localhost:3000';
const OUTPUT_FILE = 'schema-validation-report.json';

// Pages to validate
const PAGES_TO_VALIDATE = [
  { path: '/', expectedTypes: ['Course', 'FAQPage', 'Organization', 'WebSite'] },
  { path: '/road-signs/test', expectedTypes: ['Quiz'] },
  { path: '/ru', expectedTypes: ['Course', 'FAQPage'] },
  { path: '/ar', expectedTypes: ['Course', 'FAQPage'] },
];

async function extractSchemaFromPage(page, url) {
  await page.goto(url, {
    waitUntil: 'networkidle0',
    timeout: 30000,
  });

  // Extract all JSON-LD scripts
  const schemas = await page.evaluate(() => {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    const schemas = [];

    scripts.forEach(script => {
      try {
        const data = JSON.parse(script.textContent);
        schemas.push(data);
      } catch (e) {
        console.error('Failed to parse schema:', e);
      }
    });

    return schemas;
  });

  return schemas;
}

function validateSchema(schema) {
  const errors = [];
  const warnings = [];

  // Basic validation rules
  if (!schema['@context']) {
    errors.push('Missing @context');
  }

  if (!schema['@type']) {
    errors.push('Missing @type');
  }

  // Type-specific validation
  switch (schema['@type']) {
    case 'Course':
      if (!schema.name) errors.push('Course: Missing name');
      if (!schema.description) errors.push('Course: Missing description');
      if (!schema.provider) errors.push('Course: Missing provider');
      if (!schema.offers) warnings.push('Course: Missing offers (recommended)');
      if (!schema.aggregateRating) warnings.push('Course: Missing aggregateRating (recommended)');
      if (!schema.hasCourseInstance)
        warnings.push('Course: Missing hasCourseInstance (recommended)');
      break;

    case 'Quiz':
      if (!schema.name) errors.push('Quiz: Missing name');
      if (!schema.description) errors.push('Quiz: Missing description');
      if (!schema.numberOfQuestions) warnings.push('Quiz: Missing numberOfQuestions');
      if (!schema.educationalLevel) warnings.push('Quiz: Missing educationalLevel');
      if (!schema.provider) errors.push('Quiz: Missing provider');
      break;

    case 'FAQPage':
      if (!schema.mainEntity || !Array.isArray(schema.mainEntity)) {
        errors.push('FAQPage: Missing or invalid mainEntity');
      } else {
        schema.mainEntity.forEach((item, index) => {
          if (!item.name) errors.push(`FAQPage: Question ${index + 1} missing name`);
          if (!item.acceptedAnswer)
            errors.push(`FAQPage: Question ${index + 1} missing acceptedAnswer`);
          if (item.acceptedAnswer && !item.acceptedAnswer.text) {
            errors.push(`FAQPage: Question ${index + 1} answer missing text`);
          }
        });
      }
      break;

    case 'Organization':
      if (!schema.name) errors.push('Organization: Missing name');
      if (!schema.url) errors.push('Organization: Missing url');
      if (!schema.logo) warnings.push('Organization: Missing logo (recommended)');
      if (!schema.sameAs || !Array.isArray(schema.sameAs)) {
        warnings.push('Organization: Missing sameAs links (recommended)');
      }
      break;

    case 'WebSite':
      if (!schema.name) errors.push('WebSite: Missing name');
      if (!schema.url) errors.push('WebSite: Missing url');
      if (!schema.potentialAction) warnings.push('WebSite: Missing SearchAction (recommended)');
      break;
  }

  // Check for required properties in nested objects
  if (schema.provider) {
    if (!schema.provider.name) errors.push(`${schema['@type']}: Provider missing name`);
    if (!schema.provider['@type']) errors.push(`${schema['@type']}: Provider missing @type`);
  }

  if (schema.offers) {
    if (schema.offers.price === undefined) errors.push(`${schema['@type']}: Offer missing price`);
    if (!schema.offers.priceCurrency)
      errors.push(`${schema['@type']}: Offer missing priceCurrency`);
  }

  if (schema.aggregateRating) {
    if (!schema.aggregateRating.ratingValue)
      errors.push(`${schema['@type']}: Rating missing ratingValue`);
    if (!schema.aggregateRating.reviewCount && !schema.aggregateRating.ratingCount) {
      warnings.push(`${schema['@type']}: Rating missing reviewCount or ratingCount`);
    }
  }

  return { errors, warnings };
}

async function runSchemaValidation() {
  console.log(`🔍 Validating Schema.org structured data for ${BASE_URL}...`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const results = {
    url: BASE_URL,
    timestamp: new Date().toISOString(),
    pages: [],
    summary: {
      totalPages: 0,
      passedPages: 0,
      failedPages: 0,
      totalSchemas: 0,
      totalErrors: 0,
      totalWarnings: 0,
    },
  };

  try {
    const page = await browser.newPage();

    for (const pageConfig of PAGES_TO_VALIDATE) {
      const url = `${BASE_URL}${pageConfig.path}`;
      console.log(`\n📄 Validating: ${url}`);

      try {
        const schemas = await extractSchemaFromPage(page, url);
        const pageResult = {
          path: pageConfig.path,
          url: url,
          expectedTypes: pageConfig.expectedTypes,
          foundTypes: [],
          schemas: [],
          errors: [],
          warnings: [],
          status: 'PASS',
        };

        // Validate each schema
        schemas.forEach(schema => {
          const schemaType = schema['@type'];
          pageResult.foundTypes.push(schemaType);

          const validation = validateSchema(schema);
          const schemaResult = {
            type: schemaType,
            errors: validation.errors,
            warnings: validation.warnings,
            valid: validation.errors.length === 0,
          };

          pageResult.schemas.push(schemaResult);
          pageResult.errors.push(...validation.errors);
          pageResult.warnings.push(...validation.warnings);

          // Log immediate feedback
          if (validation.errors.length > 0) {
            console.log(`  ❌ ${schemaType}: ${validation.errors.length} errors`);
            validation.errors.forEach(error => console.log(`     - ${error}`));
          } else {
            console.log(`  ✅ ${schemaType}: Valid`);
          }

          if (validation.warnings.length > 0) {
            console.log(`  ⚠️  ${schemaType}: ${validation.warnings.length} warnings`);
          }
        });

        // Check if expected types are present
        const missingTypes = pageConfig.expectedTypes.filter(
          type => !pageResult.foundTypes.includes(type)
        );

        if (missingTypes.length > 0) {
          pageResult.errors.push(`Missing expected schema types: ${missingTypes.join(', ')}`);
          pageResult.status = 'FAIL';
          console.log(`  ❌ Missing schemas: ${missingTypes.join(', ')}`);
        }

        if (pageResult.errors.length > 0) {
          pageResult.status = 'FAIL';
        }

        results.pages.push(pageResult);
        results.summary.totalSchemas += schemas.length;
        results.summary.totalErrors += pageResult.errors.length;
        results.summary.totalWarnings += pageResult.warnings.length;

        if (pageResult.status === 'PASS') {
          results.summary.passedPages++;
        } else {
          results.summary.failedPages++;
        }
      } catch (error) {
        console.error(`  ❌ Error validating ${url}:`, error.message);
        results.pages.push({
          path: pageConfig.path,
          url: url,
          error: error.message,
          status: 'ERROR',
        });
        results.summary.failedPages++;
      }

      results.summary.totalPages++;
    }

    // Generate final report
    results.summary.status = results.summary.failedPages === 0 ? 'PASS' : 'FAIL';

    // Save report
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));

    // Console summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Schema Validation Summary:');
    console.log('='.repeat(60));
    console.log(`Pages Validated: ${results.summary.totalPages}`);
    console.log(`Pages Passed:    ${results.summary.passedPages} ✅`);
    console.log(`Pages Failed:    ${results.summary.failedPages} ❌`);
    console.log(`Total Schemas:   ${results.summary.totalSchemas}`);
    console.log(`Total Errors:    ${results.summary.totalErrors}`);
    console.log(`Total Warnings:  ${results.summary.totalWarnings}`);
    console.log('='.repeat(60));
    console.log(`Status: ${results.summary.status === 'PASS' ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`\n📄 Full report saved to: ${OUTPUT_FILE}`);

    // Recommendations
    if (results.summary.totalWarnings > 0) {
      console.log('\n💡 Recommendations:');
      console.log('- Review warnings to improve schema completeness');
      console.log('- Add recommended properties for better rich snippet eligibility');
    }

    if (results.summary.totalErrors > 0) {
      console.log('\n⚠️  Next Steps:');
      console.log('1. Fix all schema errors listed in the report');
      console.log('2. Re-run validation after fixes');
      console.log(
        '3. Test with Google Rich Results Test: https://search.google.com/test/rich-results'
      );
    }

    process.exit(results.summary.status === 'PASS' ? 0 : 1);
  } catch (error) {
    console.error('❌ Fatal error during validation:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run the validation
runSchemaValidation().catch(error => {
  console.error('Failed to run schema validation:', error);
  process.exit(1);
});
