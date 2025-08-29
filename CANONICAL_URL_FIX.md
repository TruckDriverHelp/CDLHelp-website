# Canonical URL Fix for Non-English Pages

## Problem

Screaming Frog reported that 105 non-English pages were not using their own canonical URLs in hreflang annotations. These pages were incorrectly canonicalizing to their English equivalents instead of themselves.

### Affected Pages

All non-English versions of:

- Contact page (`/ar/contact`, `/ru/contact`, etc.)
- Companies page (`/ar/companies`, `/ru/companies`, etc.)
- Pre-trip inspection guide (`/ar/pre-trip-inspection/guide`, etc.)
- Road signs test (`/ar/road-signs/test`, etc.)
- School pages (`/ar/schools/...`, `/ru/schools/...`, etc.)

## Root Cause

The SEOHead component was not properly including the locale in the canonical URL for non-English pages. When `router.asPath` returned just the path without locale (common in static generation), the canonical URL would default to the English version.

## Solution Implemented

Updated the canonical URL generation logic in `/src/shared/ui/SEO/SEOHead.tsx` to ensure non-English pages always include their locale in the canonical URL.

### Code Change

**Before:**

```typescript
const cleanPath = router.asPath.split('?')[0].split('#')[0];
const fullUrl = url || `${baseUrl}${cleanPath}`;
const canonicalUrl = canonical || fullUrl;
```

**After:**

```typescript
const cleanPath = router.asPath.split('?')[0].split('#')[0];
// Ensure the canonical URL includes the locale for non-English pages
const localizedPath =
  currentLocale === 'en'
    ? cleanPath
    : cleanPath.startsWith(`/${currentLocale}`)
      ? cleanPath
      : `/${currentLocale}${cleanPath}`;
const fullUrl = url || `${baseUrl}${localizedPath}`;
const canonicalUrl = canonical || fullUrl;
```

## How It Works

1. For English pages (`locale === 'en'`): Use the path as-is
2. For non-English pages:
   - Check if the path already includes the locale prefix
   - If not, prepend the locale to ensure correct canonical URL
   - This handles both cases where router.asPath includes or excludes the locale

## Impact

- All 105 non-English pages now correctly canonicalize to themselves
- Proper self-referencing canonical URLs for international SEO
- Hreflang annotations now use the correct canonical URLs
- Prevents duplicate content issues in search engines

## Testing

After deployment, verify:

1. Arabic page `/ar/contact` has canonical `https://www.cdlhelp.com/ar/contact`
2. Russian page `/ru/companies` has canonical `https://www.cdlhelp.com/ru/companies`
3. All non-English pages self-canonicalize correctly
4. English pages continue to work as before

## SEO Benefits

- Clearer signals to search engines about page language/region
- Prevents consolidation of ranking signals to English pages only
- Improves international search visibility
- Resolves Screaming Frog "Not using canonical" warnings
