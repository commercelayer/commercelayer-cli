/**
 * Installs the working tree's CLI and plugins in a sandbox, to try them as a
 * user would before a release: packed like for npm, nothing published.
 *
 * The CLI, cli-core, cli-ux and the chosen plugins (all of them by default)
 * are built and packed (oclif manifest included), the CLI is installed in
 * <sandbox>/cli, and the plugins in its data folder (<sandbox>/data) as user
 * plugins, as `plugins:install` does: cli-core and cli-ux come from the packed
 * tarballs, so unreleased versions work too. The sandbox has its own config,
 * data and cache folders: logins made there don't touch the real ones.
 *
 * Then run the CLI with <sandbox>/commercelayer, e.g. `.release-try/commercelayer plugins`.
 */
import { type ExecFileSyncOptions, execFileSync } from 'node:child_process'
import { chmodSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { parse } from '../args.ts'
import { fail, type Package, publicPackages, workspaceDeps } from '../workspace.ts'

const USAGE = `Usage: pnpm release:try [<plugin dir>...] [--out <dir>]
  <plugin dir>  plugins to install, e.g. tags orders (default: all)
  --out <dir>   sandbox folder (default: .release-try)`

/** The packages a set of packages needs: themselves and their workspace dependencies, transitively. */
export const withWorkspaceDeps = (roots: Package[], packages: Package[]): Set<Package> => {
  const byName = new Map(packages.map((p) => [p.name, p]))
  const selected = new Set<Package>()
  const add = (p: Package): void => {
    if (selected.has(p)) return
    selected.add(p)
    for (const name of workspaceDeps(p)) {
      const dep = byName.get(name)
      if (dep) add(dep)
    }
  }
  for (const p of roots) add(p)
  return selected
}

export const run = (args: string[]): void => {
  const { values, positionals } = parse(args, { out: { type: 'string', default: '.release-try' } }, USAGE)
  // Relative to where pnpm was run from, not to the workspace root
  const out = resolve(process.env.INIT_CWD ?? process.cwd(), values.out)
  const exec = (cmd: string, cmdArgs: string[], opts: ExecFileSyncOptions = {}) => execFileSync(cmd, cmdArgs, { stdio: 'inherit', ...opts })

  const packages = publicPackages()
  const cli = packages.find((p) => p.dir === 'cli') ?? fail('No CLI package in packages/cli')
  const allPlugins = packages.filter((p) => p.path.startsWith('plugins/'))
  const plugins = positionals.length ? positionals.map((dir) => allPlugins.find((p) => p.dir === dir) ?? fail(`No plugin in plugins/${dir}`)) : allPlugins

  // The CLI, the plugins and the workspace packages they depend on
  const selected = withWorkspaceDeps([cli, ...plugins], packages)
  const isOclif = (p: Package) => Boolean(p.manifest.oclif?.commands)

  console.log(`› Building ${[...selected].map((p) => p.dir).join(', ')}`)
  exec('pnpm', ['--silent', ...[...selected].flatMap((p) => ['--filter', p.name]), 'build'])

  rmSync(out, { recursive: true, force: true })
  const tgz = join(out, 'tgz')
  mkdirSync(tgz, { recursive: true })

  // Packed without the lifecycle scripts: prepack would also regenerate and
  // git add the README; the oclif manifest is generated here instead
  const tarballs = new Map<string, string>()
  for (const p of selected) {
    console.log(`› Packing ${p.name}@${p.version}`)
    const before = new Set(readdirSync(tgz))
    if (isOclif(p)) exec('pnpm', ['exec', 'oclif', 'manifest'], { cwd: p.path, stdio: 'ignore' })
    try {
      exec('pnpm', ['pack', '--ignore-scripts', '--pack-destination', tgz], { cwd: p.path, stdio: 'ignore' })
    } finally {
      if (isOclif(p)) rmSync(join(p.path, 'oclif.manifest.json'), { force: true })
    }
    tarballs.set(p.name, `file:${join(tgz, readdirSync(tgz).find((f) => !before.has(f)) as string)}`)
  }

  // The workspace libraries come from the tarballs, also for the plugins
  const overrides = Object.fromEntries([...selected].filter((p) => !isOclif(p)).map((p) => [p.name, tarballs.get(p.name)]))
  const install = (dir: string, manifest: Record<string, unknown>): void => {
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'package.json'), `${JSON.stringify({ private: true, ...manifest, overrides }, null, 2)}\n`)
    exec('npm', ['install', '--no-audit', '--no-fund', '--loglevel=error'], { cwd: dir })
  }

  console.log(`› Installing ${cli.name} in ${join(out, 'cli')}`)
  install(join(out, 'cli'), { name: 'release-try-cli', dependencies: { [cli.name]: tarballs.get(cli.name) } })

  console.log(`› Installing ${plugins.length} plugin(s) as user plugins in ${join(out, 'data')}`)
  install(join(out, 'data'), {
    name: 'release-try-plugins',
    oclif: { schema: 1, plugins: plugins.map((p) => ({ name: p.name, type: 'user', tag: 'latest' })) },
    dependencies: Object.fromEntries(plugins.map((p) => [p.name, tarballs.get(p.name)])),
  })

  // The sandbox's own entry point and folders
  const bin = join(out, 'commercelayer')
  writeFileSync(
    bin,
    `#!/bin/sh
# The CLI and plugins of release-try, with the sandbox's own config, data and cache
SANDBOX="${out}"
export COMMERCELAYER_DATA_DIR="$SANDBOX/data" COMMERCELAYER_CONFIG_DIR="$SANDBOX/config" COMMERCELAYER_CACHE_DIR="$SANDBOX/cache"
export XDG_CONFIG_HOME="$SANDBOX/xdg-config"
exec node "$SANDBOX/cli/node_modules/${cli.name}/bin/run.js" "$@"
`,
  )
  chmodSync(bin, 0o755)

  console.log(`\n✓ ${cli.name}@${cli.version} with ${plugins.map((p) => `${p.dir}@${p.version}`).join(', ')}`)
  console.log(`  Try it:  ${bin} --version`)
}
