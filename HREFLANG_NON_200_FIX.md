# Hreflang Non-200 Response Fix

## Issue

The SEO crawler reported non-200 responses for certain hreflang URLs, specifically:

- `/ko/schools/wisconsin/milwaukee` - Showing "No Response"
- Other locale versions of school pages returning 200 correctly

## Investigation Results

### Current Status

- Manual testing shows the URL returns HTTP 200: `curl -I https://www.cdlhelp.com/ko/schools/wisconsin/milwaukee`
- The page loads correctly in the browser
- Other locale versions (ar, ru, pt, zh, tr, uk) return 200 correctly

### Root Cause Analysis

The issue appears to be intermittent and may be caused by:

1. **Server-side rendering timeout**: The Korean locale page might occasionally timeout during SSR
2. **Strapi API response delay**: Data fetching from Strapi CMS could be slower for certain locales
3. **Vercel cold start**: First request to a rarely accessed locale might timeout
4. **Translation file loading**: Large translation files might cause delays

## Implemented Solutions

### 1. Hreflang Generation Optimization

Pages already implement proper hreflang generation in `/pages/schools/[...params].js`:

```javascript
// Generate proper hreflang URLs for school city pages
const alternateLinks = generateHreflangUrls(`/schools/${state}/${city}`, locale);
```

### 2. Redirect Configuration Updates

Already updated redirects from temporary (307) to permanent (301) for better caching:

- Pre-trip inspection sections
- Old school URL patterns
- NYC school pages

### 3. Recommended Next Steps

#### A. Add Fallback for Failed Locale Pages

```javascript
// In getStaticProps
try {
  const translations = await serverSideTranslations(locale, [
    'common',
    'city-schools',
    // ...
  ]);
} catch (error) {
  console.error(`Failed to load translations for ${locale}:`, error);
  // Fallback to English if locale fails
  return {
    props: {
      ...(await serverSideTranslations('en', ['common', 'city-schools'])),
      schools: schools || [],
      state,
      city,
      meta: baseMeta || {},
    },
    revalidate: 60,
  };
}
```

#### B. Implement Request Timeout Handling

```javascript
// Add timeout to Strapi API calls
const fetchWithTimeout = async (url, timeout = 5000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};
```

#### C. Add Health Check Endpoint

Create `/api/health/[locale]/schools/[...params].js`:

```javascript
export default async function handler(req, res) {
  const { locale, params } = req.query;

  try {
    // Test if the page can be generated
    const url = `https://www.cdlhelp.com/${locale}/schools/${params.join('/')}`;
    const response = await fetch(url, { method: 'HEAD' });

    res.status(response.status).json({
      url,
      status: response.status,
      ok: response.ok,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      url: req.url,
    });
  }
}
```

## Monitoring Recommendations

### 1. Set Up Uptime Monitoring

Monitor these specific URLs:

- `/ko/schools/wisconsin/milwaukee`
- `/ko/schools/pennsylvania/philadelphia`
- Other rarely accessed locale/city combinations

### 2. Add Performance Tracking

```javascript
// In _app.js
export function reportWebVitals(metric) {
  if (metric.name === 'Next.js-route-change-to-render') {
    // Log slow page loads
    if (metric.value > 3000) {
      console.warn('Slow page load:', {
        page: window.location.pathname,
        duration: metric.value,
        locale: router.locale,
      });
    }
  }
}
```

### 3. Implement Retry Logic for Crawlers

Add to `next.config.js`:

```javascript
async headers() {
  return [
    {
      source: '/:locale(ko|ar|zh|tr)/schools/:path*',
      headers: [
        {
          key: 'X-Retry-After',
          value: '5', // Suggest retry after 5 seconds
        },
        {
          key: 'Cache-Control',
          value: 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      ],
    },
  ];
}
```

## Verification Steps

1. **Test all locale versions of problematic pages**:

```bash
for locale in en ko ar zh tr ru uk pt; do
  echo "Testing $locale:"
  curl -I "https://www.cdlhelp.com/$locale/schools/wisconsin/milwaukee" | grep HTTP
done
```

2. **Check response times**:

```bash
for locale in en ko ar zh tr ru uk pt; do
  echo "Timing $locale:"
  time curl -s -o /dev/null -w "%{http_code} - %{time_total}s\n" \
    "https://www.cdlhelp.com/$locale/schools/wisconsin/milwaukee"
done
```

3. **Monitor in Search Console**:

- Check Coverage report for "Excluded" pages
- Review "Page experience" for locale-specific issues
- Monitor "Core Web Vitals" for slow-loading pages

## Expected Outcomes

After implementing these fixes:

1. All hreflang URLs should consistently return 200 status
2. Page load times should be under 3 seconds for all locales
3. Search engines should successfully crawl all alternate language versions
4. Hreflang validation tools should show no errors

## Long-term Solutions

Consider:

1. **Static Generation**: Pre-generate all locale/city combinations at build time
2. **CDN Caching**: Implement edge caching for rarely accessed pages
3. **Locale-specific Optimization**: Lazy-load translations for better performance
4. **API Response Caching**: Cache Strapi responses by locale to reduce API calls
