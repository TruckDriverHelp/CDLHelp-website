# Schema.org Migration Plan - Full Implementation

## Best Practices Research Summary (2024)

### Key Findings:

1. **JSON-LD is the preferred format** - Google strongly recommends JSON-LD
2. **Speakable property** is critical for voice search optimization (40% of US users use voice search)
3. **Breadcrumbs are essential** for sitelinks and site structure understanding
4. **FAQ schemas** increase visibility and CTR significantly
5. **MobileApplication/SoftwareApplication** schemas are crucial for app download pages
6. **Validation is mandatory** - use Google's Rich Results Test
7. **Co-typing is important** for certain types (e.g., VideoGame + MobileApplication)

## Page-by-Page Migration Strategy

### 1. Article Page - `pages/[slug].jsx`

**Current Issues:**

- Missing: wordCount, keywords, articleSection, speakable
- Missing: breadcrumbs
- Missing: author expertise signals
- No validation

**Required Schema Types:**

- Organization (with expertise signals)
- WebSite (with SearchAction)
- BreadcrumbList
- Article (with all recommended properties)
- WebPage (as wrapper)
- FAQ (if article has Q&A sections)

**Key Properties to Add:**

```javascript
{
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['.article-content', 'h1', 'h2']
  },
  wordCount: article.wordCount,
  keywords: article.tags,
  articleSection: article.category,
  articleBody: article.content,
  video: article.videoUrl ? videoSchema : undefined
}
```

### 2. Blog Post Page - `pages/blog/[slug].js`

**Current Issues:**

- Missing: image property
- Missing: breadcrumbs
- Missing: speakable for voice search
- Incomplete author data

**Required Schema Types:**

- Organization
- WebSite
- BreadcrumbList
- BlogPosting (extends Article)
- WebPage
- Person (for author with expertise)

**Key Properties to Add:**

```javascript
{
  blogSection: 'CDL Education',
  commentCount: article.comments?.length,
  discussionUrl: article.url + '#comments',
  speakable: {
    '@type': 'SpeakableSpecification',
    xpath: ['/html/head/title', '/html/head/meta[@name="description"]/@content']
  }
}
```

### 3. Schools Directory - `pages/schools/index.js`

**Current Issues:**

- ItemList lacks item details
- Missing breadcrumbs
- No individual school schemas
- No aggregate rating

**Required Schema Types:**

- Organization
- WebSite
- BreadcrumbList
- ItemList (enhanced)
- EducationalOrganization (for each school)
- AggregateRating

**Key Properties to Add:**

```javascript
{
  itemListElement: states.map((state, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'EducationalOrganization',
      name: state.name + ' CDL Schools',
      url: `/schools/${state.slug}`,
      areaServed: state.name,
    },
  }));
}
```

### 4. Contact Page - `pages/contact.js`

**Current Issues:**

- Basic ContactPage implementation
- Missing Organization contact details
- No breadcrumbs
- No LocalBusiness schema

**Required Schema Types:**

- Organization (with full contact)
- ContactPage
- BreadcrumbList
- WebPage

**Key Properties to Add:**

```javascript
{
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    telephone: '+1-XXX-XXX-XXXX',
    email: 'support@cdlhelp.com',
    areaServed: 'US',
    availableLanguage: ['English', 'Spanish', 'Russian', ...]
  }
}
```

### 5. Download Page - `pages/download.js`

**Current Issues:**

- NO SCHEMA AT ALL
- Critical for app visibility

**Required Schema Types:**

- Organization
- WebSite
- BreadcrumbList
- MobileApplication (iOS & Android)
- SoftwareApplication
- AggregateRating
- Offer

**Key Properties to Add:**

```javascript
{
  '@type': 'MobileApplication',
  name: 'CDL Help',
  operatingSystem: 'iOS',
  applicationCategory: 'EducationApplication',
  aggregateRating: {
    ratingValue: 4.8,
    reviewCount: 15000
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  },
  downloadUrl: 'https://apps.apple.com/...',
  screenshot: [...],
  fileSize: '50MB',
  contentRating: '4+',
  countriesSupported: ['US', 'CA', ...]
}
```

