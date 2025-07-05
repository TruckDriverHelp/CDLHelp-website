module.exports = {
  plugins: [
    'postcss-flexbugs-fixes',
    [
      'postcss-preset-env',
      {
        autoprefixer: {
          flexbox: 'no-2009',
          grid: 'autoplace',
        },
        stage: 3,
        features: {
          'custom-properties': false,
          'nesting-rules': true,
        },
        browsers: [
          '>0.3%',
          'last 2 Chrome versions',
          'last 2 Firefox versions',
          'last 2 Safari versions',
          'last 2 Edge versions',
          'not dead',
          'not op_mini all',
          'not IE 11',
        ],
      },
    ],
  ],
};
