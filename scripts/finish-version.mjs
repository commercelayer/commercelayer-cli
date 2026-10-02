#!/usr/bin/env node
/**
 * Bumps the version of the packages changed since their last release and
 * opens a `chore(release)` pull request with the bumps.
 *
 * Same role as commercelayer-sdk's finish-version.mjs, without Lerna: Lerna
 * only recognises its own `<name>@<version>` tags, so with `<dir>-v*` tags it
 * would treat all packages as changed on every release.
 *
 * Only packages with commits touching their directory since their last
 * `<dir>-v*` tag are released; the others are left alone. Each one's version
 * is derived from those commits' Conventional Commit types by
 * conventional-recommended-bump (breaking -> major, feat -> minor, anything
 * else -> patch). Packages depending on a released one
 * are not bumped: they pick it up through their `^` range, and adopting a new
 * major of a dependency is a change of its own.
 *
 * By default it prints the plan and asks for a single confirmation;
 * --interactive lets you change or skip each package's version.
 *
 * Nothing is committed to the base branch: the bumps go on a `release/…`
 * branch and a pull request. Once it is merged, `pnpm release:tag` tags the
 * merge commit, and pushing the tags drafts the GitHub releases.
 *
 * Usage:  node scripts/finish-version.mjs [--interactive | --yes] [--base <branch>] [--no-pr] [--dry-run]
 *   --interactive   confirm, change or skip each package's version
 *   --yes           no confirmation at all
 *   --base <b>    branch the release PR targets (default: main)
 *   --no-pr       commit on a local release branch only, do not push or open a PR
 *   --dry-run     show what would happen and change nothing
 */
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { Bumper } from 'conventional-recommended-bump'
import semver from 'semver'
import { git, lastTag, publicPackages, readJson, sortByDependencies, tagOf, workspaceDeps, writeJson } from './lib/workspace.mjs'

const args = process.argv.slice(2)
const flag = (name) => args.includes(name)
const option = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback)

const DRY = flag('--dry-run')
const YES = flag('--yes')
const INTERACTIVE = flag('--interactive')
const NO_PR = flag('--no-pr')
const BASE = option('--base', 'main')

const fail = (msg) => {
  console.error(`\n✖ ${msg}\n`)
  process.exit(1)
}

if (git('status', '--porcelain')) fail('Working tree is not clean.')
git('fetch', '--quiet', 'origin', BASE, '--tags')
if (git('rev-parse', 'HEAD') !== git('rev-parse', `origin/${BASE}`)) fail(`HEAD is not origin/${BASE}. Check out an up-to-date ${BASE} first.`)

/**
 * The next version for a bump level. Only stable versions are released:
 * a prerelease left in a package.json (x.y.z-beta.n) is released as x.y.z.
 * Prereleases aren't published to npm: try a release with `pnpm release:try`,
 * or share a pkg.pr.new preview (preview.yml).
 */
const bump = (version, level) => (semver.prerelease(version) ? semver.inc(version, 'release') : semver.inc(version, level))

/**
 * The bump level of a package's commits since a tag, from the Conventional
 * Commits preset (breaking -> major, feat -> minor, anything else -> patch),
 * and the header of the commit that decides it, shown in the plan.
 */
const recommend = async (pkg, since) => {
  const { releaseType, commits } = await new Bumper()
    .loadPreset('conventionalcommits')
    .tag(since ?? '')
    .commits({ path: pkg.path })
    .bump()
  const level = releaseType ?? 'patch'
  const breaking = (c) => c.notes.length > 0
  const decisive = level === 'major' ? commits.find(breaking) : level === 'minor' ? commits.find((c) => c.type === 'feat') : undefined
  return { level, why: decisive?.header ?? '' }
}

const candidates = []
for (const pkg of publicPackages()) {
  const since = await lastTag(pkg)
  const range = since ? [`${since}..HEAD`] : []
  const log = git('log', '--no-merges', '--format=%s%x1f%b%x1e', ...range, '--', pkg.path)
  const commits = log
    .split('\x1e')
    .map((c) => c.trim())
    .filter(Boolean)
    .map((c) => c.split('\x1f'))
    .filter(([subject]) => !/^chore\(release\)/.test(subject))
  if (commits.length === 0) continue
  const { level, why } = await recommend(pkg, since)
  candidates.push({ pkg, since, commits, level, why, next: bump(pkg.version, level) })
}

if (candidates.length === 0) {
  console.log('Nothing to release: no package has changed since its last tag.')
  process.exit(0)
}

