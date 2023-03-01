// Please add all the dependencies needed here in .github/workflows/release.yml "Install Dependencies" step as well
// We're not installing all packages on the Github workflow to save on some precious build minutes

module.exports = {
  branches: ['master'],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        releaseRules: [
          { type: 'feat', release: 'minor' },

          { type: 'fix', release: 'patch' },
          { type: 'revert', release: 'patch' },

          { type: 'refactor', release: 'patch' },
          { type: 'perf', release: 'patch' },

          { type: 'build', release: 'patch' },
          { type: 'chore', release: 'patch' },
          { type: 'ci', release: 'patch' },

          { type: 'docs', release: false },
          { type: 'test', release: false },
          { type: 'style', release: false },
          { scope: 'no-release', release: false },
        ],
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        config: '@regalstreak/conventional-release-notes',
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING'],
        },
      },
    ],
    '@semantic-release/github',
  ],
};
