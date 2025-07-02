export default async function handler(req, res) {
  const { slug = 'what-is-taught-in-cdl-schools' } = req.query;
  
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const baseUrl = `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/api`;
    
    // Fetch article by slug
    const response = await fetch(
      `${baseUrl}/articles?filters[slug][$eq]=${slug}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_KEY}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch article: ${response.status}`);
    }
    
    const data = await response.json();
    const articles = data.data || [];
    
    if (articles.length === 0) {
      return res.status(404).json({
        error: 'Article not found',
        slug: slug
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
        slug: loc.attributes.slug
      })),
      expectedUrl: article.attributes.blog_page 
        ? `${article.attributes.locale === 'en' ? '' : `/${article.attributes.locale}`}/blog/${article.attributes.slug}`
        : `${article.attributes.locale === 'en' ? '' : `/${article.attributes.locale}`}/${article.attributes.slug}`,
      shouldAppearOnBlogListing: article.attributes.blog_post === true,
      shouldHaveBlogUrl: article.attributes.blog_page === true
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
        Authorization: `Bearer ${process.env.STRAPI_API_KEY}`
      },
      body: JSON.stringify({
        query: graphqlQuery,
        variables: { slug, locale: 'en' }
      })
    });
    
    const graphqlData = await graphqlResponse.json();
    
    return res.status(200).json({
      success: true,
      slug: slug,
      articlesFound: articles.length,
      restApiData: articleInfo,
      graphqlData: graphqlData.data?.articles?.data || [],
      graphqlErrors: graphqlData.errors || null,
      debugInfo: {
        totalArticles: articles.length,
        withBlogPost: articles.filter(a => a.attributes.blog_post === true).length,
        withBlogPage: articles.filter(a => a.attributes.blog_page === true).length,
        firstArticleFlags: articles[0] ? {
          blog_post: articles[0].attributes.blog_post,
          blog_page: articles[0].attributes.blog_page,
          'typeof blog_post': typeof articles[0].attributes.blog_post,
          'typeof blog_page': typeof articles[0].attributes.blog_page
        } : null
      }
    });
  } catch (error) {
    console.error('Debug article error:', error);
    return res.status(500).json({
      error: 'Failed to debug article',
      message: error.message,
      slug: slug
    });
  }
}