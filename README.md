# Mystique - Microbrands @ Headout

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://www.conventionalcommits.org/en/v1.0.0/)
[![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg)](https://headout.github.io/mystique/)

Mystique is the tech that powers over 100 different microbrands at Headout.

## [Documentation (Storybook)](https://headout.github.io/mystique/)

## Development

### Requirements

- [Nodejs](https://nodejs.org/) (v15 and above)
- [Yarn](https://legacy.yarnpkg.com/) (package manager)
- [Git](https://git-scm.com/) (🧐)

### Developing

- Setup a `.env` file in the root of the repository:

  ```bash
  SLACK_GRP_BKNG_WEBHOOK=#Slack webhook
  ZENDESK_GRP_BKNG_TOKEN=#Zendesk Group Booking Token
  NEXT_PUBLIC_HEADOUT_DOMAIN=https://www.headout.com
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
  http://localhost:3001/?mystique_uid=www.thevaticantickets.com&lang=en-us
  ```
### Testing on stage 🚧
- Once deployed on stage, MB types use their own subdomain - `www-stage.<domain>.com` eg. stage-www.thevaticantickets.com
- Not all MBs have a subdomain, to check a particular MB go to `https://stage-microbrands.headout.com/?mystique_uid=www.tickets-paris.fr.louvre-museum&lang=en-us` 
where `www.tickets-paris.fr.louvre-museum` is the mystique uid
- Production mbs that are on a subpath i.e `www.tickets-paris.fr/louvre-museum` use a `.` instead of a `/` when used as `mystique_uid` (see ^)

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
