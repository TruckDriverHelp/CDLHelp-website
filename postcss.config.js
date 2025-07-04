module.exports = {
  plugins: [
    require('postcss-flexbugs-fixes'),
    [
      require('postcss-preset-env'),
      {
        autoprefixer: {
          flexbox: 'no-2009',
        },
        stage: 3,
        features: {
          'custom-properties': false,
        },
      },
    ],
    // PurgeCSS configuration for production builds
    ...(process.env.NODE_ENV === 'production'
      ? [
          [
            require('@fullhuman/postcss-purgecss'),
            {
              content: [
                './pages/**/*.{js,jsx,ts,tsx}',
                './components/**/*.{js,jsx,ts,tsx}',
                './src/**/*.{js,jsx,ts,tsx}',
                './lib/**/*.{js,jsx,ts,tsx}',
              ],
              defaultExtractor: content => {
                // Capture as liberally as possible, including things like `h-(screen-1.5)`
                const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];

                // Capture classes within other delimiters like .block(class="w-1/2") in Pug
                const innerMatches =
                  content.match(/[^<>"'`\s.(){}[\]#=%]*[^<>"'`\s.(){}[\]#=%:]/g) || [];

                return broadMatches.concat(innerMatches);
              },
              safelist: {
                standard: [
                  /^(fade|show|collapse|collapsing)/,
                  /^modal/,
                  /^tooltip/,
                  /^popover/,
                  /^bs-/,
                  /^carousel/,
                  /^dropdown/,
                  /^nav/,
                  /^navbar/,
                  /^alert/,
                  /^animated/,
                  /^accordion/,
                  /^swiper/,
                  /^react-tabs/,
                  /^yarl/,
                  /^direction-rtl/,
                  /^direction-ltr/,
                ],
                deep: [/^modal/, /^tooltip/, /^popover/, /^dropdown/],
                greedy: [/active/, /show/, /open/, /collapsed/],
              },
              // Don't remove keyframe animations
              keyframes: true,
              // Font-face rules
              fontFace: true,
              // Variables
              variables: true,
            },
          ],
        ]
      : []),
  ],
};
