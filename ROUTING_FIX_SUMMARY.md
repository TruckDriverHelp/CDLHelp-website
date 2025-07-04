# Article Routing Fix Summary

## Debugging Techniques Added

### 1. Enhanced Console Logging in getStaticProps

- Logs the slug and locale being fetched
- Shows GraphQL response status and errors
- Logs all articles found and their properties
- Falls back to REST API for debugging if GraphQL fails
- Shows which article is selected and why

### 2. Enhanced Console Logging in getStaticPaths

- Shows the API URL being used
- Logs total articles found
- Shows details of first few articles
- Logs each path being generated
- Handles errors gracefully with fallback

### 3. Debug API Endpoint (/api/debug-article)

Access: `http://localhost:3000/api/debug-article?slug=YOUR_SLUG&locale=en`

Tests multiple scenarios:

- Fetches with locale filter
- Fetches without locale (all locales)
- Tests blog_page filter
- Compares REST API vs GraphQL results
- Provides recommendations based on findings

### 4. Test Scripts

- `/scripts/test-static-generation.js` - Tests article routing and static generation
- `/scripts/test-article-routing.js` - Shows expected URLs for all articles

### 5. Common Issues and Solutions

**Issue: Article not found**

- Check if article exists in Strapi
- Verify locale is correct
- Check blog_page value - if true, should be at /blog/[slug]
- Use debug API to diagnose

**Issue: 404 on build**

- Check getStaticPaths is generating the path
- Verify filters in getStaticPaths query
- Check fallback setting (use 'blocking' for production)

## Issues Fixed

### 1. TypeError on Regular Article Pages (/[slug])

**Error**: `Cannot read properties of undefined (reading 'forEach')` on line 67 of `/pages/[slug].jsx`

**Cause**: When `getStaticProps` encountered an error, it only returned `{ props: { error: error.message } }` without the required `alternateLinks` prop.

**Fix**:

- Added default value for `alternateLinks` parameter: `alternateLinks = []`
- Improved error handling in `getStaticProps` to include all required props
- Added null check for `article` before rendering content
- Added optional chaining for `article.blocks?.map()`

### 2. Blog Article Pages (/blog/[slug]) Not Loading

**Issue**: Articles with `blog_page=true` were returning 404 errors

**Fixes Applied**:

- Corrected GraphQL field names in queries (e.g., `richtext` not `richTextMarkdown`, `Media` not `media`)
- Fixed locale handling for English articles (using `undefined` for default locale)
- Added extensive logging in `getStaticPaths` and `getStaticProps`
- Set `fallback: 'blocking'` to handle new blog posts without rebuilding

### 3. Routing Logic

**Current Implementation**:

- Articles with `blog_page=true` → served at `/blog/[slug]`
- Articles with `blog_page=false` or `null` → served at `/[slug]`
- Blog listing page (`/blog`) shows articles where `blog_post=true`

## Key Changes Made

### `/pages/[slug].jsx`

```javascript
// Added default value for alternateLinks
const PostDetailView = ({ slug, article, locale, alternateLinks = [] }) => {

// Added null check for article
if (!article) {
  return (
    <Layout>
      <Navbar alternateLinks={alternateLinks} />
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <h1>Article not found</h1>
        <p>The requested article could not be found.</p>
      </div>
      <Footer />
    </Layout>
  );
}

// Improved error handling in getStaticProps
} catch (error) {
  console.error(`Error in getStaticProps for slug ${slug}:`, error);
  return {
    props: {
      slug,
      article: null,
      locale: locale || 'en',
      alternateLinks: [],
      error: error.message,
      ...(await serverSideTranslations(locale ?? 'en', [
        'navbar',
        'footer',
        'cookie',
        'article'
      ])),
    }
  }
}
```

### `/pages/blog/[slug].js`

```javascript
// Added default value for alternateLinks
const BlogPostDetailView = ({ slug, article, locale, alternateLinks = {} }) => {

// Filter for blog_page=true in getStaticPaths
const blogArticles = articles.filter(article => article.attributes.blog_page === true);

// Handle locale properly for English
if (locale === 'en') {
  paths.push({
    params: { slug: article.attributes.slug },
    locale: undefined // This makes it use the default locale
  });
}
```

### `/lib/graphql/articleBySlug.js`

Corrected field names to match Strapi schema:

- `richTextMarkdown` → `richtext`
- `media` → `Media`

## Testing

Created test script at `/scripts/test-article-routing.js` to verify article routing:

- Lists all articles grouped by type (blog vs regular)
- Shows expected URLs for each article
- Provides summary of article counts

## Next Steps

1. Deploy and test that both regular and blog articles load correctly
2. Verify that the blog listing page shows only articles with `blog_post=true`
3. Monitor for any new errors in production
4. Consider adding automated tests for the routing logic
