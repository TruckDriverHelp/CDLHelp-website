const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(process.cwd(), 'public/locales');
const SUPPORTED_LOCALES = ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'];
const BASE_LOCALE = 'en'; // Base locale for comparison

// Function to get all keys from object (including nested)
function getAllKeys(obj, prefix = '') {
  let keys = [];

  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      // If key contains dots, it's already a dot-notation key
      keys.push(fullKey);
    }
  }

  return keys;
}

// Function to check if key exists in object
function hasKey(obj, keyPath) {
  // First, check if the key exists as a literal dot-notation string key
  if (keyPath in obj) {
    return true;
  }

  // If not found as literal key, try nested path
  const keys = keyPath.split('.');
  let current = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return false;
    }
  }

  return true;
}

// Function to load JSON file
function loadTranslationFile(locale, filename) {
  const filePath = path.join(LOCALES_DIR, locale, filename);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Parsing error ${filePath}: ${error.message}`);
    return null;
  }
}

// Main check function
function checkTranslations() {
  console.log('🔍 Checking translations...\n');

  let hasErrors = false;
  const baseLocaleDir = path.join(LOCALES_DIR, BASE_LOCALE);

  if (!fs.existsSync(baseLocaleDir)) {
    console.error(`❌ Base locale ${BASE_LOCALE} not found!`);
    process.exit(1);
  }

  // Get list of all translation files from base locale
  const translationFiles = fs.readdirSync(baseLocaleDir).filter(file => file.endsWith('.json'));

  console.log(`📁 Found translation files: ${translationFiles.length}`);
  console.log(`🌍 Supported locales: ${SUPPORTED_LOCALES.join(', ')}\n`);

  // Check each translation file
  for (const filename of translationFiles) {
    console.log(`📄 Checking file: ${filename}`);

    // Load base file
    const baseTranslations = loadTranslationFile(BASE_LOCALE, filename);
    if (!baseTranslations) {
      console.error(`❌ Failed to load base file ${filename}`);
      hasErrors = true;
      continue;
    }

    // Get all keys from base file
    const baseKeys = getAllKeys(baseTranslations);
    console.log(`   🔑 Keys in base file: ${baseKeys.length}`);

    // Check each locale
    for (const locale of SUPPORTED_LOCALES) {
      if (locale === BASE_LOCALE) continue;

      const translations = loadTranslationFile(locale, filename);

      if (!translations) {
        console.error(`   ❌ ${locale}: file ${filename} missing`);
        hasErrors = true;
        continue;
      }

      // Check missing keys
      const missingKeys = baseKeys.filter(key => !hasKey(translations, key));

      if (missingKeys.length > 0) {
        console.error(`   ❌ ${locale}: missing ${missingKeys.length} keys:`);
        missingKeys.forEach(key => console.error(`      - ${key}`));
        hasErrors = true;
      } else {
        console.log(`   ✅ ${locale}: all keys present`);
      }
    }

    console.log('');
  }

  // Check extra files in other locales
  console.log('🔍 Checking extra files...');
  for (const locale of SUPPORTED_LOCALES) {
    if (locale === BASE_LOCALE) continue;

    const localeDir = path.join(LOCALES_DIR, locale);
    if (!fs.existsSync(localeDir)) {
      console.error(`❌ Locale folder ${locale} missing`);
      hasErrors = true;
      continue;
    }

    const localeFiles = fs.readdirSync(localeDir).filter(file => file.endsWith('.json'));

    const extraFiles = localeFiles.filter(file => !translationFiles.includes(file));
    if (extraFiles.length > 0) {
      console.warn(`⚠️  ${locale}: extra files: ${extraFiles.join(', ')}`);
    }
  }

  console.log('\n' + '='.repeat(50));

  if (hasErrors) {
    console.error('❌ Errors found in translations!');
    console.error('🚫 Build stopped. Fix errors before continuing.');
    process.exit(1);
  } else {
    console.log('✅ All translations are in order!');
    console.log('🚀 Ready to continue build.');
  }
}

// Run check
checkTranslations();
