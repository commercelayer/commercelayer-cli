# @commercelayer/cli-release

Private workspace package, not published. The release tooling of the monorepo, run from the root scripts and the workflows.

## Releasing

1. `pnpm release:publish` bumps the changed packages and opens the `chore(release)` pull request, with the release notes of each package in its description.
2. A reviewer approves it, and it is merged.
3. publish.yml, on the push to main, publishes the versions not on npm (`cl-release ship`): it builds and tests them from the commit that set them, then, dependencies first, tags each version, publishes it to npm (OIDC, provenance) and publishes its GitHub release. One Slack message lists the release.

A release that stopped halfway resumes by running publish.yml by hand: what is on npm is skipped.

## Commands

```sh
cl-release version [--interactive | --yes] [--base <b>] [--no-pr] [--dry-run]   # pnpm release:publish
cl-release ship [--plan] [--dry-run]                                             # publish.yml
cl-release tag [--base <b>] [--no-push] [--dry-run]                              # manual recovery
cl-release try [<plugin dir>...] [--out <dir>]                                   # pnpm release:try
cl-release labels [--check]                                                      # pnpm release:config
cl-release resolve <tag>                        # manual recovery
cl-release notes <tag> [previous-tag]
cl-release publish <tag> [--dry-run]            # manual recovery: one tag
cl-release manifest <dir> [--against <v>] [--warn]   # verify.yml, publish.yml
```

`cl-release <command> --help` shows the options of a command. It runs at the workspace root wherever it is started from.

The sources are TypeScript run through tsx (`bin/cl-release.mjs`), with no build step. Each command is a module of `src/commands`; `src/workspace.ts` has the helpers they share (packages, tags, npm). The pure parts are unit tested (`pnpm --filter @commercelayer/cli-release test`).
