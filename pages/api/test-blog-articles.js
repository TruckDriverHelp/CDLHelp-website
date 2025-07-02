export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const baseUrl = `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/api`;
    
    // Fetch all articles
    const allArticlesResponse = await fetch(`${baseUrl}/articles?populate=*&pagination[limit]=100`, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_KEY}`
      }
    });
    
    if (!allArticlesResponse.ok) {
      throw new Error(`Failed to fetch articles: ${allArticlesResponse.status}`);
    }
    
    const allArticlesData = await allArticlesResponse.json();
    const allArticles = allArticlesData.data || [];
    
    // Categorize articles
    const blogPostArticles = allArticles.filter(a => a.attributes.blog_post === true);
    const blogPageArticles = allArticles.filter(a => a.attributes.blog_page === true);
    const regularArticles = allArticles.filter(a => a.attributes.blog_page !== true);
    
    // Articles that should appear on /blog listing (blog_post = true)
    const blogListingArticles = blogPostArticles.map(a => ({
      id: a.id,
      slug: a.attributes.slug,
      title: a.attributes.title,
      locale: a.attributes.locale,
      blog_post: a.attributes.blog_post,
      blog_page: a.attributes.blog_page,
      url: a.attributes.blog_page 
        ? `${a.attributes.locale === 'en' ? '' : `/${a.attributes.locale}`}/blog/${a.attributes.slug}`
        : `${a.attributes.locale === 'en' ? '' : `/${a.attributes.locale}`}/${a.attributes.slug}`
    }));
    
    // Articles with blog_page = true (should have /blog/[slug] URLs)
    const blogRouteArticles = blogPageArticles.map(a => ({
      id: a.id,
      slug: a.attributes.slug,
      title: a.attributes.title,
      locale: a.attributes.locale,
      blog_post: a.attributes.blog_post,
      blog_page: a.attributes.blog_page,
      url: `${a.attributes.locale === 'en' ? '' : `/${a.attributes.locale}`}/blog/${a.attributes.slug}`
    }));
    
    return res.status(200).json({
      success: true,
      summary: {
        totalArticles: allArticles.length,
        blogPostArticles: blogPostArticles.length,
        blogPageArticles: blogPageArticles.length,
        regularArticles: regularArticles.length
      },
      blogListingArticles: {
        description: 'Articles that appear on /blog page (blog_post = true)',
        count: blogListingArticles.length,
        articles: blogListingArticles
      },
      blogRouteArticles: {
        description: 'Articles with /blog/[slug] URLs (blog_page = true)',
        count: blogRouteArticles.length,
        articles: blogRouteArticles
      },
      regularArticles: {
        description: 'Articles with regular /[slug] URLs (blog_page = false or null)',
        count: regularArticles.length,
        articles: regularArticles.slice(0, 10).map(a => ({
          id: a.id,
          slug: a.attributes.slug,
          title: a.attributes.title,
          locale: a.attributes.locale,
          blog_post: a.attributes.blog_post,
          blog_page: a.attributes.blog_page,
          url: `${a.attributes.locale === 'en' ? '' : `/${a.attributes.locale}`}/${a.attributes.slug}`
        }))
      }
    });
  } catch (error) {
    console.error('Test blog articles error:', error);
    return res.status(500).json({
      error: 'Failed to test blog articles',
      message: error.message
    });
  }
}