# Hreflang Multiple Entries Fix

## Issue Summary

Screaming Frog detected 207 URLs with "Hreflang: Multiple Entries" errors. This occurs when pages declare multiple URLs for the same language code.

## Root Cause

The `SEOHead` component (src/shared/ui/SEO/SEOHead.tsx) automatically generates hreflang links for all 8 supported locales, even when pages don't have translations in those languages. This causes duplicate entries.

## Affected Pages

- School pages (/schools/\*)
- Download page
- Contact page
- CDL Texas page
- Road signs test
- Pre-trip inspection guides
- Companies page

## Quick Fix (Immediate)

Update the `SEOHead` component to only generate hreflang links when explicitly provided:

```javascript
// In src/shared/ui/SEO/SEOHead.tsx, around line 106

// OLD CODE:
const finalAlternateLinks =
  Object.keys(alternateLinks).length > 0
    ? {
        ...alternateLinks,
        [currentLocale]: alternateLinks[currentLocale] || ...
      }
    : generatedAlternateLinks;

// NEW CODE:
const finalAlternateLinks =
  Object.keys(alternateLinks).length > 0
    ? alternateLinks  // Use only provided links, don't auto-generate
    : {}; // Don't generate any if none provided
```

## Proper Fix (Recommended)

### Option 1: Disable Auto-Generation for Non-Translated Pages

1. Add a prop to control auto-generation:

```javascript
// In SEOHead component props
export interface SEOHeadProps {
  // ... existing props
  autoGenerateHreflang?: boolean; // Default to false
}

// In component logic
const shouldAutoGenerate = autoGenerateHreflang ?? false;

const finalAlternateLinks =
  Object.keys(alternateLinks).length > 0
    ? alternateLinks
    : shouldAutoGenerate ? generatedAlternateLinks : {};
```

2. Only enable auto-generation on pages that have translations:

```javascript
// Pages with translations (homepage, articles, etc.)
<SEOHead {...seoData} autoGenerateHreflang={true} />

// Pages without translations (schools, etc.)
<SEOHead {...seoData} /> // No auto-generation
```

### Option 2: Check Page Existence Before Adding Hreflang

Create a configuration that tracks which pages exist in which locales:

```javascript
// lib/locale-pages.js
export const LOCALIZED_PAGES = {
  '/': ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'],
  '/contact': ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'],
  '/download': ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'],
  '/schools': ['en'], // Only English
  '/schools/*': ['en'], // School pages only in English
  // ... etc
};

// In SEOHead, check if locale version exists
const generateSafeAlternateLinks = (path, currentLocale) => {
  const links = {};
  const supportedLocales = getLocalesForPath(path);

  supportedLocales.forEach(locale => {
    if (locale === 'en') {
      links[locale] = path;
    } else {
      links[locale] = `/${locale}${path}`;
    }
  });

  return links;
};
```

### Option 3: Pass Correct alternateLinks from Each Page

Update pages to explicitly pass their available alternate links:

```javascript
// In pages/schools/[...params].js
const alternateLinks = {
  en: `/schools/${state}/${city}`,
  // Only include other locales if they actually exist
};

<SEOHead {...seoData} alternateLinks={alternateLinks} />;
```

## Implementation Priority

1. **Immediate**: Apply Quick Fix to stop duplicate hreflang generation
2. **Next Sprint**: Implement Option 1 (add autoGenerateHreflang prop)
3. **Future**: Consider Option 2 for better maintainability

## Testing

After implementing the fix:

1. Run Screaming Frog again on affected URLs
2. Verify each page only has one hreflang entry per language
3. Check that self-referencing hreflang is still present
4. Validate in Google Search Console's International Targeting report

## Prevention

1. Add hreflang validation to your build process
2. Create unit tests for SEOHead component
3. Document which pages have translations
4. Consider using a CMS field to track available translations
