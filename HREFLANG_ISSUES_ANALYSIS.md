# Hreflang Non-200 Issues Analysis

## Root Causes Identified

### 1. Non-existent City Pages (404s)

The following city pages are referenced in hreflang tags but don't actually exist:

- `/schools/california/los-angeles`
- `/schools/california/sacramento`
- `/schools/texas/houston`
- `/schools/texas/dallas`
- `/schools/new-york/buffalo`
- `/schools/pennsylvania/philadelphia`
- `/schools/washington/seattle`
- `/schools/wisconsin/milwaukee`

**Solution**: Either create these pages or remove them from hreflang references.

### 2. Different Slugs Per Locale

Content pages have different slugs for each locale, not just locale prefixes:

- English: `/what-is-taught-in-cdl-schools`
- Russian: `/ru/o-cdl-shkolakh`
- Korean: `/ko/cdl-haggyoeseoneun-mueos-eul-galeuchimniga`
- etc.

This is managed by Strapi CMS with localized slugs.

## Fixes Needed

### 1. Fix generateHreflangUrls function

The `generateHreflangUrls` function in `/lib/hreflang-config.js` needs to:

- Check if pages actually exist before generating hreflang URLs
- Handle different slug patterns for different page types

### 2. Update School Pages

In `/pages/schools/[...params].js`:

- Only generate hreflang URLs for cities that actually exist
- Handle fallback for non-existent pages

### 3. Content Page Hreflang

For CMS-managed content pages in `/pages/[slug].jsx`:

- The hreflang URLs are already correctly generated from Strapi localizations
- No changes needed here

## Immediate Actions

1. Update hreflang generation to validate page existence
2. Remove non-existent city pages from hreflang tags
3. Ensure all referenced URLs return 200 status
