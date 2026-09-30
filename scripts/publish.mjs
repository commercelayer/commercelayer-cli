#!/usr/bin/env node
/**
 * Publishes the single package a release tag points at.
 *
 * Only that package is published, never "everything whose version is not on
 * npm": publishing one draft release must not publish the others.
 *
 * Before publishing it checks that every workspace dependency the package
 * declares (`workspace:` ranges) is already on npm at its current version, so
 * a plugin never ships depending on a cli-core that was bumped but not
 * published yet: publish the dependency's release first.
 *
 * `pnpm pack` builds the tarball (running prepack, and rewriting `workspace:`
 * ranges to real versions); `npm publish` uploads it, which lets npm do the
 * OIDC trusted-publishing exchange and attach provenance in CI.
 *
 * The package and its workspace dependencies must be built first.
 *
 * Usage:  node scripts/publish.mjs <tag> [--dry-run]
 */
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { listPackages, resolveTag } from './lib/workspace.mjs'

const [tag, ...rest] = process.argv.slice(2)
const DRY = rest.includes('--dry-run')

const fail = (msg) => {
  console.error(`::error::${msg}`)
  process.exit(1)
}

const pkg = resolveTag(tag ?? '')
if (pkg.error) fail(pkg.error)

const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { encoding: 'utf8', ...opts })
const onNpm = (name, version) => {
  try {
    return run('npm', ['view', `${name}@${version}`, 'version'], { stdio: ['ignore', 'pipe', 'ignore'] }).trim() === version
  } catch {
    return false
  }
}

if (onNpm(pkg.name, pkg.version)) fail(`${pkg.name}@${pkg.version} is already on npm`)

const workspace = new Map(listPackages().map((p) => [p.name, p]))
const { dependencies = {}, peerDependencies = {}, optionalDependencies = {} } = pkg.manifest
const missing = Object.entries({ ...dependencies, ...peerDependencies, ...optionalDependencies })
  .filter(([, range]) => range.startsWith('workspace:'))
  .map(([name]) => workspace.get(name))
  .filter((dep) => dep && !onNpm(dep.name, dep.version))
  .map((dep) => `${dep.name}@${dep.version}`)
if (missing.length > 0) fail(`${pkg.name} depends on ${missing.join(', ')}, not on npm yet. Publish that release first.`)

const out = mkdtempSync(join(tmpdir(), 'publish-'))
try {
  console.log(`› Packing ${pkg.name}@${pkg.version}`)
  run('pnpm', ['pack', '--pack-destination', out], { cwd: pkg.path, stdio: 'inherit' })
  const tarball = run('ls', [out]).trim().split('\n')[0]
  const args = ['publish', resolve(out, tarball), '--access', 'public', '--tag', pkg.distTag]
  if (process.env.CI) args.push('--provenance')
  if (DRY) args.push('--dry-run')
  console.log(`› npm ${args.join(' ')}`)
  run('npm', args, { stdio: 'inherit' })
  console.log(`✓ ${DRY ? 'Would publish' : 'Published'} ${pkg.name}@${pkg.version} (dist-tag ${pkg.distTag})`)
} finally {
  rmSync(out, { recursive: true, force: true })
}
