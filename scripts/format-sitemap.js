#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Форматирует XML строку с правильными отступами и переносами строк
 * @param {string} xmlString - Неформатированная XML строка
 * @returns {string} - Отформатированная XML строка
 */
function formatXML(xmlString) {
  const PADDING = '  '; // 2 пробела для отступов
  const reg = /(>)(<)(\/*)/g;
  let formatted = xmlString.replace(reg, '$1\n$2$3');
  
  let pad = 0;
  formatted = formatted.split('\n').map((line) => {
    let indent = 0;
    if (line.match(/.+<\/\w[^>]*>$/)) {
      indent = 0;
    } else if (line.match(/^<\/\w/) && pad > 0) {
      pad -= 1;
    } else if (line.match(/^<\w[^>]*[^\/]>.*$/)) {
      indent = 1;
    } else {
      indent = 0;
    }
    
    const padding = PADDING.repeat(pad);
    pad += indent;
    
    return padding + line;
  }).join('\n');
  
  return formatted;
}

/**
 * Обрабатывает один XML файл
 * @param {string} filePath - Путь к XML файлу
 */
function formatSitemapFile(filePath) {
  try {
    console.log(`Форматирование: ${filePath}`);
    
    const content = fs.readFileSync(filePath, 'utf8');
    const formatted = formatXML(content);
    
    fs.writeFileSync(filePath, formatted, 'utf8');
    
    console.log(`✅ Отформатирован: ${filePath}`);
  } catch (error) {
    console.error(`❌ Ошибка при форматировании ${filePath}:`, error.message);
  }
}

/**
 * Основная функция
 */
function main() {
  const publicDir = path.join(process.cwd(), 'public');
  
  console.log('🔧 Начинаем форматирование XML файлов sitemap...\n');
  
  try {
    // Получаем все XML файлы в папке public
    const files = fs.readdirSync(publicDir)
      .filter(file => file.endsWith('.xml') && (file.includes('sitemap') || file === 'robots.txt'))
      .map(file => path.join(publicDir, file));
    
    if (files.length === 0) {
      console.log('❌ Не найдены XML файлы sitemap в папке public/');
      return;
    }
    
    console.log(`📁 Найдено файлов для обработки: ${files.length}`);
    files.forEach(file => console.log(`  - ${path.basename(file)}`));
    console.log('');
    
    // Форматируем каждый файл
    files.forEach(formatSitemapFile);
    
    console.log('\n✅ Форматирование завершено!');
    
    // Показываем статистику
    const stats = files.map(file => {
      const stat = fs.statSync(file);
      return {
        name: path.basename(file),
        size: (stat.size / 1024).toFixed(2) + ' KB'
      };
    });
    
    console.log('\n📊 Статистика файлов:');
    stats.forEach(({ name, size }) => {
      console.log(`  ${name}: ${size}`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    process.exit(1);
  }
}

// Запускаем если файл вызван напрямую
if (require.main === module) {
  main();
}

module.exports = { formatXML, formatSitemapFile, main }; 