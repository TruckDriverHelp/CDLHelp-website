# Hreflang Implementation Guide for CDLHelp

## Overview

This guide documents the proper implementation of hreflang tags for the CDLHelp multilingual website to ensure search engines show the correct language version to users.

## Supported Languages

CDLHelp supports 8 languages:
- `en` - English (default, no URL prefix)
- `ru` - Russian (/ru/)
- `uk` - Ukrainian (/uk/)
- `ar` - Arabic (/ar/)
- `ko` - Korean (/ko/)
- `zh` - Chinese (/zh/)
- `tr` - Turkish (/tr/)
- `pt` - Portuguese (/pt/)

## URL Structure

### Correct URL Format
```
English:     https://www.cdlhelp.com/page-name
Other langs: https://www.cdlhelp.com/{lang}/page-name
```

### Important Rules
1. **No trailing slashes** (except for homepage)
2. **English has no locale prefix**
3. **All URLs must return HTTP 200 status**
4. **Use absolute URLs only**

## Implementation

### 1. SEOHead Component

The `SEOHead` component automatically generates hreflang tags:

```tsx
import { SEOHead } from '../src/shared/ui/SEO';

// In your page component:
<SEOHead
  title="Your Page Title"
  description="Your page description"
  alternateLinks={alternateLinks} // Optional, auto-generated if not provided
/>
```

### 2. Auto-Generated Hreflang

The component automatically generates hreflang links based on the current URL:

```html
<!-- For page: /download -->
<link rel="alternate" href="https://www.cdlhelp.com/download" hrefLang="x-default" />
<link rel="alternate" href="https://www.cdlhelp.com/download" hrefLang="en" />
<link rel="alternate" href="https://www.cdlhelp.com/ru/download" hrefLang="ru" />
<link rel="alternate" href="https://www.cdlhelp.com/uk/download" hrefLang="uk" />
<link rel="alternate" href="https://www.cdlhelp.com/ar/download" hrefLang="ar" />
<link rel="alternate" href="https://www.cdlhelp.com/ko/download" hrefLang="ko" />
<link rel="alternate" href="https://www.cdlhelp.com/zh/download" hrefLang="zh" />
<link rel="alternate" href="https://www.cdlhelp.com/tr/download" hrefLang="tr" />
<link rel="alternate" href="https://www.cdlhelp.com/pt/download" hrefLang="pt" />
```

### 3. Custom Alternate Links

For pages with different URL patterns across languages:

```javascript
const alternateLinks = {
  'en': '/frequently-asked-questions',
  'ru': '/ru/chasto-zadavaemye-voprosy',
  'uk': '/uk/chasti-zapytannya',
  'ar': '/ar/alas-ila-alshaeia-musaedat-cdl',
  'ko': '/ko/jaju-mudneun-jilmun-cdl-doum',
  'zh': '/zh/changjian-wenti-cdl-bangzhu',
  'tr': '/tr/sikca-sorulan-sorular',
  'pt': '/pt/perguntas-frequentes'
};

<SEOHead
  title={title}
  description={description}
  alternateLinks={alternateLinks}
/>
```

## Common Issues and Solutions

### 1. Trailing Slash Redirects

**Problem**: URLs with trailing slashes redirect to non-trailing versions
```
❌ https://www.cdlhelp.com/page/ → https://www.cdlhelp.com/page
```

**Solution**: Always use URLs without trailing slashes in hreflang tags

### 2. Missing x-default

**Problem**: No fallback for unsupported languages

**Solution**: Always include x-default pointing to English version:
```html
<link rel="alternate" href="https://www.cdlhelp.com/page" hrefLang="x-default" />
```

### 3. Broken Language Versions

**Problem**: Hreflang points to non-existent pages

**Solution**: Only include hreflang for pages that exist in all languages

### 4. Relative URLs

**Problem**: Using relative URLs in hreflang
```html
❌ <link rel="alternate" href="/ru/page" hrefLang="ru" />
```

**Solution**: Always use absolute URLs
```html
✅ <link rel="alternate" href="https://www.cdlhelp.com/ru/page" hrefLang="ru" />
```

## Testing Hreflang Implementation

### 1. Manual Testing
- View page source and check hreflang tags
- Verify all URLs return HTTP 200
- Ensure reciprocal linking (all versions link to each other)

### 2. Google Search Console
- Use URL Inspection tool
- Check for hreflang errors in Coverage report

### 3. Third-Party Tools
- Use Semrush Site Audit
- Try hreflang validator tools
- Check with Screaming Frog SEO Spider

## Best Practices

1. **Consistency**: Keep URL structure consistent across languages
2. **Reciprocity**: Every language version must link to all others
3. **Self-Reference**: Include hreflang for the current page's language
4. **Canonicals**: Each language version should have its own canonical URL
5. **Sitemaps**: Include hreflang in XML sitemaps

## Middleware Configuration

Ensure the Next.js middleware properly handles redirects:

```javascript
// middleware.js
export function middleware(request) {
  const url = request.nextUrl.clone();
  
  // Remove trailing slashes (except for homepage)
  if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1);
    return NextResponse.redirect(url);
  }
  
  // Continue with locale handling...
}
```

## Monitoring

Regularly check for hreflang issues:
1. Set up Google Search Console alerts
2. Run monthly Semrush audits
3. Monitor organic traffic by language
4. Check for indexing issues per locale

## Support

For hreflang issues:
1. Check this documentation first
2. Validate with online tools
3. Review Google's guidelines: https://support.google.com/webmasters/answer/189077
4. Test changes in staging before production