#!/usr/bin/env node

/**
 * Schema.org Validation Script
 * Validates all schemas in the codebase
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Schema validation errors and warnings
let errors = [];
let warnings = [];
let totalSchemas = 0;
let validSchemas = 0;

/**
 * Log with color
 */
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Find all files with schema implementations
 */
function findSchemaFiles() {
  const files = [];

  // Search for files containing schemas
  const patterns = [
    'pages/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'src/**/*.{js,jsx,ts,tsx}',
  ];

  patterns.forEach(pattern => {
    try {
      const result = execSync(
        `find . -path "./node_modules" -prune -o -path "./.next" -prune -o -path "./build" -prune -o -path "./out" -prune -o -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | grep -E "(pages|components|src)" | grep -v "/build/" | xargs grep -l "@context.*schema.org" 2>/dev/null || true`,
        {
          encoding: 'utf8',
          cwd: path.resolve(__dirname, '..'),
        }
      );

      if (result) {
        files.push(
          ...result
            .trim()
            .split('\n')
            .filter(Boolean)
            .filter(f => !f.includes('/build/'))
        );
      }
    } catch (e) {
      // Ignore errors
    }
  });

  return [...new Set(files)];
}

/**
 * Extract schemas from a file
 */
function extractSchemas(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const schemas = [];

  // Match schema objects
  const schemaMatches = content.matchAll(/@context['"]?\s*:\s*['"]https:\/\/schema\.org/g);

  for (const match of schemaMatches) {
    const startIndex = content.lastIndexOf('{', match.index);
    if (startIndex === -1) continue;

    let depth = 0;
    let endIndex = startIndex;

    for (let i = startIndex; i < content.length; i++) {
      if (content[i] === '{') depth++;
      if (content[i] === '}') depth--;

      if (depth === 0) {
        endIndex = i;
        break;
      }
    }

    if (endIndex > startIndex) {
      const schemaStr = content.substring(startIndex, endIndex + 1);
      try {
        // Basic extraction - this is simplified
        schemas.push({
          file: filePath,
          position: match.index,
          raw: schemaStr,
        });
      } catch (e) {
        // Ignore parse errors
      }
    }
  }

  return schemas;
}

/**
 * Validate a schema
 */
function validateSchema(schema) {
  const issues = [];

  // Check for duplicate schemas
  if (schema.raw.includes('@type')) {
    const typeMatch = schema.raw.match(/@type['"]?\s*:\s*['"]([^'"]+)/);
    if (typeMatch) {
      const schemaType = typeMatch[1];

      // Check required properties based on type
      switch (schemaType) {
        case 'Organization':
        case 'EducationalOrganization':
          if (!schema.raw.includes('name')) {
            issues.push({
              type: 'error',
              message: `${schemaType} missing required property: name`,
            });
          }
          if (!schema.raw.includes('url')) {
            issues.push({ type: 'error', message: `${schemaType} missing required property: url` });
          }
          if (!schema.raw.includes('logo')) {
            issues.push({
              type: 'warning',
              message: `${schemaType} missing recommended property: logo`,
            });
          }
          break;

        case 'Article':
        case 'BlogPosting':
          if (!schema.raw.includes('headline')) {
            issues.push({
              type: 'error',
              message: `${schemaType} missing required property: headline`,
            });
          }
          if (!schema.raw.includes('author')) {
            issues.push({
              type: 'error',
              message: `${schemaType} missing required property: author`,
            });
          }
          if (!schema.raw.includes('datePublished')) {
            issues.push({
              type: 'error',
              message: `${schemaType} missing required property: datePublished`,
            });
          }
          if (!schema.raw.includes('wordCount')) {
            issues.push({
              type: 'warning',
              message: `${schemaType} missing recommended property: wordCount`,
            });
          }
          break;

        case 'Course':
          if (!schema.raw.includes('name')) {
            issues.push({
              type: 'error',
              message: `${schemaType} missing required property: name`,
            });
          }
          if (!schema.raw.includes('provider')) {
            issues.push({
              type: 'error',
              message: `${schemaType} missing required property: provider`,
            });
          }
          if (!schema.raw.includes('aggregateRating')) {
            issues.push({
              type: 'warning',
              message: `${schemaType} missing recommended property: aggregateRating`,
            });
          }
          break;

        case 'FAQPage':
          if (!schema.raw.includes('mainEntity')) {
            issues.push({
              type: 'error',
              message: `${schemaType} missing required property: mainEntity`,
            });
          }
          break;

        case 'BreadcrumbList':
          if (!schema.raw.includes('itemListElement')) {
            issues.push({
              type: 'error',
              message: `${schemaType} missing required property: itemListElement`,
            });
          }
          break;
      }

      // Check for @id uniqueness
      if (schema.raw.includes('@id')) {
        const idMatch = schema.raw.match(/@id['"]?\s*:\s*['"]([^'"]+)/);
        if (idMatch) {
          // Track IDs for duplicate detection
          schema.id = idMatch[1];
        }
      }
    }
  }

  return issues;
}

