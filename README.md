# Commerce Layer CLI

Monorepo for the [Commerce Layer](https://commercelayer.io) CLI, its shared libraries and its plugins.

| Package | Path | npm |
| --- | --- | --- |
| Commerce Layer CLI | [`packages/cli`](packages/cli) | [`@commercelayer/cli`](https://www.npmjs.com/package/@commercelayer/cli) |
| CLI core library (internal) | [`packages/core`](packages/core) | [`@commercelayer/cli-core`](https://www.npmjs.com/package/@commercelayer/cli-core) |
| CLI UX library (internal) | [`packages/ux`](packages/ux) | [`@commercelayer/cli-ux`](https://www.npmjs.com/package/@commercelayer/cli-ux) |
| CLI development tools (private) | [`packages/dev`](packages/dev) | not published |
| Code generator (private) | [`packages/generator`](packages/generator) | not published |
| Checkout plugin | [`plugins/checkout`](plugins/checkout) | [`@commercelayer/cli-plugin-checkout`](https://www.npmjs.com/package/@commercelayer/cli-plugin-checkout) |
| Cleanups plugin | [`plugins/cleanups`](plugins/cleanups) | [`@commercelayer/cli-plugin-cleanups`](https://www.npmjs.com/package/@commercelayer/cli-plugin-cleanups) |
| Exports plugin | [`plugins/exports`](plugins/exports) | [`@commercelayer/cli-plugin-exports`](https://www.npmjs.com/package/@commercelayer/cli-plugin-exports) |
| Imports plugin | [`plugins/imports`](plugins/imports) | [`@commercelayer/cli-plugin-imports`](https://www.npmjs.com/package/@commercelayer/cli-plugin-imports) |
| Links plugin | [`plugins/links`](plugins/links) | [`@commercelayer/cli-plugin-links`](https://www.npmjs.com/package/@commercelayer/cli-plugin-links) |
| Metrics plugin | [`plugins/metrics`](plugins/metrics) | [`@commercelayer/cli-plugin-metrics`](https://www.npmjs.com/package/@commercelayer/cli-plugin-metrics) |
| Microstore plugin | [`plugins/microstore`](plugins/microstore) | [`@commercelayer/cli-plugin-microstore`](https://www.npmjs.com/package/@commercelayer/cli-plugin-microstore) |
| Orders plugin | [`plugins/orders`](plugins/orders) | [`@commercelayer/cli-plugin-orders`](https://www.npmjs.com/package/@commercelayer/cli-plugin-orders) |
| Provisioning plugin | [`plugins/provisioning`](plugins/provisioning) | [`@commercelayer/cli-plugin-provisioning`](https://www.npmjs.com/package/@commercelayer/cli-plugin-provisioning) |
| Resources plugin | [`plugins/resources`](plugins/resources) | [`@commercelayer/cli-plugin-resources`](https://www.npmjs.com/package/@commercelayer/cli-plugin-resources) |
| Seeder plugin | [`plugins/seeder`](plugins/seeder) | [`@commercelayer/cli-plugin-seeder`](https://www.npmjs.com/package/@commercelayer/cli-plugin-seeder) |
| Tags plugin | [`plugins/tags`](plugins/tags) | [`@commercelayer/cli-plugin-tags`](https://www.npmjs.com/package/@commercelayer/cli-plugin-tags) |
| Token plugin | [`plugins/token`](plugins/token) | [`@commercelayer/cli-plugin-token`](https://www.npmjs.com/package/@commercelayer/cli-plugin-token) |
| Triggers plugin | [`plugins/triggers`](plugins/triggers) | [`@commercelayer/cli-plugin-triggers`](https://www.npmjs.com/package/@commercelayer/cli-plugin-triggers) |
| Webhooks plugin | [`plugins/webhooks`](plugins/webhooks) | [`@commercelayer/cli-plugin-webhooks`](https://www.npmjs.com/package/@commercelayer/cli-plugin-webhooks) |

See [`packages/cli/README.md`](packages/cli/README.md) for installation and usage.

## Development

Requires Node.js 20+ and [pnpm](https://pnpm.io).

```sh
pnpm install   # install all workspace packages
pnpm build     # build every package
pnpm test      # run every package's tests
pnpm lint      # lint the whole repository
```

Shared dependency versions live in the `catalog:` of `pnpm-workspace.yaml`: packages declare `"<name>": "catalog:"`. `pnpm check:packages` (also run in CI) checks that the packages stay consistent: catalog and workspace dependencies, repository fields, oclif settings, scripts.

Run a single package's script with `pnpm --filter <package name> <script>`, for example `pnpm --filter @commercelayer/cli test`.

## Generated code

Some plugins generate part of their code: `triggers` and `orders` generate a command for each API trigger, and `resources` and `provisioning` generate their resource list. Each of them declares its generator in a `gen.config.ts`, run by the private [`packages/generator`](packages/generator) (`cl-generate`), in the same way as `commercelayer-sdk` does with its `sdk.config.ts`:

- `pnpm generate` (at the root or in a plugin) downloads the schema, updates the plugin's snapshot (`gen/triggers.json`) and regenerates the code.
- `pnpm generate-local` regenerates from the committed snapshot, offline. `resources` and `provisioning` read the installed SDK instead, so there both commands do the same thing.
- CI (`verify.yml`) regenerates everything with `generate-local` and fails if the result differs from what is committed.
- The [Regenerate code](.github/workflows/generate.yml) workflow (manual dispatch) regenerates against an API environment and opens a pull request when something changed.

Don't edit generated files by hand: change the templates (`gen/templates`) or the generator, then regenerate.

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
