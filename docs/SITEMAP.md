# Sitemap Configuration

Этот проект использует `next-sitemap` для автоматической генерации XML sitemap с поддержкой многоязычности и динамических маршрутов.

## Структура sitemap

### Основные разделы

1. **Главные страницы** (приоритет 1.0-0.9)
   - Главная страница для всех локалей
   - Высокий приоритет, обновление ежедневно

2. **Основные разделы** (приоритет 0.8)
   - `/companies` - Список компаний
   - `/contact` - Контактная страница
   - `/cdl-schools` - Главная страница школ CDL
   - Обновление еженедельно

3. **CDL Schools** (приоритет 0.7-0.6)
   - Страницы штатов: `/cdl-schools/[state]`
   - Страницы городов: `/cdl-schools/[state]/[city]`
   - Динамически генерируется из API

4. **Pre-trip Inspection** (приоритет 0.5)
   - Детальные страницы проверки: `/pre-trip-inspection/[file]/[section]`
   - Основано на JSON данных из `data/pre-trip/`

5. **Статьи** (приоритет 0.6)
   - Динамические статьи из Strapi CMS
   - Поддержка всех локалей

6. **Статические страницы** (приоритет 0.6)
   - Privacy Policy, Terms & Conditions, Cookie Policy
   - Road Signs Test, DOT Physical Exam

## Локализация

Поддерживаются следующие локали:
- `en` (English) - базовая локаль
- `ru` (Русский)
- `uk` (Українська)
- `ar` (العربية)
- `ko` (한국어)
- `zh` (中文)
- `tr` (Türkçe)
- `pt` (Português)

## Файлы конфигурации

### `next-sitemap.config.js`
Основная конфигурация sitemap с:
- Настройками приоритетов и частоты обновления
- Исключениями для API и служебных страниц
- Динамической генерацией путей

### `lib/sitemap-utils.js`
Утилиты для получения данных:
- `fetchAllArticles()` - статьи из Strapi
- `fetchStatesAndCities()` - данные о школах CDL
- `getPreTripData()` - структура pre-trip inspection

### `scripts/generate-sitemap.js`
Скрипт для генерации с отчетностью и проверками

## Команды

```bash
# Генерация sitemap
npm run sitemap

# Генерация с подробной статистикой
npm run sitemap:generate

# Полная сборка с автоматической генерацией sitemap
npm run build
```

## Автоматическая генерация

Sitemap автоматически генерируется при:
1. Выполнении `npm run build`
2. Ручном запуске `npm run sitemap:generate`

## Структура файлов

```
public/
├── sitemap.xml           # Основной sitemap
├── robots.txt           # Robots.txt с ссылками на sitemap
├── sitemap-en.xml       # Sitemap для английской локали
├── sitemap-ru.xml       # Sitemap для русской локали
└── ...                  # Остальные локали
```

## Статистика

Текущий sitemap содержит:
- **~1285 URL** общего количества
- **169 страниц** CDL Schools
- **984 страницы** Pre-trip Inspection
- **24 статические страницы**
- **Статьи** из Strapi CMS

## Мониторинг

### Проверка sitemap
```bash
# Количество URL
grep -c "<url>" public/sitemap.xml

# Проверка на ошибки 404
grep -c "404" public/sitemap.xml

# Статистика по разделам
grep -c "cdl-schools" public/sitemap.xml
grep -c "pre-trip-inspection" public/sitemap.xml
```

