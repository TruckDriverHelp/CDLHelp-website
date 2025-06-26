const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(process.cwd(), 'public/locales');
const SUPPORTED_LOCALES = ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'];
const BASE_LOCALE = 'en';

// Функция для получения всех ключей из объекта
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

// Функция для установки значения по пути ключа
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

// Функция для получения значения по пути ключа
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

// Функция для проверки существования ключа
function hasKey(obj, keyPath) {
  return getValueByPath(obj, keyPath) !== null;
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

// Функция для сохранения JSON файла
function saveTranslationFile(locale, filename, data) {
  const localeDir = path.join(LOCALES_DIR, locale);
  
  // Создаем папку если не существует
  if (!fs.existsSync(localeDir)) {
    fs.mkdirSync(localeDir, { recursive: true });
    console.log(`📁 Создана папка: ${localeDir}`);
  }
  
  const filePath = path.join(localeDir, filename);
  
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`💾 Сохранен файл: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Ошибка сохранения ${filePath}: ${error.message}`);
    return false;
  }
}

// Основная функция исправления
function fixTranslations() {
  console.log('🔧 Исправление переводов...\n');
  
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
  
  let fixedFiles = 0;
  let fixedKeys = 0;
  
  // Обрабатываем каждый файл перевода
  for (const filename of translationFiles) {
    console.log(`📄 Обработка файла: ${filename}`);
    
    // Загружаем базовый файл
    const baseTranslations = loadTranslationFile(BASE_LOCALE, filename);
    if (!baseTranslations) {
      console.error(`❌ Не удалось загрузить базовый файл ${filename}`);
      continue;
    }
    
    // Получаем все ключи из базового файла
    const baseKeys = getAllKeys(baseTranslations);
    
    // Обрабатываем каждую локаль
    for (const locale of SUPPORTED_LOCALES) {
      if (locale === BASE_LOCALE) continue;
      
      let translations = loadTranslationFile(locale, filename);
      let fileChanged = false;
      
      // Если файл не существует, создаем пустой объект
      if (!translations) {
        translations = {};
        fileChanged = true;
        fixedFiles++;
        console.log(`   📝 Создание нового файла для ${locale}`);
      }
      
      // Проверяем отсутствующие ключи
      const missingKeys = baseKeys.filter(key => !hasKey(translations, key));
      
      if (missingKeys.length > 0) {
        console.log(`   🔧 ${locale}: добавление ${missingKeys.length} ключей`);
        
        // Добавляем отсутствующие ключи
        for (const key of missingKeys) {
          const baseValue = getValueByPath(baseTranslations, key);
          let translatedValue;
          
          // Генерируем заглушку для перевода
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
      
      // Сохраняем файл если были изменения
      if (fileChanged) {
        saveTranslationFile(locale, filename, translations);
      } else {
        console.log(`   ✅ ${locale}: файл уже актуален`);
      }
    }
    
    console.log('');
  }
  
  console.log('='.repeat(50));
  console.log(`✅ Исправление завершено!`);
  console.log(`📁 Создано/обновлено файлов: ${fixedFiles}`);
  console.log(`🔑 Добавлено ключей: ${fixedKeys}`);
  console.log(`\n⚠️  ВАЖНО: Проверьте автоматически созданные переводы и замените заглушки на корректные переводы!`);
  console.log(`🔍 Заглушки имеют формат: [LOCALE] Original text`);
}

// Запускаем исправление
fixTranslations(); 