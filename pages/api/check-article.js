export default async function handler(req, res) {
  const { slug = 'how-to-get-cdl-permit' } = req.query;
  
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const baseUrl = `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}`;
  const headers = {
    Authorization: `Bearer ${process.env.STRAPI_API_KEY}`
  };

  try {
    // Check if article exists at all (without locale filter)
    const allUrl = `${baseUrl}/api/articles?filters[slug][$eq]=${slug}&populate=*`;
    console.log('Checking all locales:', allUrl);
    const allResponse = await fetch(allUrl, { headers });
    const allData = await allResponse.json();
    
    // Also check if it exists in any locale with locale parameter
    const enUrl = `${baseUrl}/api/articles?filters[slug][$eq]=${slug}&locale=en&populate=*`;
    const enResponse = await fetch(enUrl, { headers });
    const enData = await enResponse.json();
    
    // Check with blog_page=true filter
    const blogUrl = `${baseUrl}/api/articles?filters[slug][$eq]=${slug}&filters[blog_page][$eq]=true&populate=*`;
    const blogResponse = await fetch(blogUrl, { headers });
    const blogData = await blogResponse.json();
    
    // Check with blog_page!=true filter (what getStaticPaths uses)
    const nonBlogUrl = `${baseUrl}/api/articles?filters[slug][$eq]=${slug}&filters[blog_page][$ne]=true&populate=*`;
    const nonBlogResponse = await fetch(nonBlogUrl, { headers });
    const nonBlogData = await nonBlogResponse.json();
    
    const article = allData.data?.[0];
    
    return res.status(200).json({
      slug,
      exists: allData.data?.length > 0,
      article: article ? {
        id: article.id,
        slug: article.attributes.slug,
        title: article.attributes.title,
        locale: article.attributes.locale,
        blog_page: article.attributes.blog_page,
        blog_post: article.attributes.blog_post,
        publishedAt: article.attributes.publishedAt,
        localizations: article.attributes.localizations?.data?.length || 0
      } : null,
      checks: {
        allLocales: allData.data?.length || 0,
        enLocale: enData.data?.length || 0,
        isBlogPage: blogData.data?.length > 0,
        isRegularPage: nonBlogData.data?.length > 0
      },
      allArticles: allData.data?.map(a => ({
        locale: a.attributes.locale,
        blog_page: a.attributes.blog_page,
        blog_post: a.attributes.blog_post
      })) || [],
      expectedUrl: article ? (
        article.attributes.blog_page === true 
          ? `${article.attributes.locale === 'en' ? '' : `/${article.attributes.locale}`}/blog/${slug}`
          : `${article.attributes.locale === 'en' ? '' : `/${article.attributes.locale}`}/${slug}`
      ) : null,
      recommendation: article ? (
        article.attributes.blog_page === true 
          ? `This article should be accessed at /blog/${slug}`
          : `This article should be accessible at /${slug}`
      ) : 'Article not found in Strapi'
    });
    
  } catch (error) {
    console.error('Check article error:', error);
    return res.status(500).json({
      error: 'Failed to check article',
      message: error.message
    });
  }
}