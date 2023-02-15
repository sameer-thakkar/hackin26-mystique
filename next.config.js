const { withSentryConfig } = require('@sentry/nextjs');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const SentryWebpackPluginOptions = {
  include: '.',
  ignore: ['node_modules', 'next.config.js'],
  configFile: 'sentry.properties',
  silent: true,
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

const nextConfig = {
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
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          net: false,
          tls: false,
          fs: false,
        },
      };
    }
    return config;
  },
};

module.exports = withBundleAnalyzer(
  withSentryConfig(nextConfig, SentryWebpackPluginOptions)
);