### Валидация
- Используйте [Google Search Console](https://search.google.com/search-console) для проверки sitemap
- Проверьте доступность `https://www.cdlhelp.com/sitemap.xml`
- Убедитесь, что robots.txt содержит ссылку на sitemap

## Troubleshooting

### Ошибка "Unable to find build-manifest"
```bash
# Сначала соберите проект
npm run build:force
# Затем генерируйте sitemap
npm run sitemap
```

### Отсутствуют динамические страницы
- Проверьте подключение к Strapi API
- Убедитесь, что переменные окружения настроены
- Проверьте логи в консоли при генерации

### Большой размер sitemap
- Рассмотрите разделение на несколько sitemap файлов
- Используйте `generateIndexSitemap: true` в конфигурации
- Оптимизируйте количество динамических страниц

## API Dependencies

Sitemap зависит от следующих API:
- **Strapi GraphQL API** - для получения школ CDL и статей
- **Environment Variables** - STRAPI_HOST, STRAPI_PORT, STRAPI_API_KEY

При недоступности API используются fallback данные для обеспечения работоспособности. 

# Sitemap Documentation

## Overview

This document describes the sitemap implementation for the CDL Help website, including structure, generation process, and SEO optimization strategies.

## 🎯 SEO Optimization Features

### ✅ Implemented Optimizations

1. **Sitemap Index Structure**
   - Automatic generation of sitemap index for better crawling
   - Separation of URLs into logical groups
   - Optimal file sizes under 50MB limit

2. **Hreflang Support**
   - 100% coverage of URLs with hreflang attributes
   - Proper language targeting for 8 locales
   - Correct alternate language references

3. **Priority Optimization**
   - Homepage: Priority 1.0 (highest)
   - Main sections: Priority 0.8-0.9
   - State pages: Priority 0.7
   - City pages: Priority 0.6
   - Important pre-trip sections: Priority 0.5-0.6
   - Regular content: Priority 0.4-0.5

4. **Change Frequency Optimization**
   - Homepage: Daily updates
   - Main sections: Weekly updates
   - Content pages: Monthly updates

5. **Real Last Modified Dates**
   - Articles use actual Strapi update timestamps
   - Static pages use appropriate update frequencies
   - Pre-trip content uses generation timestamps

## 📊 Current Sitemap Statistics

- **Total URLs**: 1,285
- **File Size**: 1.7 MB (optimal)
- **Hreflang Coverage**: 100%
- **Sitemap Files**: 2 (index + main)

### URL Distribution
- Pre-trip Inspection: 976 URLs (76.0%)
- Articles: 101 URLs (7.9%)
- CDL Schools (Cities): 84 URLs (6.5%)
- CDL Schools (States): 68 URLs (5.3%)
- Static pages: 16 URLs (1.2%)
- Other: 40 URLs (3.1%)

### Priority Distribution
- Priority 1.0: 1 URL (0.1%) - Homepage
- Priority 0.8-0.9: 31 URLs (2.4%) - Main sections
- Priority 0.6-0.7: 277 URLs (21.6%) - Important content
- Priority 0.4-0.5: 976 URLs (76.0%) - Regular content

## Sitemap Structure

### File Organization
```
public/
├── sitemap.xml          # Sitemap index
├── sitemap-0.xml        # Main sitemap with all URLs
└── robots.txt           # Robot directives with sitemap reference
```

### URL Categories

1. **Homepage & Language Variants** (8 URLs)
   - Main homepage (/)
   - Language-specific homepages (/ru/, /uk/, etc.)

2. **CDL Schools** (152 URLs)
   - State pages: `/cdl-schools/{state}`
   - City pages: `/cdl-schools/{state}/{city}`

3. **Pre-trip Inspection** (976 URLs)
   - Component-based pages: `/pre-trip-inspection/{component}/{section}`
   - All 8 locales supported

4. **Static Pages** (96 URLs)
   - Contact, companies, privacy policy, etc.
   - Multilingual versions

5. **Dynamic Articles** (101+ URLs)
   - Content from Strapi CMS
   - Multilingual support

## Generation Process

### Automated Generation

The sitemap is automatically generated during the build process:

```bash
npm run build  # Includes sitemap generation
# OR manually:
npm run sitemap:generate
```

### Generation Script Features

- **SEO Analysis**: Comprehensive analysis of generated sitemap
- **Error Handling**: Graceful fallbacks for API failures
- **Statistics**: Detailed reporting of URL counts and categories
- **Validation**: Checks for SEO best practices

## Configuration

### Main Configuration (`next-sitemap.config.js`)

```javascript
module.exports = {
  siteUrl: 'https://www.cdlhelp.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  // ... SEO optimizations
}
```

### Key SEO Settings

- **generateIndexSitemap**: `true` - Creates sitemap index
- **hreflang**: Automatic generation for all locales
- **priority**: Dynamic based on content importance
- **changefreq**: Optimized for content type
- **lastmod**: Real timestamps from data sources

## Utility Functions (`lib/sitemap-utils.js`)

### Data Sources

1. **fetchAllArticles()**: Retrieves articles from Strapi API
2. **fetchStatesAndCities()**: Gets CDL school data via GraphQL
3. **getPreTripData()**: Provides pre-trip inspection structure
4. **LOCALES**: Supported language codes
5. **STATIC_PAGES**: Static page definitions

### Error Handling

- Graceful API failure handling
- Fallback data for offline generation
- Comprehensive error logging

## SEO Best Practices Implemented

### ✅ Technical SEO
- Valid XML structure
- Proper namespace declarations
- Correct URL formatting
- Optimal file sizes

### ✅ International SEO
- Hreflang implementation
- Language-specific URLs
- Proper locale targeting

### ✅ Content Prioritization
- Strategic priority assignment
- Important content emphasis
- Logical URL hierarchy

### ✅ Crawling Optimization
- Sitemap index structure
- Appropriate change frequencies
- Real last modified dates

## Monitoring and Maintenance

### Search Console Setup
1. Submit sitemap to Google Search Console
2. Submit sitemap to Bing Webmaster Tools
3. Monitor indexing status regularly
4. Check for crawl errors

### Regular Maintenance
- Automatic regeneration on content updates
- Monthly sitemap audits
- Performance monitoring
- Error tracking

### Analytics Integration
- Track sitemap submission status
- Monitor indexing rates
- Analyze crawl patterns
- Identify optimization opportunities

## SEO Performance Metrics

### Key Indicators
- **Indexing Rate**: % of URLs indexed by search engines
- **Crawl Frequency**: How often search engines crawl the sitemap
- **Error Rate**: Number of URLs with crawl errors
- **Discovery Time**: Time for new URLs to be discovered

### Optimization Targets
- 95%+ indexing rate for important pages
- Daily crawling of high-priority content
- <1% error rate
- <24 hours discovery time for new content

## Commands

### Generation
```bash
npm run sitemap:generate    # Generate with SEO analysis
npm run sitemap            # Basic generation
```

### Build Integration
```bash
npm run build              # Includes sitemap generation
```

## Troubleshooting

### Common Issues

1. **Missing URLs**: Check data source availability
2. **Large File Size**: Consider splitting into multiple sitemaps
3. **Crawl Errors**: Verify URL accessibility
4. **Indexing Issues**: Check robots.txt and server response codes

### Debug Commands
```bash
# Check sitemap structure
curl -s https://www.cdlhelp.com/sitemap.xml | head -20

# Validate XML structure
xmllint --noout public/sitemap.xml

# Check file sizes
ls -la public/sitemap*.xml
```

## Future Enhancements

### Planned Optimizations
1. **Image Sitemaps**: Add image URLs for better image SEO
2. **Video Sitemaps**: Include video content metadata
3. **News Sitemaps**: Implement for time-sensitive content
4. **Mobile Sitemaps**: Optimize for mobile-first indexing

### Advanced Features
1. **Dynamic Priorities**: AI-based priority calculation
2. **Real-time Updates**: Webhook-triggered regeneration
3. **A/B Testing**: Sitemap structure optimization
4. **Performance Analytics**: Advanced crawl behavior analysis

## API Dependencies

### External Services
- **Strapi CMS**: Article content and metadata
- **GraphQL API**: CDL school data
- **File System**: Pre-trip inspection structure

### Fallback Strategies
- Cached data for offline generation
- Static fallbacks for API failures
- Graceful degradation of features

---

For technical support or questions about sitemap implementation, please refer to the development team or create an issue in the project repository. 