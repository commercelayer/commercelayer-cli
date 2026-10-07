#!/usr/bin/env node
/**
 * Tags every public package whose package.json version has no release yet.
 *
 * Run it on an up-to-date base branch after merging a `chore(release)` PR
 * (see scripts/finish-version.mjs). For each package it creates the annotated tag
 * `<dir>-v<version>` on HEAD, unless that tag already exists or the version is
 * already on npm, and then pushes the new tags. Each pushed tag makes
 * release.yml draft a GitHub release; publishing the draft publishes to npm.
 *
 * GitHub does not trigger workflows when more than three tags are pushed at
 * once, so tags are pushed one at a time.
 *
 * Usage:  node scripts/tag.mjs [--base <branch>] [--no-push] [--dry-run]
 */
import { execFileSync } from 'node:child_process'
import { git, publicPackages, tagOf } from './lib/workspace.mjs'

const args = process.argv.slice(2)
const DRY = args.includes('--dry-run')
const NO_PUSH = args.includes('--no-push')
const BASE = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'main'

const fail = (msg) => {
  console.error(`\n✖ ${msg}\n`)
  process.exit(1)
}

if (git('status', '--porcelain')) fail('Working tree is not clean.')
git('fetch', '--quiet', 'origin', BASE, '--tags')
if (git('rev-parse', 'HEAD') !== git('rev-parse', `origin/${BASE}`)) fail(`HEAD is not origin/${BASE}. Check out an up-to-date ${BASE} first.`)

const onNpm = (name, version) => {
  try {
    return execFileSync('npm', ['view', `${name}@${version}`, 'version'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() === version
  } catch {
    return false
  }
}

const existing = new Set(git('tag', '--list', '*-v*').split('\n'))
const created = []
for (const pkg of publicPackages()) {
  const tag = tagOf(pkg)
  if (existing.has(tag)) continue
  if (onNpm(pkg.name, pkg.version)) {
    console.log(`· ${tag}: ${pkg.name}@${pkg.version} is already on npm, not tagging`)
    continue
  }
  console.log(`+ ${tag}`)
  if (!DRY) git('tag', '--annotate', tag, '--message', `${pkg.name} v${pkg.version}`)
  created.push(tag)
}

if (created.length === 0) {
  console.log('Nothing to tag.')
  process.exit(0)
}
if (DRY) {
  console.log('(dry run: no tag created)')
  process.exit(0)
}
if (NO_PUSH) {
  console.log(`\nCreated ${created.length} tag(s). Push each with \`git push origin <tag>\`.`)
  process.exit(0)
}
for (const tag of created) git('push', '--quiet', 'origin', `refs/tags/${tag}`)
console.log(`\n✓ Pushed ${created.length} tag(s). Review and publish the draft releases on GitHub to publish to npm.`)
