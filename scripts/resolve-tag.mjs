#!/usr/bin/env node
/**
 * Resolves a release tag `<dir>-v<version>` to its package, as key=value lines
 * for $GITHUB_OUTPUT. Fails loudly when the tag does not belong to a public
 * workspace package or its version does not match that package.json.
 *
 *   dir, path, package, version, prerelease, dist_tag, previous_tag
 *
 * previous_tag is the package's closest lower release, so the generated notes
 * cover this package's range instead of whichever tag GitHub finds first:
 * for a stable release the previous stable one, for a prerelease the previous
 * release of any kind.
 *
 * Usage:  node scripts/resolve-tag.mjs <tag>
 */
import { previousRelease, resolveTag } from './lib/workspace.mjs'

const tag = process.argv[2]
const pkg = resolveTag(tag ?? '')
if (pkg.error) {
  console.error(`::error::${pkg.error}`)
  process.exit(1)
}

const previous = previousRelease(pkg)

const out = {
  dir: pkg.dir,
  path: pkg.path,
  package: pkg.name,
  version: pkg.version,
  prerelease: pkg.prerelease,
  dist_tag: pkg.distTag,
  previous_tag: previous ?? '',
}
for (const [k, v] of Object.entries(out)) console.log(`${k}=${v}`)
