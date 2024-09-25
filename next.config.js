const path = require('path');

module.exports = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    trailingSlash: true,
    distDir: 'build',
    i18n: {
        locales: ["en", "ru", "uk", "ar"],
        defaultLocale: "en",
        // ns: ["index", "article", "cookie", "navbar", "footer", "contact"]
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

