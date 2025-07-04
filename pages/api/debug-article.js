export default async function handler(req, res) {
  const { slug = 'what-is-taught-in-cdl-schools', locale = 'en' } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const baseUrl = `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/api`;

    console.log(`[Debug API] Testing article: slug=${slug}, locale=${locale}`);

    // Test 1: Fetch with locale
    const localeUrl = `${baseUrl}/articles?filters[slug][$eq]=${slug}&locale=${locale}&populate=*`;
    console.log('[Debug API] Test 1 - With locale:', localeUrl);

    const localeResponse = await fetch(localeUrl, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
      },
    });

    const localeData = await localeResponse.json();
    console.log(`[Debug API] Test 1 result: ${localeData.data?.length || 0} articles`);

    // Test 2: Fetch without locale (all locales)
    const allUrl = `${baseUrl}/articles?filters[slug][$eq]=${slug}&populate=*`;
    console.log('[Debug API] Test 2 - All locales:', allUrl);

    const allResponse = await fetch(allUrl, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
      },
    });

    const allData = await allResponse.json();
    console.log(`[Debug API] Test 2 result: ${allData.data?.length || 0} articles`);

    // Test 3: Check blog_page filter
    const blogFilterUrl = `${baseUrl}/articles?filters[slug][$eq]=${slug}&filters[blog_page][$ne]=true&populate=*`;
    console.log('[Debug API] Test 3 - Blog filter:', blogFilterUrl);

    const blogFilterResponse = await fetch(blogFilterUrl, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
      },
    });

    const blogFilterData = await blogFilterResponse.json();
    console.log(`[Debug API] Test 3 result: ${blogFilterData.data?.length || 0} articles`);

    const articles = allData.data || [];

    if (articles.length === 0) {
      return res.status(404).json({
        error: 'Article not found',
        slug: slug,
      });
    }

    // Map article data
    const articleInfo = articles.map(article => ({
      id: article.id,
      slug: article.attributes.slug,
      title: article.attributes.title,
      locale: article.attributes.locale,
      blog_post: article.attributes.blog_post,
      blog_page: article.attributes.blog_page,
      publishedAt: article.attributes.publishedAt,
      createdAt: article.attributes.createdAt,
      updatedAt: article.attributes.updatedAt,
      localizations: article.attributes.localizations?.data?.map(loc => ({
        id: loc.id,
        locale: loc.attributes.locale,
        slug: loc.attributes.slug,
      })),
      expectedUrl: article.attributes.blog_page
        ? `${article.attributes.locale === 'en' ? '' : `/${article.attributes.locale}`}/blog/${article.attributes.slug}`
        : `${article.attributes.locale === 'en' ? '' : `/${article.attributes.locale}`}/${article.attributes.slug}`,
      shouldAppearOnBlogListing: article.attributes.blog_post === true,
      shouldHaveBlogUrl: article.attributes.blog_page === true,
    }));

    // Also test GraphQL query
    const graphqlUrl = `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/graphql`;
    const graphqlQuery = `
      query GetArticleBySlug($slug: String!, $locale: I18NLocaleCode) {
        articles(
          filters: { slug: { eq: $slug } }
          locale: $locale
        ) {
          data {
            id
            attributes {
              slug
              title
              blog_post
              blog_page
              locale
            }
          }
        }
      }
    `;

    const graphqlResponse = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
      },
      body: JSON.stringify({
        query: graphqlQuery,
        variables: { slug, locale: 'en' },
      }),
    });

    const graphqlData = await graphqlResponse.json();

    return res.status(200).json({
      success: true,
      slug: slug,
      locale: locale,
      tests: {
        withLocale: {
          count: localeData.data?.length || 0,
          articles:
            localeData.data?.map(a => ({
              slug: a.attributes.slug,
              locale: a.attributes.locale,
              blog_page: a.attributes.blog_page,
              blog_post: a.attributes.blog_post,
            })) || [],
        },
        allLocales: {
          count: allData.data?.length || 0,
          articles:
            allData.data?.map(a => ({
              slug: a.attributes.slug,
              locale: a.attributes.locale,
              blog_page: a.attributes.blog_page,
              blog_post: a.attributes.blog_post,
            })) || [],
        },
        blogFilter: {
          count: blogFilterData.data?.length || 0,
          articles:
            blogFilterData.data?.map(a => ({
              slug: a.attributes.slug,
              locale: a.attributes.locale,
              blog_page: a.attributes.blog_page,
              blog_post: a.attributes.blog_post,
            })) || [],
        },
      },
      restApiData: articleInfo,
      graphqlData: graphqlData.data?.articles?.data || [],
      graphqlErrors: graphqlData.errors || null,
      recommendations: [
        localeData.data?.length === 0 && allData.data?.length > 0
          ? 'Article exists but not in requested locale'
          : null,
        allData.data?.length > 0 && blogFilterData.data?.length === 0
          ? 'Article exists but filtered out by blog_page filter'
          : null,
        articles.some(a => a.attributes.blog_page === true)
          ? 'Some articles have blog_page=true, should be at /blog/[slug]'
          : null,
      ].filter(Boolean),
      debugInfo: {
        totalArticles: articles.length,
        withBlogPost: articles.filter(a => a.attributes.blog_post === true).length,
        withBlogPage: articles.filter(a => a.attributes.blog_page === true).length,
        firstArticleFlags: articles[0]
          ? {
              blog_post: articles[0].attributes.blog_post,
              blog_page: articles[0].attributes.blog_page,
              'typeof blog_post': typeof articles[0].attributes.blog_post,
              'typeof blog_page': typeof articles[0].attributes.blog_page,
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Debug article error:', error);
    return res.status(500).json({
      error: 'Failed to debug article',
      message: error.message,
      slug: slug,
    });
  }
}
