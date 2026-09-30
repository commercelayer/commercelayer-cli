#!/usr/bin/env node
/**
 * Compares an oclif package's command surface with its latest version on npm.
 *
 * Commands, flags and arguments removed since the published version are
 * breaking for anyone scripting the CLI. If the package's version is not a
 * new major, that is an error; additions are only reported.
 *
 * The package must be built (lib/) first. Packages without oclif commands,
 * and packages not yet on npm, are skipped.
 *
 * Usage:  node scripts/check-manifest.mjs <dir> [--against <version>] [--warn]
 *   --against <v>  compare with this published version instead of `latest`
 *   --warn         report breaking changes without failing
 */
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { listPackages } from './lib/workspace.mjs'

const [dir, ...rest] = process.argv.slice(2)
const WARN = rest.includes('--warn')
const AGAINST = rest.includes('--against') ? rest[rest.indexOf('--against') + 1] : 'latest'

const pkg = listPackages().find((p) => p.dir === dir)
if (!pkg) {
  console.error(`No package in packages/ or plugins/ named '${dir}'`)
  process.exit(1)
}
if (!pkg.manifest.oclif?.commands) {
  console.log(`${pkg.name}: no oclif commands, skipped`)
  process.exit(0)
}

const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })

let published
try {
  published = run('npm', ['view', `${pkg.name}@${AGAINST}`, 'version']).trim()
} catch {}
if (!published) {
  console.log(`${pkg.name}: not on npm yet, skipped`)
  process.exit(0)
}

const tmp = mkdtempSync(join(tmpdir(), 'check-manifest-'))
try {
  // Current surface, generated from the built package
  run('pnpm', ['exec', 'oclif', 'manifest'], pkg.path)
  const current = JSON.parse(readFileSync(join(pkg.path, 'oclif.manifest.json'), 'utf8'))
  rmSync(join(pkg.path, 'oclif.manifest.json'))

  // Published surface, from the npm tarball
  const [{ filename }] = JSON.parse(run('npm', ['pack', `${pkg.name}@${published}`, '--json', '--pack-destination', tmp]))
  run('tar', ['-xzf', join(tmp, filename), '-C', tmp, 'package/oclif.manifest.json'])
  const previous = JSON.parse(readFileSync(join(tmp, 'package', 'oclif.manifest.json'), 'utf8'))

  const removed = []
  const added = []
  const names = (o) => new Set(Object.keys(o ?? {}))
  for (const [id, before] of Object.entries(previous.commands)) {
    const after = current.commands[id]
    if (!after) {
      removed.push(`command ${id}`)
      continue
    }
    for (const kind of ['flags', 'args']) {
      const now = names(after[kind])
      for (const name of names(before[kind])) if (!now.has(name)) removed.push(`${kind.slice(0, -1)} ${id} ${kind === 'flags' ? '--' : ''}${name}`)
      for (const name of now) if (!names(before[kind]).has(name)) added.push(`${kind.slice(0, -1)} ${id} ${kind === 'flags' ? '--' : ''}${name}`)
    }
  }
  for (const id of Object.keys(current.commands)) if (!previous.commands[id]) added.push(`command ${id}`)

  console.log(`${pkg.name} ${pkg.version} vs npm ${published}: ${Object.keys(current.commands).length} commands`)
  for (const a of added) console.log(`  + ${a}`)
  for (const r of removed) console.log(`  - ${r}`)

  const major = (v) => Number(v.split('.')[0])
  if (removed.length > 0 && major(pkg.version) <= major(published)) {
    const msg = `${removed.length} command/flag/arg removal(s) since ${published} without a major version bump (${pkg.version})`
    if (WARN) console.log(`::warning::${pkg.name}: ${msg}`)
    else {
      console.error(`::error::${pkg.name}: ${msg}`)
      process.exitCode = 1
    }
  }
} finally {
  rmSync(tmp, { recursive: true, force: true })
}
