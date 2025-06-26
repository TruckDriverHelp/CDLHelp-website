const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(process.cwd(), 'public/locales');
const SUPPORTED_LOCALES = ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'];
const BASE_LOCALE = 'en'; // Базовая локаль для сравнения

// Функция для получения всех ключей из объекта (включая вложенные)
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

// Функция для проверки существования ключа в объекте
function hasKey(obj, keyPath) {
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

// Функция для загрузки JSON файла
function loadTranslationFile(locale, filename) {
  const filePath = path.join(LOCALES_DIR, locale, filename);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Ошибка парсинга ${filePath}: ${error.message}`);
    return null;
  }
}

// Основная функция проверки
function checkTranslations() {
  console.log('🔍 Проверка переводов...\n');
  
  let hasErrors = false;
  const baseLocaleDir = path.join(LOCALES_DIR, BASE_LOCALE);
  
  if (!fs.existsSync(baseLocaleDir)) {
    console.error(`❌ Базовая локаль ${BASE_LOCALE} не найдена!`);
    process.exit(1);
  }
  
  // Получаем список всех файлов переводов из базовой локали
  const translationFiles = fs.readdirSync(baseLocaleDir)
    .filter(file => file.endsWith('.json'));
  
  console.log(`📁 Найдено файлов переводов: ${translationFiles.length}`);
  console.log(`🌍 Поддерживаемые локали: ${SUPPORTED_LOCALES.join(', ')}\n`);
  
  // Проверяем каждый файл перевода
  for (const filename of translationFiles) {
    console.log(`📄 Проверка файла: ${filename}`);
    
    // Загружаем базовый файл
    const baseTranslations = loadTranslationFile(BASE_LOCALE, filename);
    if (!baseTranslations) {
      console.error(`❌ Не удалось загрузить базовый файл ${filename}`);
      hasErrors = true;
      continue;
    }
    
    // Получаем все ключи из базового файла
    const baseKeys = getAllKeys(baseTranslations);
    console.log(`   🔑 Ключей в базовом файле: ${baseKeys.length}`);
    
    // Проверяем каждую локаль
    for (const locale of SUPPORTED_LOCALES) {
      if (locale === BASE_LOCALE) continue;
      
      const translations = loadTranslationFile(locale, filename);
      
      if (!translations) {
        console.error(`   ❌ ${locale}: файл ${filename} отсутствует`);
        hasErrors = true;
        continue;
      }
      
      // Проверяем отсутствующие ключи
      const missingKeys = baseKeys.filter(key => !hasKey(translations, key));
      
      if (missingKeys.length > 0) {
        console.error(`   ❌ ${locale}: отсутствует ${missingKeys.length} ключей:`);
        missingKeys.forEach(key => console.error(`      - ${key}`));
        hasErrors = true;
      } else {
        console.log(`   ✅ ${locale}: все ключи присутствуют`);
      }
    }
    
    console.log('');
  }
  
  // Проверяем лишние файлы в других локалях
  console.log('🔍 Проверка лишних файлов...');
  for (const locale of SUPPORTED_LOCALES) {
    if (locale === BASE_LOCALE) continue;
    
    const localeDir = path.join(LOCALES_DIR, locale);
    if (!fs.existsSync(localeDir)) {
      console.error(`❌ Папка локали ${locale} отсутствует`);
      hasErrors = true;
      continue;
    }
    
    const localeFiles = fs.readdirSync(localeDir)
      .filter(file => file.endsWith('.json'));
    
    const extraFiles = localeFiles.filter(file => !translationFiles.includes(file));
    if (extraFiles.length > 0) {
      console.warn(`⚠️  ${locale}: лишние файлы: ${extraFiles.join(', ')}`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (hasErrors) {
    console.error('❌ Обнаружены ошибки в переводах!');
    console.error('🚫 Сборка остановлена. Исправьте ошибки перед продолжением.');
    process.exit(1);
  } else {
    console.log('✅ Все переводы в порядке!');
    console.log('🚀 Можно продолжать сборку.');
  }
}

// Запускаем проверку
checkTranslations(); 