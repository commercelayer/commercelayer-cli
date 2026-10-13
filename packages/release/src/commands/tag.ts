/**
 * Tags every public package whose package.json version has no release yet.
 *
 * Run it on an up-to-date base branch after merging a `chore(release)` PR
 * (`cl-release version`). For each package it creates the annotated tag
 * `<dir>-v<version>`, unless that tag already exists or the version is
 * already on npm, and then pushes the new tags. Each pushed tag makes
 * release.yml draft a GitHub release; `pnpm release:publish` (or publishing
 * the draft on GitHub) publishes to npm.
 *
 * The tag goes on the commit that set the version in the package.json (the
 * version bump of the release PR), not on HEAD: a pull request merged after
 * the release PR doesn't end up in the release.
 *
 * GitHub does not trigger workflows when more than three tags are pushed at
 * once, so tags are pushed one at a time.
 */
import { parse } from '../args.ts'
import { git, onNpm, type Package, publicPackages, requireUpToDate, tagOf } from '../workspace.ts'

const USAGE = `Usage: cl-release tag [--base <branch>] [--no-push] [--dry-run]
  --base <b>  branch HEAD must be (default: main)
  --no-push   create the tags locally only
  --dry-run   show the tags and create none`

/**
 * The commit that set the current version of a package: the last one that
 * changed the "version" line of its package.json (merge commits show no
 * diff, so it's the version bump itself). HEAD for a version never bumped.
 */
export const versionCommit = (pkg: Pick<Package, 'path'>): string =>
  git('log', '-1', '--format=%H', '-G', '"version":', '--', `${pkg.path}/package.json`) || git('rev-parse', 'HEAD')

export const run = (args: string[]): void => {
  const { values } = parse(args, { base: { type: 'string', default: 'main' }, 'no-push': { type: 'boolean' }, 'dry-run': { type: 'boolean' } }, USAGE)
  const dry = values['dry-run']

  requireUpToDate(values.base)

  const existing = new Set(git('tag', '--list', '*-v*').split('\n'))
  const created: string[] = []
  for (const pkg of publicPackages()) {
    const tag = tagOf(pkg)
    if (existing.has(tag)) continue
    if (onNpm(pkg.name, pkg.version)) {
      console.log(`· ${tag}: ${pkg.name}@${pkg.version} is already on npm, not tagging`)
      continue
    }
    const commit = versionCommit(pkg)
    console.log(`+ ${tag}  (${git('log', '-1', '--format=%h %s', commit)})`)
    if (!dry) git('tag', '--annotate', tag, commit, '--message', `${pkg.name} v${pkg.version}`)
    created.push(tag)
  }

  if (created.length === 0) {
    console.log('Nothing to tag.')
    return
  }
  if (dry) {
    console.log('(dry run: no tag created)')
    return
  }
  if (values['no-push']) {
    console.log(`\nCreated ${created.length} tag(s). Push each with \`git push origin <tag>\`.`)
    return
  }

  for (const tag of created) git('push', '--quiet', 'origin', `refs/tags/${tag}`)
  console.log(`\n✓ Pushed ${created.length} tag(s). Review and publish the draft releases on GitHub to publish to npm.`)
}
