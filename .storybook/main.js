const path = require('path');

module.exports = {
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [['react-app', { flow: false, typescript: true }]],
          plugins: ['styled-components', 'react-docgen'],
        },
      },
    });
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve('./'),
    ];
    config.resolve.alias = {
      UI: path.resolve(__dirname, '../components/UI'),
      hooks: path.resolve(__dirname, '../components/hooks'),
    };
    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  },
  stories: ['../stories/**/*.stories.(tsx|js|mdx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-viewport/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-docs',
  ],
};
