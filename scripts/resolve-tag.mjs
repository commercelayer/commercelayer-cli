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
import { git, resolveTag } from './lib/workspace.mjs'

const tag = process.argv[2]
const pkg = resolveTag(tag ?? '')
if (pkg.error) {
  console.error(`::error::${pkg.error}`)
  process.exit(1)
}

const parse = (v) => {
  const [core, pre] = v.split('-')
  return { nums: core.split('.').map(Number), pre }
}
const compare = (a, b) => {
  const x = parse(a)
  const y = parse(b)
  for (let i = 0; i < 3; i++) if (x.nums[i] !== y.nums[i]) return x.nums[i] - y.nums[i]
  if (!x.pre || !y.pre) return (x.pre ? -1 : 0) - (y.pre ? -1 : 0)
  return x.pre.localeCompare(y.pre, 'en', { numeric: true })
}

const prefix = `${pkg.dir}-v`
const previous = git('tag', '--list', `${prefix}*`)
  .split('\n')
  .filter(Boolean)
  .map((t) => t.slice(prefix.length))
  .filter((v) => /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(v))
  .filter((v) => pkg.prerelease || !v.includes('-'))
  .filter((v) => compare(v, pkg.version) < 0)
  .sort(compare)
  .pop()

const out = {
  dir: pkg.dir,
  path: pkg.path,
  package: pkg.name,
  version: pkg.version,
  prerelease: pkg.prerelease,
  dist_tag: pkg.distTag,
  previous_tag: previous ? `${prefix}${previous}` : '',
}
for (const [k, v] of Object.entries(out)) console.log(`${k}=${v}`)
