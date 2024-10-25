const moduleTranspiler = require('next-transpile-modules');

const { withSentryConfig } = require('@sentry/nextjs');

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });

const SentryWebpackPluginOptions = {
  include: '.',
  ignore: ['node_modules', 'next.config.js'],
  configFile: 'sentry.properties',
  silent: true,
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

const internalRedirects = [
  {
    source: '/:lang/tour/:id/:path*/',
    destination: '/:lang/-e-:id/',
    permanent: true,
  },
  {
    source: '/tour/:id/:path*/',
    destination: '/-e-:id/',
    permanent: true,
  },
];

const internalRewrites = [
  {
    source: '/tour/:id',
    destination: '/en/tour/:id',
  },
  {
    source: '/:lang/(.*)-e-:id(\\d+)',
    destination: '/:lang/tour/:id',
  },
  {
    source: '/(.*)-e-:id(\\d+)',
    destination: '/en/tour/:id',
  },
];

const withTM = moduleTranspiler(['@headout/aer', '@headout/eevee']);

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  trailingSlash: true,
  swcMinify: false,
  // Compression responsibility is offloaded to Cloudfront.
  compress: false,
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
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    });

    return config;
  },
  rewrites: async () => {
    return internalRewrites;
  },
  redirects: async () => {
    return internalRedirects;
  },
  assetPrefix: process.env.NEXT_PUBLIC_ASSETS_CDN_BASE_URL,
};

module.exports = withTM(
  withSentryConfig(nextConfig, SentryWebpackPluginOptions)
);
