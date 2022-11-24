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
          plugins: [
            'styled-components',
            'react-docgen',
            '@babel/plugin-proposal-class-properties',
          ],
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
      const: path.resolve(__dirname, '../constants'),
      components: path.resolve(__dirname, '../components'),
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
