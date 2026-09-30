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

## License

[MIT](LICENSE)
