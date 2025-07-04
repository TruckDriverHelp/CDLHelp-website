# Sitemap Implementation

## Overview

This website uses a dynamic sitemap generation system that follows SEO best practices for multilingual websites.

## Features

1. **Dynamic Generation**: Sitemap is generated on-demand from API endpoint
2. **Multilingual Support**: Includes hreflang alternatives for all 8 supported languages
3. **Priority & Frequency**: Different page types have appropriate priority and change frequency
4. **Strapi Integration**: Dynamically fetches articles from CMS
5. **Caching**: Cached for 24 hours to reduce server load

## Endpoints

- **Main Sitemap**: `/api/sitemap.xml`
- **Sitemap Index**: `/api/sitemap-index.xml` (for future expansion)

## Implementation Details

### Page Priorities

- Home: 1.0
- Download: 0.9
- CDL Schools: 0.8
- Articles: 0.7
- Pre-trip: 0.6
- Legal pages: 0.3

### Change Frequencies

- Home: daily
- Download: weekly
- CDL Schools: monthly
- Articles: monthly
- Pre-trip: yearly
- Legal: yearly

### Hreflang Implementation

Each URL entry includes hreflang alternatives for all supported languages:

- en (English)
- ru (Russian)
- uk (Ukrainian)
- ar (Arabic)
- ko (Korean)
- zh (Chinese)
- tr (Turkish)
- pt (Portuguese)

## Testing

To test the sitemap locally:

1. Run `npm run dev`
2. Visit `http://localhost:3000/api/sitemap.xml`
3. Validate using Google's sitemap testing tool

## Production

The sitemap is automatically available at:

- https://www.cdlhelp.com/api/sitemap.xml

It's referenced in:

- `/public/robots.txt`
- Google Search Console (needs to be submitted)

## Future Enhancements

1. **Split by content type**: As the site grows, split into multiple sitemaps
2. **Image sitemap**: Add image sitemap for better image SEO
3. **News sitemap**: If adding news/blog section
4. **Video sitemap**: For video content
5. **Compression**: Gzip compression for large sitemaps

## Maintenance

- The sitemap automatically updates when new content is added to Strapi
- No manual intervention required
- Monitor Search Console for any sitemap errors
