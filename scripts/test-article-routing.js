#!/usr/bin/env node

const axios = require('axios');

const baseUrl = process.env.STRAPI_HOST
  ? `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}`
  : 'http://146.190.47.164:1337';

const apiKey = process.env.STRAPI_API_KEY || '';

async function testArticleRouting() {
  console.log('Testing article routing...\n');

  try {
    // Fetch all articles
    const response = await axios.get(`${baseUrl}/api/articles?populate=*&pagination[limit]=10`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const articles = response.data.data;
    console.log(`Found ${articles.length} articles\n`);

    // Group articles by type
    const blogArticles = articles.filter(a => a.attributes.blog_page === true);
    const regularArticles = articles.filter(a => a.attributes.blog_page !== true);

    console.log('Blog Articles (should be at /blog/[slug]):');
    console.log('='.repeat(50));
    blogArticles.forEach(article => {
      const { slug, title, locale, blog_post, blog_page } = article.attributes;
      const expectedUrl = locale === 'en' ? `/blog/${slug}` : `/${locale}/blog/${slug}`;
      console.log(`- ${title}`);
      console.log(`  Slug: ${slug}`);
      console.log(`  Locale: ${locale}`);
      console.log(`  blog_post: ${blog_post}, blog_page: ${blog_page}`);
      console.log(`  Expected URL: ${expectedUrl}`);
      console.log('');
    });

    console.log('\nRegular Articles (should be at /[slug]):');
    console.log('='.repeat(50));
    regularArticles.forEach(article => {
      const { slug, title, locale, blog_post, blog_page } = article.attributes;
      const expectedUrl = locale === 'en' ? `/${slug}` : `/${locale}/${slug}`;
      console.log(`- ${title}`);
      console.log(`  Slug: ${slug}`);
      console.log(`  Locale: ${locale}`);
      console.log(`  blog_post: ${blog_post}, blog_page: ${blog_page}`);
      console.log(`  Expected URL: ${expectedUrl}`);
      console.log('');
    });

    // Summary
    console.log('\nSummary:');
    console.log(`- Total articles: ${articles.length}`);
    console.log(`- Blog articles (blog_page=true): ${blogArticles.length}`);
    console.log(`- Regular articles (blog_page=false/null): ${regularArticles.length}`);
    console.log(
      `- Articles shown on /blog listing (blog_post=true): ${articles.filter(a => a.attributes.blog_post === true).length}`
    );
  } catch (error) {
    console.error('Error testing article routing:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testArticleRouting();
