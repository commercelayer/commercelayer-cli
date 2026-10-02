#!/usr/bin/env node
/**
 * Publishes the package a release tag points at, together with the workspace
 * dependencies it needs.
 *
 * Never "everything whose version is not on npm": publishing one draft
 * release publishes only that package, plus the workspace dependencies
 * (cli-core, cli-ux, …) whose required version isn't on npm yet. Those are
 * released in the same `chore(release)` PR (scripts/finish-version.mjs), so
 * their tags exist on the same commit; they are published first, from that
 * tree, and reported so publish.yml can mark their draft releases published.
 * A dependency version without a release tag was bumped outside the release
 * flow, and publishing stops.
 *
 * A package already on npm is skipped: it may have been published as the
 * dependency of another one.
 *
 * Each package is published with `pnpm publish`, which runs prepack, rewrites
 * `workspace:` ranges to real versions, and in CI does the OIDC
 * trusted-publishing exchange with npm and attaches provenance. Not
 * `pnpm publish -r`: it would give every package the same dist-tag, and
 * publish any workspace version not on npm, tagged for release or not.
 *
 * The package and its workspace dependencies must be built first.
 *
 * Usage:  node scripts/publish.mjs <tag> [--dry-run]
 */
import { execFileSync } from 'node:child_process'
import { appendFileSync } from 'node:fs'
import { git, listPackages, resolveTag, tagOf, workspaceDeps } from './lib/workspace.mjs'

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

if (onNpm(pkg.name, pkg.version)) {
  console.log(`${pkg.name}@${pkg.version} is already on npm, nothing to publish`)
  process.exit(0)
}

// Workspace dependencies not on npm at the required version, dependencies first
const workspace = new Map(listPackages().map((p) => [p.name, p]))
const tags = new Set(git('tag', '--list', '*-v*').split('\n'))
const toPublish = []
const visit = (p, chain) => {
  for (const name of workspaceDeps(p)) {
    const dep = workspace.get(name)
    if (!dep || toPublish.includes(dep) || onNpm(dep.name, dep.version)) continue
    if (dep.private) fail(`${p.name} depends on the private ${dep.name}`)
    const depTag = tagOf(dep)
    if (!tags.has(depTag)) fail(`${[...chain, p.name].join(' → ')} needs ${dep.name}@${dep.version}, which is not on npm and has no ${depTag} release tag. Release it with \`pnpm release:version\`.`)
    visit(dep, [...chain, p.name])
    toPublish.push(dep)
  }
}
visit(pkg, [])

const publish = (p) => {
  const target = resolveTag(tagOf(p))
  if (target.error) fail(target.error)
  // The release tag is checked out detached: no branch or clean-tree checks
  const args = ['publish', '--access', 'public', '--tag', target.distTag, '--no-git-checks']
  if (process.env.CI) args.push('--provenance')
  if (DRY) args.push('--dry-run')
  console.log(`› pnpm ${args.join(' ')}  (${p.path})`)
  run('pnpm', args, { cwd: p.path, stdio: 'inherit' })
  console.log(`✓ ${DRY ? 'Would publish' : 'Published'} ${p.name}@${p.version} (dist-tag ${target.distTag})`)
}

for (const dep of toPublish) {
  console.log(`› ${pkg.name} needs ${dep.name}@${dep.version}, not on npm yet: publishing it first`)
  publish(dep)
}
publish(pkg)

// Tags of the dependencies published along, for publish.yml
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `published_deps=${toPublish.map((d) => tagOf(d)).join(' ')}\n`)
