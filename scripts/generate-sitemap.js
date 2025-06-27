#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { parseString } = require('xml2js');

console.log('🚀 Generating optimized sitemap...\n');

try {
  // Генерируем sitemap
  execSync('npx next-sitemap', { stdio: 'inherit' });
  
  console.log('\n✅ Sitemap generated successfully!\n');
  
  // SEO Анализ сгенерированного sitemap
  console.log('📊 SEO Analysis:\n');
  
  // Проверяем основной sitemap
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  const sitemapIndexPath = path.join(process.cwd(), 'public', 'sitemap-index.xml');
  
  // Анализируем sitemap index если он существует
  if (fs.existsSync(sitemapIndexPath)) {
    const indexContent = fs.readFileSync(sitemapIndexPath, 'utf8');
    console.log('🗂️  Sitemap Index found - Multiple sitemaps generated for better SEO');
    
    // Парсим sitemap index
    parseString(indexContent, (err, result) => {
      if (!err && result.sitemapindex && result.sitemapindex.sitemap) {
        const sitemapCount = result.sitemapindex.sitemap.length;
        console.log(`   📁 Number of sitemap files: ${sitemapCount}`);
        
        result.sitemapindex.sitemap.forEach((sitemap, index) => {
          console.log(`   📄 Sitemap ${index + 1}: ${sitemap.loc[0]}`);
        });
      }
    });
  }
  
  // Анализируем основной sitemap с URL
  const mainSitemapPath = path.join(process.cwd(), 'public', 'sitemap-0.xml');
  if (fs.existsSync(mainSitemapPath)) {
    const sitemapContent = fs.readFileSync(mainSitemapPath, 'utf8');
    const sitemapStats = fs.statSync(mainSitemapPath);
    const sitemapSizeKB = (sitemapStats.size / 1024).toFixed(2);
    
    console.log(`\n📋 Main Sitemap Analysis:`);
    console.log(`   📏 File size: ${sitemapSizeKB} KB`);
    
    // Парсим XML для подробной аналитики
    parseString(sitemapContent, (err, result) => {
      if (err) {
        console.error('❌ Error parsing sitemap XML:', err.message);
        return;
      }
      
      if (result.urlset && result.urlset.url) {
        const urls = result.urlset.url;
        const totalUrls = urls.length;
        
        console.log(`   🔗 Total URLs: ${totalUrls}`);
        
        // SEO Проверки
        console.log(`\n🔍 SEO Quality Checks:`);
        
        // Проверка размера файла
        if (sitemapSizeKB > 50000) { // 50MB лимит
          console.log('   ⚠️  WARNING: Sitemap size exceeds 50MB limit');
        } else if (sitemapSizeKB > 10000) { // 10MB рекомендация
          console.log('   ⚠️  NOTICE: Sitemap size is large (>10MB), consider splitting');
        } else {
          console.log('   ✅ File size is optimal');
        }
        
        // Проверка количества URL
        if (totalUrls > 50000) {
          console.log('   ⚠️  WARNING: Sitemap contains more than 50,000 URLs');
        } else if (totalUrls > 10000) {
          console.log('   ⚠️  NOTICE: Large number of URLs, consider using sitemap index');
        } else {
          console.log('   ✅ URL count is optimal');
        }
        
        // Анализ приоритетов
        const priorities = {};
        const changefreqs = {};
        let hreflangCount = 0;
        let lastmodCount = 0;
        
        urls.forEach(url => {
          // Приоритеты
          if (url.priority && url.priority[0]) {
            const priority = parseFloat(url.priority[0]);
            priorities[priority] = (priorities[priority] || 0) + 1;
          }
          
          // Частота обновлений
          if (url.changefreq && url.changefreq[0]) {
            const changefreq = url.changefreq[0];
            changefreqs[changefreq] = (changefreqs[changefreq] || 0) + 1;
          }
          
          // Проверка hreflang (xhtml:link)
          if (url['xhtml:link']) {
            hreflangCount++;
          }
          
          // Проверка lastmod
          if (url.lastmod && url.lastmod[0]) {
            lastmodCount++;
          }
        });
        
        // Отчет по приоритетам
        console.log(`\n📊 Priority Distribution:`);
        Object.entries(priorities)
          .sort(([a], [b]) => parseFloat(b) - parseFloat(a))
          .forEach(([priority, count]) => {
            const percentage = ((count / totalUrls) * 100).toFixed(1);
            console.log(`   Priority ${priority}: ${count} URLs (${percentage}%)`);
          });
        
        // Отчет по частоте обновлений
        console.log(`\n⏰ Change Frequency Distribution:`);
        Object.entries(changefreqs)
          .sort(([,a], [,b]) => b - a)
          .forEach(([freq, count]) => {
            const percentage = ((count / totalUrls) * 100).toFixed(1);
            console.log(`   ${freq}: ${count} URLs (${percentage}%)`);
          });
        
        // Многоязычность
        console.log(`\n🌍 Internationalization:`);
        if (hreflangCount > 0) {
          const hreflangPercentage = ((hreflangCount / totalUrls) * 100).toFixed(1);
          console.log(`   ✅ Hreflang tags: ${hreflangCount} URLs (${hreflangPercentage}%)`);
        } else {
          console.log(`   ⚠️  No hreflang tags found - consider adding for multilingual SEO`);
        }
        
        // LastMod
        console.log(`\n📅 Last Modified:`);
        if (lastmodCount === totalUrls) {
          console.log(`   ✅ All URLs have lastmod dates`);
        } else {
          console.log(`   ⚠️  ${totalUrls - lastmodCount} URLs missing lastmod dates`);
        }
        
        // Категоризация URL
        console.log(`\n📂 URL Categories:`);
        const categories = {
          'Home pages': 0,
          'CDL Schools (States)': 0,
          'CDL Schools (Cities)': 0,
          'Pre-trip Inspection': 0,
          'Articles': 0,
          'Static pages': 0,
          'Other': 0
        };
        
        urls.forEach(url => {
          const loc = url.loc[0];
          const path = new URL(loc).pathname;
          
          if (path === '/' || path.match(/^\/[a-z]{2}\/?$/)) {
            categories['Home pages']++;
          } else if (path.includes('/cdl-schools/') && path.split('/').length === 4) {
            categories['CDL Schools (States)']++;
          } else if (path.includes('/cdl-schools/') && path.split('/').length === 5) {
            categories['CDL Schools (Cities)']++;
          } else if (path.includes('/pre-trip-inspection/') && !path.includes('/guide')) {
            categories['Pre-trip Inspection']++;
          } else if (path.match(/^(\/[a-z]{2})?\/[^\/]+$/) && !path.includes('/companies') && !path.includes('/contact')) {
            categories['Articles']++;
          } else if (path.includes('/companies') || path.includes('/contact') || path.includes('/privacy-policy')) {
            categories['Static pages']++;
          } else {
            categories['Other']++;
          }
        });
        
        Object.entries(categories).forEach(([category, count]) => {
          if (count > 0) {
            const percentage = ((count / totalUrls) * 100).toFixed(1);
            console.log(`   ${category}: ${count} URLs (${percentage}%)`);
          }
        });
        
        // SEO Рекомендации
        console.log(`\n💡 SEO Recommendations:`);
        
        if (sitemapSizeKB > 1000) {
          console.log(`   📝 Consider implementing sitemap index for better crawling`);
        }
        
        if (hreflangCount === 0) {
          console.log(`   🌐 Add hreflang attributes for international SEO`);
        }
        
        const highPriorityCount = priorities['1'] || 0;
        const mediumPriorityCount = (priorities['0.8'] || 0) + (priorities['0.9'] || 0);
        
        if (highPriorityCount > totalUrls * 0.1) {
          console.log(`   ⚖️  Too many high priority pages (${highPriorityCount}), consider redistributing`);
        }
        
        if (mediumPriorityCount < totalUrls * 0.2) {
          console.log(`   📈 Consider increasing priority for important category pages`);
        }
        
        console.log(`   ✅ Submit sitemap to Google Search Console and Bing Webmaster Tools`);
        console.log(`   ✅ Monitor sitemap processing in search console`);
        console.log(`   ✅ Update sitemap regularly when content changes`);
        
      } else {
        console.log('   ❌ No URLs found in sitemap');
      }
    });
  } else {
    console.log('❌ Sitemap file not found');
  }
  
  // Проверяем robots.txt
  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
  if (fs.existsSync(robotsPath)) {
    const robotsContent = fs.readFileSync(robotsPath, 'utf8');
    console.log(`\n🤖 Robots.txt Analysis:`);
    
    if (robotsContent.includes('Sitemap:')) {
      console.log('   ✅ Sitemap reference found in robots.txt');
    } else {
      console.log('   ⚠️  No sitemap reference in robots.txt');
    }
    
    if (robotsContent.includes('Disallow: /api/')) {
      console.log('   ✅ API routes properly disallowed');
    }
    
    if (robotsContent.includes('Disallow: /_next/')) {
      console.log('   ✅ Next.js build files properly disallowed');
    }
  }
  
  console.log(`\n🎉 SEO-optimized sitemap generation completed!`);
  
  // Форматируем XML файлы для лучшей читаемости в браузерах
  try {
    console.log('\n🔧 Formatting XML files for better readability...');
    const { main: formatSitemaps } = require('./format-sitemap');
    formatSitemaps();
    console.log('✅ XML formatting completed!');
  } catch (error) {
    console.warn('⚠️ Could not format XML files:', error.message);
  }
  
  console.log(`\n📍 Next steps:`);
  console.log(`   1. Submit sitemap to Google Search Console`);
  console.log(`   2. Submit sitemap to Bing Webmaster Tools`);
  console.log(`   3. Monitor indexing status`);
  console.log(`   4. Set up automated sitemap regeneration`);
  
} catch (error) {
  console.error('❌ Error generating sitemap:', error.message);
  process.exit(1);
} 