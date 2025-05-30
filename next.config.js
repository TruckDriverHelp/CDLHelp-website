const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    trailingSlash: true,
    i18n: {
        locales: ["en", "ru", "uk", "ar", "ko", "zh", "tr", "pt"],
        defaultLocale: "en",
    },
    images: {
        domains: [process.env.STRAPI_HOST],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
            destination: '/ru/kak-stat-dalnoboishikom/',
            permanent: true
          },
          {
            source: '/permit/',
            destination: '/ru/kak-poluchit-cdl-permit/',
            permanent: true
          },
          {
            source: '/kak-ispolzovat-cdl-help/',
            destination: '/ru/kak-ispolzovat-cdlhelp/',
            permanent: true,
          },
          {
            source: '/faq/',
            destination: '/ru/chasto-zadavaemye-voprosy/',
            permanent: true
          },
          {
            source: '/cdl-shkola/',
            destination: '/ru/cdl-school/',
            permanent: true
          }
        ];
    },
    async headers() {
        return [
            {
                source: "/:path*.xml",
                headers: [
                    {
                        key: "Content-Type",
                        value: "application/xml",
                    },
                ],
            },
        ];
    },
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    webpack: (config, { dev, isServer }) => {
        // Optimize bundle size
        if (!dev && !isServer) {
            // Optimize chunks
            config.optimization.splitChunks = {
                chunks: 'all',
                minSize: 20000,
                maxSize: 244000,
                minChunks: 1,
                maxAsyncRequests: 30,
                maxInitialRequests: 30,
                cacheGroups: {
                    defaultVendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                        reuseExistingChunk: true,
                        name(module) {
                            // Get the name of the package
                            const match = module.context?.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
                            const packageName = match ? match[1] : 'unknown';
                            return `vendor.${packageName.replace('@', '')}`;
                        },
                    },
                    common: {
                        name: 'common',
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true,
                        enforce: true
                    },
                    default: {
                        minChunks: 2,
                        priority: -30,
                        reuseExistingChunk: true
                    }
                },
            };

            // Enable tree shaking
            config.optimization.usedExports = true;
            
            // Minimize CSS
            config.optimization.minimize = true;
        }

        // Add module concatenation
        config.optimization.concatenateModules = true;

        return config;
    },
}

module.exports = nextConfig
