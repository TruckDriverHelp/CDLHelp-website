# Internal Redirect Optimization

## Overview

Fixed internal redirection issues where URLs were redirecting to other URLs, causing unnecessary latency and inefficiency for search engines.

## Issues Identified

### 1. Trailing Slash Redirects (308 Permanent)

- **URLs**: `/ar/`, `/ko/`, `/pt/`, `/ru/`, `/tr/`, `/zh/`, `/uk/`
- **Issue**: URLs with trailing slashes redirect to versions without
- **Cause**: Next.js config has `trailingSlash: false`
- **Status**: Expected behavior - Next.js automatically handles this

### 2. Pre-Trip Inspection Redirects (307 → 301)

- **URLs**: All individual pre-trip sections (e.g., `/pre-trip-inspection/1-tractor-front`)
- **Issue**: Individual section pages redirect to `/pre-trip-inspection/guide`
- **Fix**: Changed from temporary (307) to permanent (301) redirects
- **Reason**: These pages don't exist and won't be created

### 3. School State Redirects (307 → 301)

- **URLs**: `/school/[state]` (e.g., `/school/california`)
- **Issue**: Old URL pattern redirects to `/schools`
- **Fix**: Changed from temporary (307) to permanent (301) redirects
- **Reason**: These use outdated URL structure; correct pattern is `/schools/[state]`

### 4. New York City School Redirects (307 → 301)

- **URLs**: `/schools/new-york/new-york` (all locales)
- **Issue**: Non-existent NYC page redirects to state page
- **Fix**: Changed from temporary (307) to permanent (301) redirects
- **Reason**: NYC doesn't have a separate schools listing page

## Changes Made

### Modified: `next.config.redirects.js`

```javascript
// Pre-trip inspection sections - changed to permanent
redirects.push({
  source: `/pre-trip-inspection/${section}`,
  destination: `/pre-trip-inspection/guide`,
  permanent: true, // Was: false
});

// School state pages - changed to permanent
redirects.push({
  source: `/school/${state}`,
  destination: '/schools',
  permanent: true, // Was: false
});

// NYC school pages - changed to permanent
redirects.push({
  source: `${prefix}/schools/new-york/new-york`,
  destination: `${prefix}/schools/new-york`,
  permanent: true, // Was: false
});
```

## SEO Impact

### Benefits

1. **301 vs 307**: Permanent redirects pass more link equity
2. **Reduced Latency**: Search engines cache permanent redirects
3. **Clearer Intent**: Signals these URLs are permanently moved
4. **Better Crawl Efficiency**: Reduces unnecessary crawl attempts

### Redirect Types Explained

- **301 (Permanent)**: Page has permanently moved - use for retired URLs
- **307 (Temporary)**: Page temporarily unavailable - use for maintenance
- **308 (Permanent)**: Like 301 but preserves HTTP method

## Recommendations

### 1. Update Internal Links

Instead of linking to redirecting URLs, update links to point directly to final destinations:

- ❌ Don't: Link to `/school/california`
- ✅ Do: Link to `/schools/california`

### 2. Sitemap Updates

Ensure sitemaps only include final destination URLs, not redirecting ones:

- Remove `/school/*` URLs
- Remove individual pre-trip section URLs
- Remove trailing slash versions of locale homepages

### 3. Hreflang Configuration

Already configured in `lib/hreflang-config.js` to exclude:

- `/schools/new-york/new-york`
- Individual pre-trip sections
- Old `/school/` pattern URLs

### 4. Monitor Redirects

Use tools to monitor for new redirect chains:

```bash
# Check for redirect chains
curl -I -L https://www.cdlhelp.com/school/california

# Should show single 301 redirect to /schools
```

## Technical Notes

### Next.js Trailing Slash Behavior

With `trailingSlash: false` in `next.config.js`:

- URLs with trailing slashes automatically redirect (308)
- This is expected and doesn't need fixing
- Ensure internal links never include trailing slashes

### Redirect Performance

- 301 redirects are cached by browsers (permanent)
- 307 redirects are not cached (temporary)
- 308 redirects preserve POST data (rarely needed)

### Search Engine Handling

- Google consolidates signals to canonical URL
- 301 passes ~90-99% of link equity
- 307 passes less link equity (temporary signal)

## Verification

After deployment, verify redirects are working correctly:

```bash
# Test pre-trip redirects
curl -I https://www.cdlhelp.com/pre-trip-inspection/1-tractor-front
# Should return: 301 Moved Permanently
# Location: /pre-trip-inspection/guide

# Test school redirects
curl -I https://www.cdlhelp.com/school/california
# Should return: 301 Moved Permanently
# Location: /schools

# Test NYC redirects
curl -I https://www.cdlhelp.com/schools/new-york/new-york
# Should return: 301 Moved Permanently
# Location: /schools/new-york
```

## Future Considerations

1. **Create NYC Page**: If NYC schools listing is needed, create proper page at `/schools/new-york/new-york-city`
2. **Pre-Trip Sections**: If individual sections are needed, create proper pages instead of redirecting
3. **School State Pages**: Consider creating proper `/schools/[state]` pages with state-specific content
4. **Monitoring**: Set up redirect monitoring in Google Search Console to catch new issues early
