const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  experimental: {
    legacyBrowsers: false,
    browsersListForSwc: true,
    optimizeCss: true,
    disablePostcssPresetEnv: true,
    // ISR and caching configuration
    isrMemoryCacheSize: 50, // MB - in-memory cache for ISR pages
    isrFlushToDisk: true, // Persist ISR cache to disk
  },
  excludeDefaultMomentLocales: true,
  // Vercel doesn't support custom distDir with standalone output
  ...(process.env.VERCEL
    ? {}
    : {
        output: 'standalone',
        distDir: 'build',
      }),
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  trailingSlash: false,
  i18n: {
    locales: ['en', 'ru', 'uk', 'ar', 'ko', 'zh', 'tr', 'pt'],
    defaultLocale: 'en',
  },
  images: {
    domains:
      process.env.STRAPI_HOST && typeof process.env.STRAPI_HOST === 'string'
        ? [process.env.STRAPI_HOST]
        : ['146.190.47.164'], // fallback domain
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year cache
    dangerouslyAllowSVG: false,
  },
  env: {
    STRAPI_API_KEY: process.env.STRAPI_API_KEY,
    STRAPI_HOST: process.env.STRAPI_HOST,
    STRAPI_PORT: process.env.STRAPI_PORT,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    BASE_URL: process.env.BASE_URL,
    NEXT_PUBLIC_STRAPI_HOST: `http://${process.env.STRAPI_HOST}:${process.env.STRAPI_PORT}`,
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
        permanent: true,
      },
      // Fix double locale prefix - only for actual locale codes
      {
        source: '/ru/ru/:path*',
        destination: '/ru/:path*',
        permanent: true,
      },
      {
        source: '/uk/uk/:path*',
        destination: '/uk/:path*',
        permanent: true,
      },
      {
        source: '/ar/ar/:path*',
        destination: '/ar/:path*',
        permanent: true,
      },
      {
        source: '/ko/ko/:path*',
        destination: '/ko/:path*',
        permanent: true,
      },
      {
        source: '/zh/zh/:path*',
        destination: '/zh/:path*',
        permanent: true,
      },
      {
        source: '/tr/tr/:path*',
        destination: '/tr/:path*',
        permanent: true,
      },
      {
        source: '/pt/pt/:path*',
        destination: '/pt/:path*',
        permanent: true,
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
        permanent: true,
      },
      {
        source: '/ru/kak-ispolzovat-cdl-help',
        destination: '/ru/kak-ispolzovat-cdlhelp',
        permanent: true,
      },
      // Legacy Russian URLs - only redirect if no locale prefix
      {
        source: '/kak-poluchit-cdl',
        destination: '/ru/kak-poluchit-cdl',
        permanent: true,
        locale: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
        ],
      },
      // General performance headers
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
      // Static assets with long cache
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Images with moderate cache
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
      // ISR pages with stale-while-revalidate
      {
        source: '/(.*)',
        has: [
          {
            type: 'header',
            key: 'x-nextjs-cache',
            value: '(?:HIT|STALE)',
          },
        ],
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=3600',
          },
        ],
      },
      // Font files
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // CSS files
      {
        source: '/css/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { dev, isServer, webpack }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      // Disable automatic polyfilling of Node.js core modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        process: false,
        buffer: false,
        stream: false,
      };

      // Exclude polyfills for modern browsers
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /^(core-js|regenerator-runtime)/,
          require.resolve('./lib/empty-module.js')
        )
      );

      // Configure to skip polyfilling certain features
      config.resolve.alias = {
        ...config.resolve.alias,
        'core-js': false,
        'regenerator-runtime': false,
      };

      // Optimize chunks with more aggressive settings
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 10000, // Reduced from 20000
        maxSize: 200000, // Reduced from 244000
        minChunks: 1,
        maxAsyncRequests: 20, // Reduced from 30
        maxInitialRequests: 20, // Reduced from 30
        cacheGroups: {
          polyfills: {
            test: /[\\/]node_modules[\\/](core-js|@babel[\\/]runtime|regenerator-runtime)[\\/]/,
            name: 'polyfills',
            priority: 20,
            reuseExistingChunk: true,
            enforce: true,
          },
          swiper: {
            test: /[\\/]node_modules[\\/](swiper|dom7|ssr-window)[\\/]/,
            name: 'vendor.swiper',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
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
            enforce: true,
          },
          default: {
            minChunks: 2,
            priority: -30,
            reuseExistingChunk: true,
          },
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
        ...(config.optimization.minimizer || []),
        new (require('terser-webpack-plugin'))({
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: [
                'console.log',
                'console.info',
                'console.debug',
                'console.warn',
                'console.error',
              ],
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
};

module.exports = nextConfig;
