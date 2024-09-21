const path = require('path');

module.exports = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    trailingSlash: true,
    distDir: 'build',
    i18n: {
        locales: ["en", "ru", "uk"],
        defaultLocale: "en",
    },
    images: {
        domains: [process.env.STRAPI_HOST],
    },
    env: {
        STRAPI_API_KEY: process.env.STRAPI_API_KEY,
        STRAPI_HOST: process.env.STRAPI_HOST,
        STRAPI_PORT: process.env.STRAPI_PORT
    },
}

