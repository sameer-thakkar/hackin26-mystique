# Mystique - Microbrands @ Headout

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://www.conventionalcommits.org/en/v1.0.0/)
[![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg)](https://headout.github.io/mystique/)

Mystique is the tech that powers over 100 different microbrands at Headout.

## [Documentation (Storybook)](https://headout.github.io/mystique/)

## Development

### Requirements

- [Nodejs](https://nodejs.org/) (v10 and above)
- [Yarn](https://legacy.yarnpkg.com/) (package manager)
- [Git](https://git-scm.com/) (🧐)

### Developing

- Setup a `.env` file in the root of the repository:

  ```bash
  SLACK_GRP_BKNG_WEBHOOK=#Slack webhook
  AMPLITUDE_PROD=#Amplitude production
  AMPLITUDE_TEST=#Amplitude test
  AMPLITUDE_DEV=#Amplitude development
  ZENDESK_GRP_BKNG_TOKEN=#Zendesk Group Booking Token
  PROFESSORX_SECRET=#professorX secret to fetch subdomains
  ```

- Install dependencies by running:

  ```bash
  yarn
  ```

- Start the development server by running:

  ```bash
  yarn dev
  ```

- Visit any microbrand using the mystique_uid param (along with a lang param) in your query.

  Example:

  ```
  http://localhost:3000?mystique_uid=www.vaticantickets.org&lang=en-us
  ```

### Production

- Build the next app using:

  ```bash
  yarn build
  ```

- Start the built app using:

  ```bash
  yarn start
  ```

### Storybook Development

- Running storybook:

  ```bash
  yarn storybook
  ```

- Building storybook:

  ```bash
  yarn build-storybook
  ```

- Deploying storybook to github pages:

  ```bash
  yarn deploy-storybook
  ```
