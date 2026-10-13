/**
 * Writes the release notes of a package tag, from its Conventional Commits:
 * the commits that touched the package's folder since its previous release,
 * grouped by type (breaking changes, features, bug fixes, …), with links to
 * the commits and the compare view. conventional-changelog (conventionalcommits
 * preset) reads the local git history, so the notes are complete however many
 * commits the range spans (GitHub's generated notes stop at 250).
 */
import { ConventionalChangelog } from 'conventional-changelog'
import { parse } from '../args.ts'
import { git, previousRelease, readJson, resolveTagOrFail } from '../workspace.ts'

const USAGE = `Usage: cl-release notes <tag> [previous-tag]
  previous-tag  defaults to the package's previous release (as \`cl-release resolve\` finds it)`

/** The preset hides chore, test, ci, docs, …: say so when that is all there is. */
export const withMaintenanceNote = (notes: string, previous: string | undefined): string =>
  notes.includes('\n### ') ? notes : `${notes}\n\nMaintenance release: no changes to features or fixes since ${previous ?? 'the beginning'} (tests, tooling, dependencies).`

export const run = async (args: string[]): Promise<void> => {
  const { positionals } = parse(args, {}, USAGE)
  const [tag, previousArg] = positionals
  const pkg = resolveTagOrFail(tag)
  const previous = previousArg || previousRelease(pkg)

  // The release date is the tag's, not the day the notes are written
  const date = git('log', '-1', '--format=%cs', pkg.tag)

  const changelog = new ConventionalChangelog()
    .loadPreset('conventionalcommits')
    // Links from the root package.json, not the git remote, which a clone may not point at GitHub
    .repository(readJson('package.json').repository)
    .package({ name: pkg.name, version: pkg.version })
    .tags({ prefix: `${pkg.dir}-v` })
    .commits({ path: pkg.path, ...(previous ? { from: previous } : {}), to: pkg.tag })
    .context({
      version: pkg.version,
      date,
      currentTag: pkg.tag,
      ...(previous ? { previousTag: previous, linkCompare: true } : { linkCompare: false }),
    })

  let notes = ''
  for await (const chunk of changelog.write()) notes += chunk
  process.stdout.write(`${withMaintenanceNote(notes.trim(), previous)}\n`)
}
