const withCSS = require('./next-css');

const withPurgeCss = require('next-purgecss');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(
  withCSS(
    withPurgeCss({
      purgeCssEnabled: ({ dev, isServer }) => !dev && !isServer,
      purgeCss: {
        whitelistPatternsChildren: [/react-tel-input/],
      },
    })
  )
);
