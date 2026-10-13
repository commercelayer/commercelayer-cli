/**
 * Compares an oclif package's command surface with its latest version on npm.
 *
 * Commands, flags and arguments removed since the published version are
 * breaking for anyone scripting the CLI. If the package's version is not a
 * new major, that is an error; additions are only reported.
 *
 * The package must be built (lib/) first. Packages without oclif commands,
 * and packages not yet on npm, are skipped.
 */
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import semver from 'semver'
import { parse } from '../args.ts'
import { fail, listPackages } from '../workspace.ts'

const USAGE = `Usage: cl-release manifest <dir> [--against <version>] [--warn]
  --against <v>  compare with this published version instead of \`latest\`
  --warn         report breaking changes without failing`

type OclifManifest = { commands: Record<string, { flags?: Record<string, unknown>; args?: Record<string, unknown> }> }

/** Commands, flags and args removed and added from one manifest to the next. */
export const surfaceDiff = (previous: OclifManifest, current: OclifManifest): { removed: string[]; added: string[] } => {
  const removed: string[] = []
  const added: string[] = []
  const names = (o: Record<string, unknown> | undefined) => new Set(Object.keys(o ?? {}))
  for (const [id, before] of Object.entries(previous.commands)) {
    const after = current.commands[id]
    if (!after) {
      removed.push(`command ${id}`)
      continue
    }
    for (const kind of ['flags', 'args'] as const) {
      const label = (name: string) => `${kind.slice(0, -1)} ${id} ${kind === 'flags' ? '--' : ''}${name}`
      const was = names(before[kind])
      const now = names(after[kind])
      for (const name of was) if (!now.has(name)) removed.push(label(name))
      for (const name of now) if (!was.has(name)) added.push(label(name))
    }
  }
  for (const id of Object.keys(current.commands)) if (!previous.commands[id]) added.push(`command ${id}`)
  return { removed, added }
}

export const run = (args: string[]): void => {
  const { values, positionals } = parse(args, { against: { type: 'string', default: 'latest' }, warn: { type: 'boolean' } }, USAGE)
  const dir = positionals[0]

  const pkg = listPackages().find((p) => p.dir === dir) ?? fail(`No package in packages/ or plugins/ named '${dir}'`, '')
  if (pkg.private) {
    console.log(`${pkg.name}: private, skipped`)
    return
  }
  if (!pkg.manifest.oclif?.commands) {
    console.log(`${pkg.name}: no oclif commands, skipped`)
    return
  }

  const exec = (cmd: string, cmdArgs: string[], cwd?: string) => execFileSync(cmd, cmdArgs, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })

  let published: string | undefined
  try {
    published = exec('npm', ['view', `${pkg.name}@${values.against}`, 'version']).trim()
  } catch {}
  if (!published) {
    console.log(`${pkg.name}: not on npm yet, skipped`)
    return
  }

  const tmp = mkdtempSync(join(tmpdir(), 'check-manifest-'))
  try {
    // Current surface, generated from the built package
    exec('pnpm', ['exec', 'oclif', 'manifest'], pkg.path)
    const current = JSON.parse(readFileSync(join(pkg.path, 'oclif.manifest.json'), 'utf8'))
    rmSync(join(pkg.path, 'oclif.manifest.json'))

    // Published surface, from the npm tarball
    const [{ filename }] = JSON.parse(exec('npm', ['pack', `${pkg.name}@${published}`, '--json', '--pack-destination', tmp]))
    exec('tar', ['-xzf', join(tmp, filename), '-C', tmp, 'package/oclif.manifest.json'])
    const previous = JSON.parse(readFileSync(join(tmp, 'package', 'oclif.manifest.json'), 'utf8'))

    const { removed, added } = surfaceDiff(previous, current)
    console.log(`${pkg.name} ${pkg.version} vs npm ${published}: ${Object.keys(current.commands).length} commands`)
    for (const a of added) console.log(`  + ${a}`)
    for (const r of removed) console.log(`  - ${r}`)

    if (removed.length > 0 && semver.major(pkg.version) <= semver.major(published)) {
      const msg = `${removed.length} command/flag/arg removal(s) since ${published} without a major version bump (${pkg.version})`
      if (values.warn) console.log(`::warning::${pkg.name}: ${msg}`)
      else {
        console.error(`::error::${pkg.name}: ${msg}`)
        process.exitCode = 1
      }
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
}
