const path = require('path')

module.exports = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    trailingSlash: true,
    distDir: 'build',
    i18n: {
    },
    i18n: {
        locales: ['ru', 'ua'],
        defaultLocale: 'ru',
    }
}
