const axios = require('axios');
require('dotenv').config();

async function testStaticPaths() {
  try {
    console.log('🔍 Тестирование получения всех статей для генерации путей...');
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

    console.log('\n✅ Ответ от Strapi:');
    console.log('📊 Общее количество статей:', data.data.length);

    const paths = [];
    data.data.forEach(post => {
      console.log(`\n📄 Статья: ${post.attributes.title || 'Без названия'}`);
      console.log(`   🔗 Слаг: ${post.attributes.slug}`);
      console.log(`   🌍 Локаль: ${post.attributes.locale}`);
      console.log(`   📅 Опубликована: ${post.attributes.publishedAt}`);

      // Добавляем основную статью
      const mainPath = {
        params: { slug: post.attributes.slug },
        locale: post.attributes.locale,
      };
      paths.push(mainPath);
      console.log(`   ➕ Добавлен путь: /${post.attributes.locale}/${post.attributes.slug}`);

      // Добавляем локализации
      if (post.attributes.localizations && post.attributes.localizations.data) {
        post.attributes.localizations.data.forEach(locale => {
          const locPath = {
            params: { slug: locale.attributes.slug },
            locale: locale.attributes.locale,
          };
          paths.push(locPath);
          console.log(
            `   ➕ Добавлена локализация: /${locale.attributes.locale}/${locale.attributes.slug}`
          );
        });
      }
    });

    console.log('\n📊 Итоговая статистика:');
    console.log(`🔗 Всего путей сгенерировано: ${paths.length}`);

    // Ищем нашу статью
    const targetSlug = 'kak-aktivirovat-promokod';
    const targetLocale = 'ru';
    const foundPath = paths.find(
      path => path.params.slug === targetSlug && path.locale === targetLocale
    );

    if (foundPath) {
      console.log(`\n✅ Статья "${targetSlug}" найдена в путях!`);
      console.log(`   🌍 Локаль: ${foundPath.locale}`);
      console.log(`   🔗 Путь: /${foundPath.locale}/${foundPath.params.slug}`);
    } else {
      console.log(`\n❌ Статья "${targetSlug}" НЕ найдена в путях!`);
      console.log('🔍 Возможные причины:');
      console.log('   - Статья не опубликована в Strapi');
      console.log('   - Проблемы с локализацией');
      console.log('   - Ошибка в логике генерации путей');
    }

    // Показываем несколько примеров путей
    console.log('\n📝 Примеры сгенерированных путей:');
    paths.slice(0, 10).forEach((path, index) => {
      console.log(`   ${index + 1}. /${path.locale}/${path.params.slug}`);
    });
  } catch (error) {
    console.error('\n❌ Ошибка при получении статей:');
    console.error('🔴 Сообщение:', error.message);
    if (error.response) {
      console.error('📊 Статус:', error.response.status);
      console.error('📝 Данные:', error.response.data);
    }
  }
}

testStaticPaths();
