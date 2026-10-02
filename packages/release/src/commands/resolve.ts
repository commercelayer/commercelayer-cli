/**
 * Resolves a release tag `<dir>-v<version>` to its package, as key=value lines
 * for $GITHUB_OUTPUT. Fails loudly when the tag does not belong to a public
 * workspace package or its version does not match that package.json.
 *
 *   dir, path, package, version, prerelease, dist_tag, previous_tag
 *
 * previous_tag is the package's closest lower release, so the generated notes
 * cover this package's range instead of whichever tag GitHub finds first.
 */
import { parse } from '../args.ts'
import { previousRelease, resolveTagOrFail } from '../workspace.ts'

const USAGE = 'Usage: cl-release resolve <tag>'

export const run = (args: string[]): void => {
  const { positionals } = parse(args, {}, USAGE)
  const pkg = resolveTagOrFail(positionals[0])
  const out = {
    dir: pkg.dir,
    path: pkg.path,
    package: pkg.name,
    version: pkg.version,
    prerelease: pkg.prerelease,
    dist_tag: pkg.distTag,
    previous_tag: previousRelease(pkg) ?? '',
  }
  for (const [k, v] of Object.entries(out)) console.log(`${k}=${v}`)
}