const rl = YES ? undefined : createInterface({ input: process.stdin })
// Line by line rather than rl.question(), which drops answers piped in ahead of the prompt
const lines = rl?.[Symbol.asyncIterator]()
const ask = async (prompt) => {
  process.stdout.write(prompt)
  const { value } = await lines.next()
  return (value ?? '').trim()
}
let selected = []
if (INTERACTIVE) {
  for (const c of candidates) {
    console.log(`\n${c.pkg.name}  (${c.pkg.path})`)
    console.log(`  ${c.commits.length} commit(s) since ${c.since ?? 'the beginning'}; ${c.level}: ${c.pkg.version} → ${c.next}`)
    for (const [subject] of c.commits.slice(0, 8)) console.log(`    · ${subject}`)
    if (c.commits.length > 8) console.log(`    · … ${c.commits.length - 8} more`)
    const answer = await ask(`  Version [${c.next}] (s to skip, or type a version): `)
    if (answer === 's') continue
    const version = answer || c.next
    if (!semver.valid(version) || semver.prerelease(version)) fail(`'${version}' is not a valid stable version (prereleases aren't published)`)
    selected.push({ ...c, version })
  }
} else {
  selected = candidates.map((c) => ({ ...c, version: c.next }))
  const width = Math.max(...selected.map((s) => s.pkg.name.length))
  console.log(`\n${selected.length} changed package(s):\n`)
  for (const s of selected) {
    const why = s.why || s.commits[0][0]
    console.log(`  ${s.pkg.name.padEnd(width)}  ${s.pkg.version} → ${s.version}  ${s.level}, ${s.commits.length} commit(s): ${why}`)
  }
  if (rl) {
    const answer = (await ask('\nRelease these versions? [y/N] ')).toLowerCase()
    if (answer !== 'y' && answer !== 'yes') {
      console.log('Aborted. Use --interactive to change or skip single packages.')
      process.exit(0)
    }
  }
}
rl?.close()

// A package released with a change in a workspace dependency (cli-core,
// cli-ux, …) needs that change on npm too: unreleased changes of runtime
// workspace dependencies are always released with it, so nobody has to
// release and publish them first by hand.
for (let added = true; added; ) {
  added = false
  for (const s of [...selected]) {
    for (const name of workspaceDeps(s.pkg)) {
      if (selected.some((x) => x.pkg.name === name)) continue
      const dep = candidates.find((c) => c.pkg.name === name)
      if (!dep) continue
      selected.push({ ...dep, version: dep.next })
      console.log(`+ ${dep.pkg.name} ${dep.pkg.version} → ${dep.next}: unreleased changes, required by ${s.pkg.name}`)
      added = true
    }
  }
}
// Dependencies first, so tags, drafts and publishing follow the same order
const order = sortByDependencies(selected.map((s) => s.pkg))
selected.sort((a, b) => order.indexOf(a.pkg) - order.indexOf(b.pkg))

if (selected.length === 0) {
  console.log('\nNothing selected.')
  process.exit(0)
}

const tags = selected.map((s) => tagOf(s.pkg, s.version))
const branch = `release/${tags.length === 1 ? tags[0] : new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '')}`
const subject = `chore(release): ${tags.join(', ')}`

console.log(`\n${subject}\n  branch: ${branch}`)
if (DRY) {
  console.log('  (dry run: nothing changed)')
  process.exit(0)
}

git('switch', '--quiet', '-c', branch)
for (const s of selected) {
  const file = join(s.pkg.path, 'package.json')
  const manifest = readJson(file)
  manifest.version = s.version
  writeJson(file, manifest)
  git('add', file)
}
git('commit', '--quiet', '-m', subject)
console.log(`✓ Committed on ${branch}`)

if (NO_PR) {
  console.log(`\nPush it and open a PR to ${BASE}; once merged run \`pnpm release:tag\`.`)
  process.exit(0)
}

git('push', '--quiet', '-u', 'origin', branch)
const body = [
  'Version bumps:',
  '',
  ...selected.map((s) => `- \`${s.pkg.name}\` ${s.pkg.version} → **${s.version}** (\`${tagOf(s.pkg, s.version)}\`)`),
  '',
  'After merging, run `pnpm release:tag` on an up-to-date `' + BASE + '` to tag the merge commit and draft the releases.',
].join('\n')
// The release PR itself has no place in the release notes
execFileSync('gh', ['label', 'create', 'ignore-for-release', '--force', '--color', 'ededed', '--description', 'Excluded from release notes'], {
  stdio: 'ignore',
})
execFileSync('gh',['pr', 'create', '--base', BASE, '--head', branch, '--title', subject, '--body', body, '--label', 'ignore-for-release'], {
  stdio: 'inherit',
})
