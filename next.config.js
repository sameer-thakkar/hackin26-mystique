const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  trailingSlash: true,
  headers: async () => {
    return [
      {
        source: '/((?!api).*)',
        headers: [
          {
            key: 'Vary',
            value: 'User-Agent',
          },
        ],
      },
    ];
  },
});
