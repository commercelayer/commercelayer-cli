# @commercelayer/cli-release

Private workspace package, not published. The release tooling of the monorepo, run from the root scripts and the workflows.

## Releasing

1. `pnpm release:version` bumps the changed packages and opens the `chore(release)` pull request.
2. A reviewer approves it, and it is merged.
3. `pnpm release:tag` tags each new version on its version bump commit; release.yml drafts a GitHub release per tag.
4. `pnpm release:publish` publishes the drafts, dependencies first; publish.yml publishes each package to npm (OIDC, provenance) and posts to Slack.

## Commands

```sh
cl-release version [--interactive | --yes] [--base <b>] [--no-pr] [--dry-run]   # pnpm release:version
cl-release tag [--base <b>] [--no-push] [--dry-run]                              # pnpm release:tag
cl-release try [<plugin dir>...] [--out <dir>]                                   # pnpm release:try
cl-release drafts [<tag>...] [--yes] [--dry-run] [--timeout <m>]                 # pnpm release:publish
cl-release labels [--check]                                                      # pnpm release:config
cl-release resolve <tag>                        # release.yml, publish.yml
cl-release notes <tag> [previous-tag]           # release.yml
cl-release publish <tag> [--dry-run]            # publish.yml
cl-release manifest <dir> [--against <v>] [--warn]   # verify.yml, publish.yml
```

`cl-release <command> --help` shows the options of a command. It runs at the workspace root wherever it is started from.

The sources are TypeScript run through tsx (`bin/cl-release.mjs`), with no build step. Each command is a module of `src/commands`; `src/workspace.ts` has the helpers they share (packages, tags, npm). The pure parts are unit tested (`pnpm --filter @commercelayer/cli-release test`).
