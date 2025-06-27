/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.cdlhelp.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  outDir: './public',
  sourceDir: './build',
  exclude: ['/api/*', '/_next/*', '/404', '/500', '*/404', '*/500'],
  

  
  // SEO оптимизация: разделяем sitemap на несколько файлов
  additionalPaths: async (config) => {
    const paths = [];
    
    try {
      const { 
        fetchAllArticles, 
        fetchStatesAndCities, 
        getPreTripData, 
        LOCALES, 
        STATIC_PAGES 
      } = require('./lib/sitemap-utils');
      
      // Главные страницы с максимальным приоритетом
      LOCALES.forEach(locale => {
        if (locale === 'en') {
          paths.push({
            loc: '/',
            changefreq: 'daily',
            priority: 1.0,
            lastmod: new Date().toISOString()
          });
        } else {
          paths.push({
            loc: `/${locale}`,
            changefreq: 'daily',
            priority: 0.9,
            lastmod: new Date().toISOString()
          });
        }
      });

      // Статические страницы удалены - Next.js автоматически их найдет
      // и функция transform обработает их с правильными приоритетами

      // CDL Schools с улучшенными приоритетами
      try {
        const states = await fetchStatesAndCities();
        
        states.forEach(state => {
          LOCALES.forEach(locale => {
            const basePath = locale === 'en' ? '' : `/${locale}`;
            paths.push({
              loc: `${basePath}/cdl-schools/${state.slug}`,
              changefreq: 'weekly',
              priority: 0.7,
              lastmod: new Date().toISOString()
            });
          });

          // Города с приоритетом в зависимости от количества школ
          if (state.cities && state.cities.length > 0) {
            state.cities.forEach(city => {
              LOCALES.forEach(locale => {
                const basePath = locale === 'en' ? '' : `/${locale}`;
                const priority = city.schoolCount > 5 ? 0.6 : 0.5;
                
                paths.push({
                  loc: `${basePath}/cdl-schools/${state.slug}/${city.slug}`,
                  changefreq: 'monthly',
                  priority: priority,
                  lastmod: new Date().toISOString()
                });
              });
            });
          }
        });
      } catch (error) {
        console.error('Error fetching CDL schools data for sitemap:', error);
      }

      // Pre-trip inspection с оптимизированными приоритетами
      const preTripMapping = getPreTripData();
      const importantSections = ['tractor-front', 'in-cab-inspection', 'brakes', 'tractor-coupling'];

      Object.entries(preTripMapping).forEach(([file, maxSection]) => {
        const isImportant = importantSections.includes(file);
        const basePriority = isImportant ? 0.5 : 0.4;
        
        for (let section = 1; section <= maxSection; section++) {
          const sectionPriority = section <= 3 ? basePriority + 0.1 : basePriority;
          

          LOCALES.forEach(locale => {
            const basePath = locale === 'en' ? '' : `/${locale}`;
            paths.push({
              loc: `${basePath}/pre-trip-inspection/${file}/${section}`,
              changefreq: 'monthly',
              priority: Math.min(sectionPriority, 0.6),
              lastmod: new Date().toISOString()
            });
          });
        }
      });

      // Статьи из Strapi с реальными датами обновления
      try {
        const articles = await fetchAllArticles();
        articles.forEach(article => {
          const basePath = article.locale === 'en' ? '' : `/${article.locale}`;
          paths.push({
            loc: `${basePath}/${article.slug}`,
            changefreq: 'monthly',
            priority: 0.6,
            lastmod: article.updatedAt || new Date().toISOString()
          });
        });
      } catch (error) {
        console.error('Error fetching articles for sitemap:', error);
      }

    } catch (error) {
      console.error('Error generating additional paths:', error);
    }

    return paths;
  },

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/', '/build/']
      }
    ],
    additionalSitemaps: [
      'https://www.cdlhelp.com/sitemap-index.xml',
    ]
  },

  transform: async (config, path) => {
    // Исключаем страницы, которые не должны быть в sitemap
    if (path.includes('/api/') || path.includes('/_next/') || path.includes('/404') || path.includes('/500') || path.includes('/build/')) {
      return null;
    }

    // Определяем lastmod на основе типа страницы
    let lastmod = new Date().toISOString();
    
    if (path.includes('/privacy-policy') || path.includes('/terms-conditions')) {
      lastmod = new Date('2024-01-01').toISOString();
    }

    const { LOCALES } = require('./lib/sitemap-utils');

    // Функция для создания правильных hreflang ссылок
    const createAlternateRefs = (currentPath) => {
      // Проверяем, является ли это локализованной версией страницы
      const isLocalizedVersion = LOCALES.some(locale => 
        locale !== 'en' && (currentPath.startsWith(`/${locale}/`) || currentPath === `/${locale}`)
      );
      
      // Если это локализованная версия, не добавляем hreflang теги
      // (они будут только у английской версии)
      if (isLocalizedVersion) {
        return [];
      }
      
      // Для английских версий создаем hreflang теги для всех языков
      return LOCALES.map(lang => {
        let href;
        if (lang === 'en') {
          // Для английского языка: только базовый URL (next-sitemap добавит путь автоматически)
          href = `https://www.cdlhelp.com`;
        } else {
          // Для других языков: только языковой префикс (next-sitemap добавит путь автоматически)
          href = `https://www.cdlhelp.com/${lang}`;
        }
        
        return {
          href: href,
          hreflang: lang
        };
      });
    };

    // Главная страница - максимальный приоритет
    if (path === '/' || (path.startsWith('/') && path.split('/').length === 2 && LOCALES.includes(path.split('/')[1]))) {
      return {
        loc: path,
        changefreq: 'daily',
        priority: path === '/' ? 1.0 : 0.9,
        lastmod: lastmod,
        alternateRefs: createAlternateRefs(path)
      }
    }

    // Основные разделы
    if ((path.includes('/cdl-schools') && !path.includes('/cdl-schools/')) || 
        path.includes('/companies') || 
        path.includes('/contact')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: lastmod,
        alternateRefs: createAlternateRefs(path)
      }
    }

    // Страницы штатов CDL школ
    if (path.includes('/cdl-schools/') && !path.split('/cdl-schools/')[1].includes('/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: lastmod,
        alternateRefs: createAlternateRefs(path)
      }
    }

    // Страницы городов CDL школ
    if (path.includes('/cdl-schools/') && path.split('/cdl-schools/')[1].includes('/')) {
      return {
        loc: path,
        changefreq: 'monthly',
        priority: 0.6,
        lastmod: lastmod,
        alternateRefs: createAlternateRefs(path)
      }
    }

    // Pre-trip inspection страницы
    if (path.includes('/pre-trip-inspection/') && !path.includes('/guide')) {
      const importantSections = ['tractor-front', 'in-cab-inspection', 'brakes', 'tractor-coupling'];
      const isImportant = importantSections.some(section => path.includes(section));
      
      return {
        loc: path,
        changefreq: 'monthly',
        priority: isImportant ? 0.5 : 0.4,
        lastmod: lastmod,
        alternateRefs: createAlternateRefs(path)
      }
    }

    // Статьи и остальной контент
    return {
      loc: path,
      changefreq: 'monthly',
      priority: 0.6,
      lastmod: lastmod,
      alternateRefs: createAlternateRefs(path)
    }
  }
}