/**
 * Main validation function
 */
function validateAllSchemas() {
  log('\n🔍 Schema.org Validation Report', 'cyan');
  log('================================\n', 'cyan');

  const files = findSchemaFiles();
  log(`Found ${files.length} files with schema implementations\n`, 'blue');

  const allSchemas = [];
  const idMap = new Map();

  files.forEach(file => {
    const schemas = extractSchemas(file);
    schemas.forEach(schema => {
      totalSchemas++;
      const issues = validateSchema(schema);

      if (issues.length === 0) {
        validSchemas++;
      } else {
        issues.forEach(issue => {
          if (issue.type === 'error') {
            errors.push({ file: schema.file, message: issue.message });
          } else {
            warnings.push({ file: schema.file, message: issue.message });
          }
        });
      }

      // Check for duplicate IDs
      if (schema.id) {
        if (idMap.has(schema.id)) {
          errors.push({
            file: schema.file,
            message: `Duplicate @id: ${schema.id} (also in ${idMap.get(schema.id)})`,
          });
        } else {
          idMap.set(schema.id, schema.file);
        }
      }

      allSchemas.push(schema);
    });
  });

  // Report results
  if (errors.length > 0) {
    log('\n❌ Errors:', 'red');
    errors.forEach(error => {
      log(`  ${error.file}: ${error.message}`, 'red');
    });
  }

  if (warnings.length > 0) {
    log('\n⚠️  Warnings:', 'yellow');
    warnings.forEach(warning => {
      log(`  ${warning.file}: ${warning.message}`, 'yellow');
    });
  }

  // Summary
  log('\n📊 Summary:', 'magenta');
  log(`  Total schemas: ${totalSchemas}`, 'magenta');
  log(`  Valid schemas: ${validSchemas}`, 'green');
  log(
    `  Schemas with issues: ${totalSchemas - validSchemas}`,
    errors.length > 0 ? 'red' : 'yellow'
  );
  log(`  Errors: ${errors.length}`, errors.length > 0 ? 'red' : 'green');
  log(`  Warnings: ${warnings.length}`, warnings.length > 0 ? 'yellow' : 'green');

  const coverage = totalSchemas > 0 ? Math.round((validSchemas / totalSchemas) * 100) : 0;
  log(`  Coverage: ${coverage}%\n`, coverage >= 80 ? 'green' : 'yellow');

  // Exit with error if there are validation errors
  if (errors.length > 0) {
    log('❌ Schema validation failed!', 'red');
    process.exit(1);
  } else if (warnings.length > 0) {
    log('⚠️  Schema validation passed with warnings', 'yellow');
  } else {
    log('✅ All schemas are valid!', 'green');
  }
}

// Run validation
validateAllSchemas();
