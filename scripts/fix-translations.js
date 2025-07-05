const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(process.cwd(), 'public/locales');
const SUPPORTED_LOCALES = ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'];
const BASE_LOCALE = 'en';

// Function to get all keys from an object
function getAllKeys(obj, prefix = '') {
  let keys = [];

  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }

  return keys;
}

// Function to set value by key path
function setValueByPath(obj, keyPath, value) {
  const keys = keyPath.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
}

// Function to get value by key path
function getValueByPath(obj, keyPath) {
  const keys = keyPath.split('.');
  let current = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return null;
    }
  }

  return current;
}

// Function to check if key exists
function hasKey(obj, keyPath) {
  return getValueByPath(obj, keyPath) !== null;
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

// Function to save JSON file
function saveTranslationFile(locale, filename, data) {
  const localeDir = path.join(LOCALES_DIR, locale);

  // Create folder if it doesn't exist
  if (!fs.existsSync(localeDir)) {
    fs.mkdirSync(localeDir, { recursive: true });
    console.log(`📁 Created folder: ${localeDir}`);
  }

  const filePath = path.join(localeDir, filename);

  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`💾 Saved file: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Save error ${filePath}: ${error.message}`);
    return false;
  }
}

// Main fix function
function fixTranslations() {
  console.log('🔧 Fixing translations...\n');

  const baseLocaleDir = path.join(LOCALES_DIR, BASE_LOCALE);

  if (!fs.existsSync(baseLocaleDir)) {
    console.error(`❌ Base locale ${BASE_LOCALE} not found!`);
    process.exit(1);
  }

  // Get list of all translation files from base locale
  const translationFiles = fs.readdirSync(baseLocaleDir).filter(file => file.endsWith('.json'));

  console.log(`📁 Found translation files: ${translationFiles.length}`);
  console.log(`🌍 Supported locales: ${SUPPORTED_LOCALES.join(', ')}\n`);

  let fixedFiles = 0;
  let fixedKeys = 0;

  // Process each translation file
  for (const filename of translationFiles) {
    console.log(`📄 Processing file: ${filename}`);

    // Load base file
    const baseTranslations = loadTranslationFile(BASE_LOCALE, filename);
    if (!baseTranslations) {
      console.error(`❌ Failed to load base file ${filename}`);
      continue;
    }

    // Get all keys from base file
    const baseKeys = getAllKeys(baseTranslations);

    // Process each locale
    for (const locale of SUPPORTED_LOCALES) {
      if (locale === BASE_LOCALE) continue;

      let translations = loadTranslationFile(locale, filename);
      let fileChanged = false;

      // If file doesn't exist, create empty object
      if (!translations) {
        translations = {};
        fileChanged = true;
        fixedFiles++;
        console.log(`   📝 Creating new file for ${locale}`);
      }

      // Check missing keys
      const missingKeys = baseKeys.filter(key => !hasKey(translations, key));

      if (missingKeys.length > 0) {
        console.log(`   🔧 ${locale}: adding ${missingKeys.length} keys`);

        // Add missing keys
        for (const key of missingKeys) {
          const baseValue = getValueByPath(baseTranslations, key);
          let translatedValue;

          // Generate placeholder for translation
          if (typeof baseValue === 'string') {
            translatedValue = `[${locale.toUpperCase()}] ${baseValue}`;
          } else {
            translatedValue = baseValue;
          }

          setValueByPath(translations, key, translatedValue);
          fileChanged = true;
          fixedKeys++;
        }
      }

      // Save file if there were changes
      if (fileChanged) {
        saveTranslationFile(locale, filename, translations);
      } else {
        console.log(`   ✅ ${locale}: file already up to date`);
      }
    }

    console.log('');
  }

  console.log('='.repeat(50));
  console.log(`✅ Fix completed!`);
  console.log(`📁 Created/updated files: ${fixedFiles}`);
  console.log(`🔑 Added keys: ${fixedKeys}`);
  console.log(
    `\n⚠️  IMPORTANT: Check automatically created translations and replace placeholders with correct translations!`
  );
  console.log(`🔍 Placeholders have format: [LOCALE] Original text`);
}

// Run fix
fixTranslations();
