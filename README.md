# Mystique - Microbrands @ Headout

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://www.conventionalcommits.org/en/v1.0.0/)

Mystique is the tech that powers over 2500 different microbrands at Headout.

## Table of Contents

- [Development](#development)
  - [Requirements](#requirements)
  - [Developing](#developing)
  - [Generating Prismic Types](#generating-prismic-types)
  - [Building locally](#building-locally)
  - [Testing on On-demand Environment (ODE)](#testing-on-ondemand-environment-ode)
  - [Contributing](#contributing)

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
  NEXT_PUBLIC_USE_PRISMIC_FROM_CDN=true
  ```

(`NEXT_PUBLIC_USE_PRISMIC_FROM_CDN` is used to determine if the Prismic client should be fetched from the CDN or nextjs' own server.)

- Create a `.npmrc` file with the following content in the root of the repository. Replace the npm auth token with the actual token - get this from any developer.

  ```bash
  registry=https://registry.yarnpkg.com/

  @headout:registry=https://npm.pkg.github.com
  //npm.pkg.github.com/:_authToken={NPM_AUTH_TOKEN}
  always-auth=true
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

### Generating Prismic Types

1. Add `PRISMIC_CUSTOM_TYPES_API_TOKEN` variable to local env.
2. You can copy the token from `Prismic > Settings > API & Security`
3. Select `Custom Types API` instead of `Content API`.
4. Copy the code for `Mystique Typescript`.
5. If you are not able to find the code feel free to create a new one with relevant app name.
6. Use the following command in the root of the project

```bash
  npx prismic-ts-codegen
```

7. Above code will update `types.prismic.d.ts` with the latest types

> [!WARNING]  
> Please ensure that you are not committing PRISMIC_CUSTOM_TYPES_API_TOKEN to git

### Building locally

- Build the Next app:

  ```bash
  yarn build
  ```

- Start the built app:

  ```bash
  yarn start
  ```

### Testing on Ondemand Environment (ODE)

- To access nimbus, go to [nimbus](https://nimbus.dev-headout.com/).
- If you don't have access, ask @platform-oncall for permission or talk to your team lead.
- To learn how to create a test environment on ODE, watch this [loom video](https://www.loom.com/share/4e536bfc963e4d0a8a940c6b6affd0dd?sid=c0d2feff-edf0-43bb-9c49-4e733c2edcb).
- If you're wondering what nimbus is, check out [this announcement](https://headout.slack.com/archives/C03RJMW6BDM/p1695209954862449).

- Visit any microbrand using the mystique_uid and lang param in your query:
  ```plaintext
  https://<ode-url>/?mystique_uid=www.thevaticantickets.com&lang=en-us
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

  - Squash and merge to `main` and create a new release. [Here's a Notion doc on how we make releases.](https://www.notion.so/headouthub/How-do-I-make-a-release-ebbc384f4d1840e59fd674bf8277172c#8114c53a14a245ea9d0d75f305328f3f)
