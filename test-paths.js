const axios = require('axios');
require('dotenv').config();

async function testStaticPaths() {
  try {
    console.log('🔍 Testing getting all articles for path generation...');
    console.log(
      `🔗 URL: http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/api/articles?populate[localizations]=*`
    );

    const { data } = await axios.get(
      `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}/api/articles?populate[localizations]=*`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
        },
      }
    );

    console.log('\n✅ Response from Strapi:');
    console.log('📊 Total articles count:', data.data.length);

    const paths = [];
    data.data.forEach(post => {
      console.log(`\n📄 Article: ${post.attributes.title || 'No title'}`);
      console.log(`   🔗 Slug: ${post.attributes.slug}`);
      console.log(`   🌍 Locale: ${post.attributes.locale}`);
      console.log(`   📅 Published: ${post.attributes.publishedAt}`);

      // Add main article
      const mainPath = {
        params: { slug: post.attributes.slug },
        locale: post.attributes.locale,
      };
      paths.push(mainPath);
      console.log(`   ➕ Added path: /${post.attributes.locale}/${post.attributes.slug}`);

      // Add localizations
      if (post.attributes.localizations && post.attributes.localizations.data) {
        post.attributes.localizations.data.forEach(locale => {
          const locPath = {
            params: { slug: locale.attributes.slug },
            locale: locale.attributes.locale,
          };
          paths.push(locPath);
          console.log(
            `   ➕ Added localization: /${locale.attributes.locale}/${locale.attributes.slug}`
          );
        });
      }
    });

    console.log('\n📊 Final statistics:');
    console.log(`🔗 Total paths generated: ${paths.length}`);

    // Search for our article
    const targetSlug = 'kak-aktivirovat-promokod';
    const targetLocale = 'ru';
    const foundPath = paths.find(
      path => path.params.slug === targetSlug && path.locale === targetLocale
    );

    if (foundPath) {
      console.log(`\n✅ Article "${targetSlug}" found in paths!`);
      console.log(`   🌍 Locale: ${foundPath.locale}`);
      console.log(`   🔗 Path: /${foundPath.locale}/${foundPath.params.slug}`);
    } else {
      console.log(`\n❌ Article "${targetSlug}" NOT found in paths!`);
      console.log('🔍 Possible reasons:');
      console.log('   - Article not published in Strapi');
      console.log('   - Localization issues');
      console.log('   - Error in path generation logic');
    }

    // Show some path examples
    console.log('\n📝 Examples of generated paths:');
    paths.slice(0, 10).forEach((path, index) => {
      console.log(`   ${index + 1}. /${path.locale}/${path.params.slug}`);
    });
  } catch (error) {
    console.error('\n❌ Error getting articles:');
    console.error('🔴 Message:', error.message);
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📝 Data:', error.response.data);
    }
  }
}

testStaticPaths();
