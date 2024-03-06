const path = require('path')

module.exports = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    trailingSlash: true,
    distDir: 'build',
    i18n: {
        locales: ["en", "ru", "ua", "ar", "pt"],
        defaultLocale: "en",
    },
    images: {
        domains: ['146.190.47.164'],
      }
}