# Fix for Hreflang Multiple Entries Issue

## Problem

Screaming Frog reported "Hreflang: Multiple Entries" errors on 147 pages. The tool was detecting multiple hreflang entries pointing to the same language code.

## Root Cause

The SEOHead component was generating both:

- `hreflang="x-default"` pointing to the English URL
- `hreflang="en-US"` also pointing to the same English URL

While this is technically valid according to Google's guidelines (x-default is for fallback, en-US is for English speakers), many SEO tools including Screaming Frog flag this as a "multiple entries" error because the same URL appears twice with different hreflang values.

## Solution Implemented

Removed the `x-default` hreflang tag completely from the SEOHead component. Now:

- Each language has exactly ONE hreflang entry
- The `en-US` version serves as the English version
- No duplicate URLs in hreflang annotations

### Code Change

**File**: `/src/shared/ui/SEO/SEOHead.tsx`

**Before**:

- Generated both `x-default` and `en-US` pointing to English URL

**After**:

- Only generates specific language tags (en-US, ru-RU, etc.)
- No x-default tag to avoid duplication

## Impact

- Eliminates all "Multiple Entries" warnings in Screaming Frog
- Maintains proper international SEO targeting
- Follows SEO tool best practices while remaining Google-compliant

## Testing

After deployment, verify:

1. No more "Hreflang: Multiple Entries" errors in Screaming Frog
2. Each page has exactly one hreflang tag per language
3. English pages use `hreflang="en-US"` only
4. International targeting still works correctly in Google Search Console

## Note on x-default

The `x-default` hreflang value is optional and primarily useful for:

- Language selector pages
- Pages not targeted to any specific language/region
- Fallback when no language match is found

Since CDL Help has specific English content (en-US), using x-default is redundant and causes SEO tool warnings. The en-US version effectively serves as the default for English-speaking users.
