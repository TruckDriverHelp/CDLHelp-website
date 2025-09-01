# Technical Specifications and Standards (2025)

## XML Sitemap Protocol Specifications

### File Requirements

#### Size Limits:

- **Maximum file size**: 50MB (52,428,800 bytes) uncompressed
- **Maximum URLs per sitemap**: 50,000 URLs
- **Recommended size**: Keep under 10MB for faster processing
- **Compression**: Can use gzip to reduce file size (must retain .xml.gz extension)

#### Character Encoding:

- **Required encoding**: UTF-8
- **XML declaration**: `<?xml version="1.0" encoding="UTF-8"?>`
- **Special characters**: Must be entity-escaped
  - `&` → `&amp;`
  - `<` → `&lt;`
  - `>` → `&gt;`
  - `"` → `&quot;`
  - `'` → `&apos;`

#### URL Requirements:

- Must be absolute URLs (include protocol and domain)
- Must be properly URL-encoded (RFC-3986)
- Maximum URL length: 2,048 characters
- Must belong to the same domain/subdomain (unless using sitemap index)

## Standard Sitemap Structure

### Basic XML Structure:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.example.com/page</loc>
    <lastmod>2025-01-15T12:00:00+00:00</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### Element Specifications:

#### `<loc>` (Required)

- **Purpose**: Specifies the URL of the page
- **Format**: Absolute URL
- **Example**: `<loc>https://www.cdlhelp.com/schools</loc>`

#### `<lastmod>` (Optional but Recommended)

- **Purpose**: Last modification date of the page
- **Format**: W3C Datetime format (YYYY-MM-DD or full ISO 8601)
- **Examples**:
  - Date only: `2025-01-15`
  - Date and time: `2025-01-15T09:30:47+00:00`
  - With timezone: `2025-01-15T09:30:47-08:00`

#### `<changefreq>` (Optional)

- **Purpose**: Hint about change frequency
- **Valid values**:
  - `always` - Documents change each time accessed
  - `hourly` - Hourly changes
  - `daily` - Daily changes
  - `weekly` - Weekly changes
  - `monthly` - Monthly changes
  - `yearly` - Yearly changes
  - `never` - Archived URLs

#### `<priority>` (Optional)

- **Purpose**: Relative importance within your site
- **Range**: 0.0 to 1.0
- **Default**: 0.5
- **Usage**: Homepage typically 1.0, less important pages lower

## Extended Sitemap Types

### Image Sitemap Extensions

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://www.cdlhelp.com/page</loc>
    <image:image>
      <image:loc>https://www.cdlhelp.com/image.jpg</image:loc>
      <image:caption>CDL Training Center</image:caption>
      <image:title>Professional CDL Training</image:title>
      <image:geo_location>Austin, Texas</image:geo_location>
      <image:license>https://www.cdlhelp.com/license</image:license>
    </image:image>
  </url>
</urlset>
```

**Specifications**:

- Maximum 1,000 images per page
- All image URLs must be accessible
- Supported formats: JPEG, PNG, GIF, BMP, WebP, SVG
- Image extensions are optional but improve image search visibility

### Video Sitemap Extensions

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>https://www.cdlhelp.com/training-video</loc>
    <video:video>
      <video:thumbnail_loc>https://www.cdlhelp.com/thumb.jpg</video:thumbnail_loc>
      <video:title>CDL Pre-Trip Inspection Guide</video:title>
      <video:description>Complete guide to CDL pre-trip inspection</video:description>
      <video:content_loc>https://www.cdlhelp.com/video.mp4</video:content_loc>
      <video:duration>600</video:duration>
      <video:publication_date>2025-01-15T08:00:00+00:00</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:tag>CDL</video:tag>
      <video:tag>training</video:tag>
      <video:category>Education</video:category>
    </video:video>
  </url>
</urlset>
```

**Required Elements**:

- `thumbnail_loc`: Preview image URL
- `title`: Video title (max 100 characters)
- `description`: Video description (max 2048 characters)
- Either `content_loc` or `player_loc`

**Optional Elements**:

- `duration`: In seconds (28-28800)
- `expiration_date`: When video expires
- `rating`: 0.0-5.0
- `view_count`: Number of views
- `publication_date`: First publication date
- `family_friendly`: yes/no
- `restriction`: Country restrictions
- `platform`: Platform restrictions
- `requires_subscription`: yes/no
- `uploader`: Video uploader info
- `live`: yes/no for live content
- `tag`: Maximum 32 tags

### News Sitemap Specifications

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  <url>
    <loc>https://www.cdlhelp.com/news/article</loc>
    <news:news>
      <news:publication>
        <news:name>CDL Help News</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>2025-01-15T12:00:00Z</news:publication_date>
      <news:title>New CDL Requirements for 2025</news:title>
      <news:keywords>CDL, requirements, 2025, trucking</news:keywords>
    </news:news>
  </url>
</urlset>
```

**Requirements**:

- Only include articles from last 2 days
- Must be included in Google News
- Maximum 1,000 URLs
- Publication name and language required

## Multilingual Sitemap Specifications

### Hreflang in Sitemaps

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://www.cdlhelp.com/page</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://www.cdlhelp.com/page"/>
    <xhtml:link rel="alternate" hreflang="es" href="https://www.cdlhelp.com/es/page"/>
    <xhtml:link rel="alternate" hreflang="fr" href="https://www.cdlhelp.com/fr/page"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://www.cdlhelp.com/page"/>
  </url>
</urlset>
```

**Hreflang Requirements**:

- Use ISO 639-1 language codes
- Use ISO 3166-1 Alpha 2 country codes
- Include all language versions
- Include x-default for fallback
- Must be reciprocal (bidirectional)

## Sitemap Index Specifications

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.cdlhelp.com/sitemap-pages.xml</loc>
    <lastmod>2025-01-15T12:00:00Z</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://www.cdlhelp.com/sitemap-images.xml</loc>
    <lastmod>2025-01-15T12:00:00Z</lastmod>
  </sitemap>
</sitemapindex>
```

**Index Requirements**:

- Same size limits apply (50MB, 50,000 sitemaps)
- Can reference sitemaps on different domains (with verification)
- Must use `<sitemapindex>` root element
- Each referenced sitemap must be valid

## Validation Requirements

### XML Validation:

1. Well-formed XML structure
2. Proper namespace declarations
3. Valid encoding
4. Closed tags
5. Proper nesting

### Content Validation:

1. Valid URLs (accessible, correct protocol)
2. Correct date formats
3. Valid priority values (0.0-1.0)
4. Valid changefreq values
5. Proper escaping of special characters

### Performance Validation:

1. File size under limits
2. URL count under limits
3. Response time under 10 seconds
4. Gzip compression working correctly
5. Proper HTTP headers

## HTTP Headers for Sitemaps

### Recommended Headers:

```
Content-Type: application/xml; charset=utf-8
Cache-Control: max-age=3600
Last-Modified: Wed, 15 Jan 2025 12:00:00 GMT
ETag: "33a64df551425fcc55e4d42a0"
Content-Encoding: gzip (if compressed)
```

### Compression Headers:

```
Content-Encoding: gzip
Vary: Accept-Encoding
```

## Robots.txt Integration

### Sitemap Declaration:

```
User-agent: *
Sitemap: https://www.cdlhelp.com/sitemap.xml
Sitemap: https://www.cdlhelp.com/sitemap-index.xml
```

**Best Practices**:

- List all sitemap index files
- Use absolute URLs
- Can specify multiple sitemaps
- Place at any position in robots.txt
