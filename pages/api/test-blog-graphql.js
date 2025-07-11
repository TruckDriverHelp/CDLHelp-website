export default async function handler(req, res) {
  const { slug = 'what-is-taught-in-cdl-schools', locale = 'en' } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const graphqlUrl = `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/graphql`;

    // Start with a minimal query
    const minimalQuery = `
      query GetArticle($slug: String!, $locale: I18NLocaleCode) {
        articles(
          filters: { slug: { eq: $slug } }
          locale: $locale
        ) {
          data {
            id
            attributes {
              slug
              title
              description
              publishedAt
              blog_post
              blog_page
              locale
            }
          }
        }
      }
    `;

    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
      },
      body: JSON.stringify({
        query: minimalQuery,
        variables: { slug, locale },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      return res.status(400).json({
        error: 'GraphQL query failed',
        errors: data.errors,
        query: minimalQuery,
        variables: { slug, locale },
      });
    }

    const articles = data.data?.articles?.data || [];
    const blogArticle = articles.find(a => a.attributes.blog_page === true);

    return res.status(200).json({
      success: true,
      articlesFound: articles.length,
      blogArticle: blogArticle || null,
      allArticles: articles.map(a => ({
        id: a.id,
        slug: a.attributes.slug,
        title: a.attributes.title,
        locale: a.attributes.locale,
        blog_post: a.attributes.blog_post,
        blog_page: a.attributes.blog_page,
        shouldBeAtUrl: a.attributes.blog_page
          ? `${a.attributes.locale === 'en' ? '' : `/${a.attributes.locale}`}/blog/${a.attributes.slug}`
          : `${a.attributes.locale === 'en' ? '' : `/${a.attributes.locale}`}/${a.attributes.slug}`,
      })),
      debugInfo: {
        slug,
        locale,
        queryUsed: 'minimal query with basic fields',
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to test blog GraphQL',
      message: error.message,
    });
  }
}
