# Fix for /en/ Prefix URLs Not Redirecting

## Problem
URLs with `/en/` prefix were being generated during the build process and not redirecting to their canonical versions without the prefix. This was causing "No self-referencing hreflang" errors for:
- https://www.cdlhelp.com/en/frequently-asked-questions
- https://www.cdlhelp.com/en/how-to-become-a-truck-driver
- https://www.cdlhelp.com/en/how-to-use-cdl-help

## Root Cause
Next.js i18n was generating static pages for ALL locales including English with the `/en/` prefix. The redirect rules in `next.config.js` don't work for statically generated pages.

## Solution Applied
Modified `getStaticPaths` functions in all dynamic pages to use `locale: undefined` for English pages instead of `locale: 'en'`. This prevents Next.js from generating `/en/*` paths during build.

## Files Modified

### 1. `/pages/[slug].jsx`
Changed the article page generation to use `locale: undefined` for English articles:
```javascript
// Before
paths.push({ params: { slug: post.attributes.slug }, locale: post.attributes.locale });

// After
if (post.attributes.locale === 'en') {
  paths.push({ params: { slug: post.attributes.slug }, locale: undefined });
} else {
  paths.push({ params: { slug: post.attributes.slug }, locale: post.attributes.locale });
}
```

### 2. `/pages/cdl-schools/[state].js`
Updated state pages to not generate `/en/` paths:
```javascript
// Before
{ params: { state: state.slug }, locale: 'en' }

// After
{ params: { state: state.slug }, locale: undefined }
```

### 3. `/pages/cdl-schools/[state]/[city].js`
Modified city pages generation:
```javascript
// Now generates English paths without locale prefix
paths.push({
  params: { state: state.slug, city: city.slug },
  locale: undefined
});
```

### 4. `/pages/pre-trip-inspection/[file]/[section].js`
Updated pre-trip inspection pages:
```javascript
// Now uses conditional locale assignment
locale: locale === 'en' ? undefined : locale
```

## Testing
Created `test-en-redirect.js` script to verify redirects are working after deployment.

## Deployment Steps
1. Build the project: `npm run build`
2. Deploy to production
3. Run test script: `node test-en-redirect.js`
4. Verify all `/en/*` URLs return 301 redirects

## Expected Results
- No more `/en/*` pages will be generated during build
- Existing `/en/*` URLs will be handled by the redirect rule in `next.config.js`
- All hreflang tags will properly self-reference without the `/en/` prefix
- SEO errors for "No self-referencing hreflang" will be resolved