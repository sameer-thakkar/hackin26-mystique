const withCSS = require('./next-css');
const withPurgeCss = require('next-purgecss');

module.exports = withCSS(
  withPurgeCss({
    purgeCssEnabled: ({ dev, isServer }) => !dev && !isServer,
    purgeCss: {
      whitelistPatternsChildren: [/react-tel-input/],
    },
  })
);
