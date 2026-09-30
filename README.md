# Commerce Layer CLI

Monorepo for the [Commerce Layer](https://commercelayer.io) CLI, its shared libraries and its plugins.

| Package | Path | npm |
| --- | --- | --- |
| Commerce Layer CLI | [`packages/cli`](packages/cli) | [`@commercelayer/cli`](https://www.npmjs.com/package/@commercelayer/cli) |
| CLI core library | [`packages/core`](packages/core) | [`@commercelayer/cli-core`](https://www.npmjs.com/package/@commercelayer/cli-core) |
| CLI UX library | [`packages/ux`](packages/ux) | [`@commercelayer/cli-ux`](https://www.npmjs.com/package/@commercelayer/cli-ux) |
| CLI development tools | [`packages/dev`](packages/dev) | [`@commercelayer/cli-dev`](https://www.npmjs.com/package/@commercelayer/cli-dev) |

See [`packages/cli/README.md`](packages/cli/README.md) for installation and usage.

## Development

Requires Node.js 20+ and [pnpm](https://pnpm.io).

```sh
pnpm install   # install all workspace packages
pnpm build     # build every package
pnpm test      # run every package's tests
pnpm lint      # lint the whole repository
```

Run a single package's script with `pnpm --filter <package name> <script>`, for example `pnpm --filter @commercelayer/cli test`.

## Releasing

Every package is versioned and released on its own. A release starts from a tag `<dir>-v<version>`, where `<dir>` is the package's directory (`cli-v6.10.0`, `core-v5.12.0`, `orders-v5.7.0`).

1. **Bump**: on an up-to-date `main`, run `pnpm release:version`. Only packages with commits touching their folder since their last tag are released. Each one's version is derived from those commits (breaking → major, `feat` → minor, anything else → patch), and you confirm the whole plan once. Use `--interactive` to change or skip single packages, `--yes` to skip the confirmation, `--preid <id>` for a prerelease (`x.y.z-<id>.n`, published under the `<id>` dist-tag). The bumps go on a `release/…` branch and a `chore(release)` pull request. Packages depending on a released one aren't bumped: they pick it up through their `^` range.
2. **Tag**: after merging it, on an up-to-date `main` run `pnpm release:tag`. It tags the merge commit for every package whose version isn't released yet and pushes the tags.
3. **Draft**: each tag makes [release.yml](.github/workflows/release.yml) draft a GitHub release, with notes built from the titles and labels of the PRs that touched that package.
4. **Publish**: publishing the draft makes [publish.yml](.github/workflows/publish.yml) build and test the package from the tag, check its command surface against npm, publish it to npm with provenance and announce it on Slack.

When a release depends on another unreleased package (for example a plugin needing a new `cli-core`), publish the dependency's release first: `publish.yml` refuses to publish a package whose workspace dependencies aren't on npm yet.

PRs get a `pkg:<dir>` label from the files they touch; that's how each release lists only its own changes. After adding or removing a package, run `pnpm release:config` and commit the generated `.github/labeler.yml` and `.github/release-*.yml`.

## License

[MIT](LICENSE)
