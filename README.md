# Commerce Layer CLI

Monorepo for the [Commerce Layer](https://commercelayer.io) CLI, its shared libraries and its plugins.

| Package | Path | npm |
| --- | --- | --- |
| Commerce Layer CLI | [`packages/cli`](packages/cli) | [`@commercelayer/cli`](https://www.npmjs.com/package/@commercelayer/cli) |
| CLI core library (internal) | [`packages/core`](packages/core) | [`@commercelayer/cli-core`](https://www.npmjs.com/package/@commercelayer/cli-core) |
| CLI UX library (internal) | [`packages/ux`](packages/ux) | [`@commercelayer/cli-ux`](https://www.npmjs.com/package/@commercelayer/cli-ux) |
| CLI development tools (private) | [`packages/dev`](packages/dev) | not published |
| Code generator (private) | [`packages/generator`](packages/generator) | not published |
| Test utilities (private) | [`packages/test-utils`](packages/test-utils) | not published |
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

Requires Node.js 22.13+ and [pnpm](https://pnpm.io).

```sh
pnpm install   # install all workspace packages
pnpm build     # build every package
pnpm test      # run every package's tests
pnpm lint      # lint the whole repository
```

Shared dependency versions live in the `catalog:` of `pnpm-workspace.yaml`: packages declare `"<name>": "catalog:"`. `pnpm check:packages` (also run in CI) checks that the packages stay consistent: catalog and workspace dependencies, repository fields, oclif settings, scripts.

Run a single package's script with `pnpm --filter <package name> <script>`, for example `pnpm --filter @commercelayer/cli test`.

### Commit messages

Commits follow [Conventional Commits](https://www.conventionalcommits.org) (`feat(tags): …`, `fix(core): …`, `feat!: …` or a `BREAKING CHANGE:` footer for a major): the release scripts derive each package's version and release notes from them. Pull requests are merged with a merge commit, so every commit counts, and CI checks them with commitlint (`commitlint.config.mjs`). To check a branch before pushing:

```sh
pnpm lint:commits
```

### Tests against the real API

`pnpm test` runs against a mocked API, with no credentials. The integration suites (`test/integration/*.it.ts`) run read-only commands against the real Core API of a test organization; they are skipped unless its credentials are set:

```sh
CL_CLI_ORGANIZATION=<org slug> CL_CLI_CLIENT_ID=<client id> CL_CLI_CLIENT_SECRET=<client secret> pnpm test:integration
```

Use an integration application of a test organization, never a production one. In CI, [integration.yml](.github/workflows/integration.yml) runs them against `cli-test-org` on pushes to `monorepo` and `main`, every night, on demand, and on pull requests that change the suites or the dependencies. They assert on the shape of the output, not on specific records.

The suites that change data (`*-write.it.ts`) only work on resources they create and delete themselves, whose names, emails and references start with `cli-it-`. `node scripts/test/live-sweep.mjs` (run before and after the suites in CI) deletes whatever an interrupted run left behind, and nothing else. The checkout and links suites also need `CL_CLI_SALES_CHANNEL_CLIENT_ID`, the client ID of a sales channel application of the organization, and are skipped without it.

## Generated code

Some plugins generate part of their code: `triggers` and `orders` generate a command for each API trigger, and `resources` and `provisioning` generate their resource list. Each of them declares its generator in a `gen.config.ts`, run by the private [`packages/generator`](packages/generator) (`cl-generate`), in the same way as `commercelayer-sdk` does with its `sdk.config.ts`:

- `pnpm generate` (at the root or in a plugin) downloads the schema, updates the plugin's snapshot (`gen/triggers.json`) and regenerates the code.
- `pnpm generate-local` regenerates from the committed snapshot, offline. `resources` and `provisioning` read the installed SDK instead, so there both commands do the same thing.
- CI (`verify.yml`) regenerates everything with `generate-local` and fails if the result differs from what is committed.
- The [Regenerate code](.github/workflows/generate.yml) workflow (manual dispatch) regenerates against an API environment and opens a pull request when something changed.

Don't edit generated files by hand: change the templates (`gen/templates`) or the generator, then regenerate.

## License

[MIT](LICENSE)
