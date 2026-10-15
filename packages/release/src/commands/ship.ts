/**
 * Releases the package versions not on npm yet: run by publish.yml on every
 * push to main, so merging an approved release PR (`pnpm release:prepare`)
 * publishes it, with no other manual step.
 *
 * --plan finds them: the public packages whose package.json version isn't on
 * npm, with the commit that set that version (the version bump of the release
 * PR). publish.yml checks that commit out, builds and tests the packages, then
 * runs `cl-release ship`, which, dependencies first, for each package:
 *
 *   - tags the version on that commit (`<dir>-v<version>`), unless tagged;
 *   - publishes it to npm (pnpm publish, OIDC trusted publishing, provenance);
 *   - publishes its GitHub release with the notes of its commits (a draft
 *     left by the previous flow is published instead).
 *
 * publish.yml then posts one Slack message per package published to npm.
 *
 * Versions bumped by different commits are released one commit per run,
 * oldest first: a run reports what is left, and the next push (or a manual
 * run of publish.yml) releases it. A run interrupted halfway resumes where it
 * stopped: what is on npm is skipped, existing tags and releases are reused.
 */
import { execFileSync } from 'node:child_process'
import { appendFileSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import semver from 'semver'
import { parse } from '../args.ts'
import { fail, git, onNpm, type Package, previousRelease, publicPackages, sortByDependencies, tagOf, workspaceDeps } from '../workspace.ts'
import { buildNotes } from './notes.ts'
import { publishToNpm } from './publish.ts'
import { versionCommit } from './tag.ts'

const USAGE = `Usage: cl-release ship [--plan] [--dry-run]
  --plan     print the release to make (commit, packages), as $GITHUB_OUTPUT lines
  --dry-run  tag, publish and release nothing (pnpm publish --dry-run)`

/** A release to make: the packages whose version one commit set */
export type ShipGroup = { commit: string; packages: Package[] }

/**
 * The pending versions grouped by the commit that set them, oldest commit
 * first; the packages of each group in dependency order.
 */
export const planShip = (pending: { pkg: Package; commit: string; time: number }[]): ShipGroup[] => {
  const groups = new Map<string, { time: number; packages: Package[] }>()
  for (const { pkg, commit, time } of pending) {
    const group = groups.get(commit) ?? { time, packages: [] }
    group.packages.push(pkg)
    groups.set(commit, group)
  }
  return [...groups.entries()]
    .sort(([, a], [, b]) => a.time - b.time)
    .map(([commit, { packages }]) => ({ commit, packages: sortByDependencies(packages) }))
}

/** The public packages whose version isn't on npm yet, grouped (prereleases are never released) */
const pendingGroups = (): ShipGroup[] =>
  planShip(
    publicPackages()
      .filter((pkg) => !semver.prerelease(pkg.version) && !onNpm(pkg.name, pkg.version))
      .map((pkg) => {
        const commit = versionCommit(pkg)
        return { pkg, commit, time: Number(git('log', '-1', '--format=%ct', commit)) }
      }),
  )

const output = (lines: Record<string, string>): void => {
  for (const [k, v] of Object.entries(lines)) console.log(`${k}=${v}`)
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, Object.entries(lines).map(([k, v]) => `${k}=${v}\n`).join(''))
}

