# Mystique - Microbrands @ Headout

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://www.conventionalcommits.org/en/v1.0.0/)
[![Storybook](https://cdn.jsdelivr.net/gh/storybookjs/brand@master/badge/badge-storybook.svg)](https://headout.github.io/mystique/)

Mystique is the tech that powers over 2500 different microbrands at Headout.

## Table of Contents

- [Development](#development)
  - [Requirements](#requirements)
  - [Developing](#developing)
  - [Contributing](#contributing)
  - [Testing on stage](#testing-on-stage)
  - [Building locally](#building-locally)
  - [Developing for Storybook](#developing-for-storybook)

## Development

### Requirements

- [Node](https://nodejs.org/) (v15 and above)
- [Yarn](https://legacy.yarnpkg.com/) (package manager)
- [Git](https://git-scm.com/) (🧐)

### Developing

- Create a `.env` file in the root of the repository:

  ```bash
  SLACK_GRP_BKNG_WEBHOOK=#Slack webhook
  ZENDESK_GRP_BKNG_TOKEN=#Zendesk Group Booking Token
  NEXT_PUBLIC_HEADOUT_DOMAIN=https://www.headout.com
  ```

- Install dependencies (please use only `yarn` and NOT `npm`):

  ```bash
  yarn
  ```

- Start the development server:

  ```bash
  yarn dev
  ```

- Visit any microbrand using the `mystique_uid` and `lang` param in your query:

  Example:

  ```plaintext
  http://localhost:3001/?mystique_uid=www.thevaticantickets.com&lang=en-us
  ```

### Contributing

- Create a new branch. The naming convention that we follow is:

  ```plaintext
  <type>-<short-description>
  ```

  Example:

  ```plaintext
  ft-arabic-support, fx-annoying-bug, docs-pr-template
  ```

  The type can be one of the following:

  - `ft` - for new features
  - `fx` - for bug fixes
  - `perf` - for performance related changes
  - `ch` - for chores
  - `docs` - for documentation
  - `rf` - for refactoring
    <br/>

- Make your changes and commit them. We follow the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) specification:

  ```plaintext
  <type>[optional scope]: <description>

  [optional body]

  [optional footer(s)]
  ```

  Types include and are limited to:
  | Type | Version bump | Description and used for |
  | :----: | :---: |-----------------------|
  | feat | minor | New features |
  | fix | patch | Fixing bugs |s
  | revert | patch | Reverting commits |
  | perf | patch | Performance improvements |
  | refactor | patch | Refactoring code without changing functionality |
  | build | patch | Build-system changes (deps, webpack, etc.) |
  | chore | patch | General chores like version bump, merges, etc. |
  | ci | patch | CI/CD related changes |
  | docs | none | Documentation |
  | test | none | Adding/improving tests |
  | style | none | Code-style, formatting, white-space, etc |

  - `!` - A commit that appends a `!` after the type/scope, introduces a breaking API change. A BREAKING CHANGE can be part of commits of any type and introduces a major version bump.
  - Before commits are made, pre-commit hooks run `eslint` & `commitlint` to ensure code consistency. It is **NOT recommended** to use `git commit --no-verify` to skip these checks and commit your changes.

- Raise a pull request

  - Make sure to fill the PR template properly. Feel free to delete the parts of the template that you feel are not relevant to your PR.
  - Please make sure to add the appropriate labels to your PR:

    - `Pod-<pod-name>` - for PRs related to pipeline projects in a pod
    - `Bug` - for PRs related to on-call bugs
    - `WIP` - for PRs that are not ready for review yet (you can also consider using the draft PR feature of GitHub in this case)
    - `DO NOT MERGE` - for PRs that are ready for review but should not be merged yet
    - `QA Pending` / `QA Approved` - for PRs that are going through QA / have been approved by QA respectively

  - Squash and merge to `master` and create a new release. [Here's a Notion doc on how we make releases.](https://www.notion.so/headouthub/How-do-I-make-a-release-ebbc384f4d1840e59fd674bf8277172c#8114c53a14a245ea9d0d75f305328f3f)

### Testing on stage

- Before testing your build on stage, please ensure that you have locked `mystique-stage` in [#alert-environment-locks](https://headout.slack.com/archives/C01899K206T) channel on Slack

- Once deployed on stage, microbrand types use their own subdomain - `www-stage.<domain>.com`

  Example:

  ```plaintext
  https://www-stage.thevaticantickets.com
  ```

- However, not all microbrands have a subdomain. For microbrands that do not have a subdomain, go to https://stage-microbrands.headout.com/?mystique_uid=www.tickets-paris.fr.louvre-museum&lang=en-us, where `www.tickets-paris.fr.louvre-museum` is the Prismic UID of the microbrand.

- Microbrands that are on a subpath (for example, www.tickets-paris.fr/louvre-museum) use a `.` as separator instead of a `/` when used in `mystique_uid` query param (see the previous example)

### Building locally

- Build the Next app:

  ```bash
  yarn build
  ```

- Start the built app:

  ```bash
  yarn start
  ```

### Developing for Storybook

!!! warning We currently do not support Storybook documentation/development

[Storybook documentation](https://headout.github.io/mystique/)

- Run Storybook:

  ```bash
  yarn storybook
  ```

- Build Storybook:

  ```bash
  yarn build-storybook
  ```

- Deploy Storybook to Github Pages:

  ```bash
  yarn deploy-storybook
  ```
