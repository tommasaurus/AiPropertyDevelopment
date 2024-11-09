// client/postcss.config.js
module.exports = {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
      'postcss-prefix-selector': {
        prefix: '.ui',
        exclude: ['.ui'], // Prevent double prefixing
        transform: function (prefix, selector, prefixedSelector) {
          // Do not prefix keyframes or custom media queries
          if (
            selector.startsWith('@keyframes') ||
            selector.startsWith('@media') ||
            selector.startsWith('@supports')
          ) {
            return selector;
          }
          // Prefix root selectors
          if (selector === ':root') {
            return prefix;
          }
          return prefixedSelector;
        },
      },
    },
  };
  