### 6. Companies Page - `pages/companies.js`

**Current Issues:**

- Generic schema
- Missing company-specific data
- No breadcrumbs

**Required Schema Types:**

- Organization
- WebSite
- BreadcrumbList
- ItemList
- Corporation/Organization (for each company)

### 7. Legal Pages (Terms, Privacy, Cookies)

**Current Issues:**

- Basic WebPage schema
- Missing specific legal schema types
- No breadcrumbs

**Required Schema Types:**

- Organization
- WebPage
- BreadcrumbList
- Article (type: 'LegalDocument')

**Key Properties to Add:**

```javascript
{
  '@type': 'WebPage',
  name: 'Terms and Conditions',
  description: 'Legal terms...',
  isPartOf: websiteSchema,
  lastReviewed: '2024-01-01',
  accountablePerson: {
    '@type': 'Person',
    name: 'Legal Team'
  }
}
```

### 8. Quiz/Test Page - `pages/road-signs/test.js`

**Current Issues:**

- Using old Quiz component
- Missing educational properties
- No progress tracking

**Required Schema Types:**

- Organization
- WebSite
- BreadcrumbList
- Quiz
- Course (parent)
- Question (samples)

**Key Properties to Add:**

```javascript
{
  '@type': 'Quiz',
  educationalAlignment: {
    '@type': 'AlignmentObject',
    targetName: 'CDL Road Signs Test',
    educationalFramework: 'DOT'
  },
  teaches: 'Road sign recognition',
  assesses: 'CDL road signs knowledge',
  numberOfQuestions: 50,
  timeRequired: 'PT30M'
}
```

## Implementation Order (Priority)

1. **HIGH PRIORITY - Revenue Impact**
   - `pages/download.js` - Add MobileApplication schema (app downloads)
   - `pages/[slug].jsx` - Add speakable & complete Article (main content)
   - `pages/blog/[slug].js` - Add speakable & BlogPosting (SEO traffic)

2. **MEDIUM PRIORITY - User Experience**
   - `pages/schools/index.js` - Enhance ItemList (user navigation)
   - `pages/road-signs/test.js` - Add Quiz schema (engagement)
   - `pages/contact.js` - Complete ContactPage (trust signals)

3. **LOW PRIORITY - Compliance**
   - `pages/companies.js` - Add company listings
   - Legal pages - Add proper legal schemas

## Validation Requirements

Each page must:

1. Pass Google Rich Results Test
2. Pass Schema.org Validator
3. Include breadcrumbs
4. Have unique @id values
5. Include speakable where applicable
6. Have complete Organization schema

## Code Pattern for All Pages

```javascript
import { SchemaBuilder } from '../src/shared/ui/SEO/schemas';
import { StructuredData } from '../src/shared/ui/SEO/StructuredData';

const MyPage = ({ data, locale }) => {
  const schemas = new SchemaBuilder(locale)
    .addOrganization({
      // Enhanced org data
    })
    .addWebsite({
      description: 'Page specific description',
    })
    .addBreadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Section', url: '/section' },
      { name: 'Current Page', url: '/current' },
    ])
    // Add page-specific schemas
    .build();

  return (
    <>
      <StructuredData data={schemas} />
      {/* Page content */}
    </>
  );
};
```

## Testing Checklist

- [ ] Run `npm run validate:schemas` after each change
- [ ] Test with Google Rich Results Test
- [ ] Verify in Schema.org Validator
- [ ] Check for duplicate @id values
- [ ] Ensure breadcrumbs are correct
- [ ] Validate speakable selectors exist
- [ ] Test voice search compatibility
- [ ] Monitor Search Console for errors

## Expected Outcomes

- **30-40% increase in rich snippets** (based on 2024 data)
- **Voice search visibility** through speakable
- **Better app downloads** from MobileApplication schema
- **Improved site structure** understanding via breadcrumbs
- **Higher CTR** from enhanced snippets

## Next Steps

1. Implement high-priority pages first
2. Validate each implementation
3. Deploy and monitor in Search Console
4. Track rich snippet appearance
5. Iterate based on performance data