const gh = (...args: string[]): string => execFileSync('gh', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()

const releaseExists = (tag: string): boolean => {
  try {
    gh('release', 'view', tag, '--json', 'tagName')
    return true
  } catch {
    return false
  }
}

const remoteTagCommit = (tag: string): string | undefined => {
  const line = git('ls-remote', '--tags', 'origin', `refs/tags/${tag}^{}`) || git('ls-remote', '--tags', 'origin', `refs/tags/${tag}`)
  return line ? line.split(/\s+/)[0] : undefined
}

export const run = async (args: string[]): Promise<void> => {
  const { values } = parse(args, { plan: { type: 'boolean' }, 'dry-run': { type: 'boolean' } }, USAGE)
  const dry = Boolean(values['dry-run'])
  const groups = pendingGroups()

  if (values.plan) {
    const [first] = groups
    output({
      commit: first?.commit ?? '',
      packages: first?.packages.map((p) => p.name).join(' ') ?? '',
      dirs: first?.packages.map((p) => p.dir).join(' ') ?? '',
      // pnpm --filter arguments of the packages and their workspace dependencies, to build and test them
      filters: first?.packages.map((p) => `--filter=${p.name}...`).join(' ') ?? '',
    })
    if (groups.length === 0) console.log('Nothing to release: every package version is on npm.')
    for (const g of groups.slice(1)) console.log(`::notice::Also pending, for the next run: ${g.packages.map((p) => `${p.name}@${p.version}`).join(', ')} (${g.commit.slice(0, 8)})`)
    return
  }

  const [group] = groups
  if (!group) {
    console.log('Nothing to release: every package version is on npm.')
    return
  }
  if (git('rev-parse', 'HEAD') !== group.commit) fail(`Check out ${group.commit} first: it set the versions to release (see cl-release ship --plan)`)

  // The workspace dependencies of a release are released with it, or already on npm
  const names = new Set(group.packages.map((p) => p.name))
  const all = new Map(publicPackages().map((p) => [p.name, p]))
  for (const pkg of group.packages) {
    for (const name of workspaceDeps(pkg)) {
      const dep = all.get(name)
      if (dep && !names.has(name) && !onNpm(dep.name, dep.version))
        fail(`${pkg.name} needs ${dep.name}@${dep.version}, which is neither on npm nor in this release. Release it with \`pnpm release:prepare\`.`)
    }
  }

  const tmp = mkdtempSync(join(tmpdir(), 'cl-release-ship-'))
  const released: { name: string; version: string; tag: string; path: string }[] = []
  try {
    for (const pkg of group.packages) {
      const tag = tagOf(pkg)
      console.log(`\n› ${pkg.name}@${pkg.version}`)

      // The tag, on the commit that set the version
      const tagged = remoteTagCommit(tag)
      if (tagged && tagged !== group.commit) fail(`${tag} already exists on ${tagged.slice(0, 8)}, not on ${group.commit.slice(0, 8)}`)
      if (!tagged && !dry) {
        git('tag', '--annotate', '--force', tag, group.commit, '--message', `${pkg.name} v${pkg.version}`)
        git('push', '--quiet', 'origin', `refs/tags/${tag}`)
        console.log(`✓ Tagged ${tag}`)
      }

      // npm first: a failed publish leaves no release behind, and the next run retries it
      if (onNpm(pkg.name, pkg.version)) console.log(`· ${pkg.name}@${pkg.version} is already on npm`)
      else {
        publishToNpm(pkg, { dry })
        // Announced by the run that publishes it, not again by a run that resumes
        released.push({ name: pkg.name, version: pkg.version, tag, path: pkg.path })
      }

      // The GitHub release, with the notes of the package's commits
      const previous = previousRelease(pkg)
      const notes = await buildNotes({ pkg, version: pkg.version, tag, to: group.commit, previous, date: git('log', '-1', '--format=%cs', group.commit) })
      const notesFile = join(tmp, `${pkg.dir}.md`)
      writeFileSync(notesFile, `${notes}\n`)
      const title = `${pkg.name} v${pkg.version}`
      // Only the CLI is the repository's "latest" release
      const latest = pkg.dir === 'cli' ? 'true' : 'false'
      if (dry) console.log(`· Would publish the release ${tag}`)
      else if (releaseExists(tag)) {
        gh('release', 'edit', tag, '--title', title, '--notes-file', notesFile, '--draft=false', `--latest=${latest}`)
        console.log(`✓ Published the release ${tag} (it was a draft)`)
      } else {
        gh('release', 'create', tag, '--verify-tag', '--title', title, '--notes-file', notesFile, `--latest=${latest}`)
        console.log(`✓ Published the release ${tag}`)
      }
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true })
    // Also when a package fails, so the ones published before it are announced:
    // released_json is the matrix of the announce job of publish.yml, one Slack message per package
    const names = released.map((r) => `${r.name}@${r.version}`)
    output({ released: names.join(' '), released_json: JSON.stringify(released) })
    if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `## Published\n\n${names.map((r) => `- \`${r}\``).join('\n')}\n`)
  }

  for (const g of groups.slice(1)) console.log(`::notice::Still pending, for the next run: ${g.packages.map((p) => `${p.name}@${p.version}`).join(', ')}`)
  console.log(`\n✓ ${dry ? 'Would release' : 'Released'} ${released.length} package(s)`)
}
