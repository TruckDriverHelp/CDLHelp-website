const path = require('path');

module.exports = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    trailingSlash: true,
    distDir: 'build',
    i18n: {
        locales: ["en", "ru", "uk", "ar", "ko", "zh", "tr", "pt"],
        defaultLocale: "en",
        // ns: ["index", "article", "cookie", "navbar", "footer", "contact"]
    },
    images: {
        domains: [process.env.STRAPI_HOST],
    },
    env: {
        STRAPI_API_KEY: process.env.STRAPI_API_KEY,
        STRAPI_HOST: process.env.STRAPI_HOST,
        STRAPI_PORT: process.env.STRAPI_PORT,
        SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
        BASE_URL: process.env.BASE_URL
    },
    async redirects() {
        return [
          {
            source: '/dalnoboishik/',
            destination: '/ru/kak-stat-dalnoboishikom',
            permanent: true
          },
          {
            source: '/permit/',
            destination: '/ru/kak-poluchit-clp-permit',
            permanent: true
          },
          {
            source: '/kak-ispolzovat-cdl-help/',
            destination: '/ru/kak-ispolzovat-cdlhelp',
            permanent: true,
          },
          {
            source: '/faq/',
            destination: '/ru/chasto-zadavaemye-voprosy',
            permanent: true
          }
        ];
      },
}

