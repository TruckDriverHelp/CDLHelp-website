const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    output: 'standalone',
    distDir: 'build',
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    trailingSlash: false,
    i18n: {
        locales: ["en", "ru", "uk", "ar", "ko", "zh", "tr", "pt"],
        defaultLocale: "en",
    },
    images: {
        domains: [process.env.STRAPI_HOST],
        deviceSizes: [640, 750, 828, 1080, 1200],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        formats: ['image/webp'],
        minimumCacheTTL: 60,
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    env: {
        STRAPI_API_KEY: process.env.STRAPI_API_KEY,
        STRAPI_HOST: process.env.STRAPI_HOST,
        STRAPI_PORT: process.env.STRAPI_PORT,
        SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
        BASE_URL: process.env.BASE_URL,
        NEXT_PUBLIC_STRAPI_HOST: `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}`
    },
    async rewrites() {
        return [
            {
                source: '/sitemap.xml',
                destination: '/api/sitemap',
            },
            {
                source: '/sitemap-index.xml',
                destination: '/api/sitemap-index.xml',
            },
        ];
    },
    async redirects() {
        return [
          // Fix incorrect /en/ prefix for English URLs
          {
            source: '/en/:path*',
            destination: '/:path*',
            permanent: true
          },
          // Fix double locale prefix - only for actual locale codes
          {
            source: '/ru/ru/:path*',
            destination: '/ru/:path*',
            permanent: true
          },
          {
            source: '/uk/uk/:path*',
            destination: '/uk/:path*',
            permanent: true
          },
          {
            source: '/ar/ar/:path*',
            destination: '/ar/:path*',
            permanent: true
          },
          {
            source: '/ko/ko/:path*',
            destination: '/ko/:path*',
            permanent: true
          },
          {
            source: '/zh/zh/:path*',
            destination: '/zh/:path*',
            permanent: true
          },
          {
            source: '/tr/tr/:path*',
            destination: '/tr/:path*',
            permanent: true
          },
          {
            source: '/pt/pt/:path*',
            destination: '/pt/:path*',
            permanent: true
          },
          // Legacy Russian URL redirects moved to middleware.js
          // The locale: false option doesn't work properly with Next.js i18n
          // See middleware.js for the implementation of these redirects
          /*
          {
            source: '/dalnoboishik',
            destination: '/ru/kak-stat-dalnoboishikom',
            permanent: true,
            locale: false
          },
          {
            source: '/permit',
            destination: '/ru/kak-poluchit-cdl-permit',
            permanent: true,
            locale: false
          },
          {
            source: '/kak-ispolzovat-cdl-help',
            destination: '/ru/kak-ispolzovat-cdlhelp',
            permanent: true,
            locale: false
          },
          {
            source: '/faq',
            destination: '/ru/chasto-zadavaemye-voprosy',
            permanent: true,
            locale: false
          },
          {
            source: '/cdl-shkola',
            destination: '/ru/o-cdl-shkolakh',
            permanent: true,
            locale: false
          },
          {
            source: '/o-shkolax',
            destination: '/ru/o-cdl-shkolakh',
            permanent: true,
            locale: false
          },
          {
            source: '/kak-poluchit-cdl',
            destination: '/ru/kak-poluchit-cdl',
            permanent: true,
            locale: false
          },
          */
          // Fix incorrect Russian URLs
          {
            source: '/ru/cdl-shkola',
            destination: '/ru/o-cdl-shkolakh',
            permanent: true
          },
          {
            source: '/ru/kak-ispolzovat-cdl-help',
            destination: '/ru/kak-ispolzovat-cdlhelp',
            permanent: true
          },
          // Legacy Russian URLs - only redirect if no locale prefix
          {
            source: '/kak-poluchit-cdl',
            destination: '/ru/kak-poluchit-cdl',
            permanent: true,
            locale: false
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
            // Optimize chunks with more aggressive settings
            config.optimization.splitChunks = {
                chunks: 'all',
                minSize: 10000, // Reduced from 20000
                maxSize: 200000, // Reduced from 244000
                minChunks: 1,
                maxAsyncRequests: 20, // Reduced from 30
                maxInitialRequests: 20, // Reduced from 30
                cacheGroups: {
                    defaultVendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                        reuseExistingChunk: true,
                        name(module) {
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
            
            // Minimize CSS and JS
            config.optimization.minimize = true;

            // Add module concatenation
            config.optimization.concatenateModules = true;

            // Add scope hoisting
            config.optimization.moduleIds = 'deterministic';

            // Optimize runtime
            config.optimization.runtimeChunk = 'single';

            // Add compression
            config.optimization.minimizer = [
                ...config.optimization.minimizer || [],
                new (require('terser-webpack-plugin'))({
                    terserOptions: {
                        compress: {
                            drop_console: true,
                            drop_debugger: true,
                            pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
                        },
                        mangle: true,
                        output: {
                            comments: false,
                        },
                    },
                }),
            ];
        }

        return config;
    },
}

module.exports = nextConfig
