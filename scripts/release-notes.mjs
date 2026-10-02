#!/usr/bin/env node
/**
 * Writes the release notes of a package tag, from its Conventional Commits:
 * the commits that touched the package's folder since its previous release,
 * grouped by type (breaking changes, features, bug fixes, …), with links to
 * the commits and the compare view. conventional-changelog (conventionalcommits
 * preset) reads the local git history, so the notes are complete however many
 * commits the range spans (GitHub's generated notes stop at 250).
 *
 * Usage:  node scripts/release-notes.mjs <tag> [previous-tag]
 *   previous-tag  defaults to the package's previous release (as resolve-tag finds it)
 */
import { ConventionalChangelog } from 'conventional-changelog'
import { git, previousRelease, readJson, resolveTag } from './lib/workspace.mjs'

const [tag, previousArg] = process.argv.slice(2)
const pkg = resolveTag(tag ?? '')
if (pkg.error) {
  console.error(`::error::${pkg.error}`)
  process.exit(1)
}
const previous = previousArg || previousRelease(pkg)

// The release date is the tag's, not the day the notes are written
const date = git('log', '-1', '--format=%cs', tag)

const changelog = new ConventionalChangelog()
  .loadPreset('conventionalcommits')
  // Links from the root package.json, not the git remote, which a clone may not point at GitHub
  .repository(readJson('package.json').repository)
  .package({ name: pkg.name, version: pkg.version })
  .tags({ prefix: `${pkg.dir}-v` })
  .commits({ path: pkg.path, ...(previous ? { from: previous } : {}), to: tag })
  .context({ version: pkg.version, date, currentTag: tag, ...(previous ? { previousTag: previous, linkCompare: true } : { linkCompare: false }) })

let notes = ''
for await (const chunk of changelog.write()) notes += chunk
notes = notes.trim()
// The preset hides chore, test, ci, docs, …: say so when that is all there is
if (!notes.includes('\n### ')) notes += `\n\nMaintenance release: no changes to features or fixes since ${previous ?? 'the beginning'} (tests, tooling, dependencies).`
process.stdout.write(`${notes}\n`)
