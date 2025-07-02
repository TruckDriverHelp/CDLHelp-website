#!/usr/bin/env node

const axios = require('axios');

async function testStaticGeneration() {
  const baseUrl = `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}`;
  const apiKey = process.env.STRAPI_API_KEY;
  
  console.log('Testing static generation for articles...\n');
  
  try {
    // Test the getStaticPaths filter
    const pathsUrl = `${baseUrl}/api/articles?populate[localizations]=*&filters[blog_page][$ne]=true&pagination[limit]=10`;
    console.log('Testing getStaticPaths filter:', pathsUrl);
    
    const pathsResponse = await axios.get(pathsUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });
    
    const articles = pathsResponse.data.data || [];
    console.log(`\nFound ${articles.length} articles for regular pages:\n`);
    
    articles.forEach((article, i) => {
      console.log(`${i + 1}. ${article.attributes.title}`);
      console.log(`   Slug: ${article.attributes.slug}`);
      console.log(`   Locale: ${article.attributes.locale}`);
      console.log(`   blog_page: ${article.attributes.blog_page}`);
      console.log(`   blog_post: ${article.attributes.blog_post}`);
      console.log(`   Expected URL: ${article.attributes.locale === 'en' ? '' : `/${article.attributes.locale}`}/${article.attributes.slug}`);
      console.log('');
    });
    
    // Test a specific article
    const testSlug = articles[0]?.attributes?.slug || 'getting-a-cdl-drivers-license';
    console.log(`\nTesting specific article: ${testSlug}\n`);
    
    // Test with GraphQL
    const graphqlQuery = `
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
              locale
              blog_post
              blog_page
            }
          }
        }
      }
    `;
    
    const graphqlResponse = await axios.post(
      `${baseUrl}/graphql`,
      {
        query: graphqlQuery,
        variables: { slug: testSlug, locale: 'en' }
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const graphqlArticles = graphqlResponse.data?.data?.articles?.data || [];
    console.log(`GraphQL found ${graphqlArticles.length} articles for slug="${testSlug}":`);
    
    graphqlArticles.forEach(article => {
      console.log(`- ${article.attributes.title}`);
      console.log(`  blog_page: ${article.attributes.blog_page}`);
      console.log(`  blog_post: ${article.attributes.blog_post}`);
    });
    
    // Test blog articles
    console.log('\n\nTesting blog articles:');
    console.log('=' .repeat(50));
    
    const blogUrl = `${baseUrl}/api/articles?populate=*&filters[blog_page][$eq]=true&pagination[limit]=5`;
    const blogResponse = await axios.get(blogUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });
    
    const blogArticles = blogResponse.data.data || [];
    console.log(`Found ${blogArticles.length} blog articles:\n`);
    
    blogArticles.forEach((article, i) => {
      console.log(`${i + 1}. ${article.attributes.title}`);
      console.log(`   Slug: ${article.attributes.slug}`);
      console.log(`   blog_page: ${article.attributes.blog_page}`);
      console.log(`   Expected URL: ${article.attributes.locale === 'en' ? '' : `/${article.attributes.locale}`}/blog/${article.attributes.slug}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response?.data) {
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testStaticGeneration();