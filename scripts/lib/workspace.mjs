/**
 * Workspace helpers shared by the release scripts.
 *
 * The packages are the workspace's (pnpm-workspace.yaml, read by
 * @manypkg/get-packages): `packages/<dir>` and `plugins/<dir>`, with `<dir>`
 * unique across both. It is the package's identity everywhere in
 * the release flow: tags are `<dir>-v<version>`, labels are `pkg:<dir>`, the
 * release notes cover the commits under its folder.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { basename } from 'node:path'
import { getPackagesSync } from '@manypkg/get-packages'
import { graphSequencer } from '@pnpm/deps.graph-sequencer'
import { getSemverTags } from 'git-semver-tags'
import semver from 'semver'

export const git = (...args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()

export const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'))
export const writeJson = (path, data) => writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`)

/** All workspace packages, public and private, sorted by directory name. */
export const listPackages = () =>
  getPackagesSync(process.cwd())
    .packages.map(({ relativeDir: path, packageJson: manifest }) => ({
      dir: basename(path),
      path,
      name: manifest.name,
      version: manifest.version,
      private: manifest.private === true,
      manifest,
    }))
    .sort((a, b) => a.dir.localeCompare(b.dir))

export const publicPackages = () => listPackages().filter((p) => !p.private)

/** The workspace packages a package needs at runtime (`workspace:` ranges, by name). */
export const workspaceDeps = (pkg) => {
  const { dependencies = {}, peerDependencies = {}, optionalDependencies = {} } = pkg.manifest
  return Object.entries({ ...dependencies, ...peerDependencies, ...optionalDependencies })
    .filter(([, range]) => range.startsWith('workspace:'))
    .map(([name]) => name)
}

/** Packages with their workspace dependencies first (pnpm's own sequencer), otherwise by directory. */
export const sortByDependencies = (pkgs) => {
  const byName = new Map([...pkgs].sort((a, b) => a.dir.localeCompare(b.dir)).map((p) => [p.name, p]))
  const graph = new Map([...byName.values()].map((p) => [p.name, workspaceDeps(p).filter((name) => byName.has(name))]))
  return graphSequencer(graph).order.map((name) => byName.get(name))
}

/** The package a `<dir>-v<version>` tag belongs to, or an error message. */
export const resolveTag = (tag) => {
  const match = /^(.+?)-v(.+)$/.exec(tag)
  if (!match || !semver.valid(match[2])) return { error: `'${tag}' is not a <dir>-v<version> tag` }
  const [, dir, version] = match
  const pkg = listPackages().find((p) => p.dir === dir)
  if (!pkg) return { error: `Tag prefix '${dir}' does not match a workspace package directory` }
  if (pkg.private) return { error: `${pkg.name} is private and must not be released` }
  if (pkg.version !== version) return { error: `Tag version ${version} does not match ${pkg.path}/package.json (${pkg.version})` }
  // Only stable versions reach npm: try a release with `pnpm release:try`, share a pkg.pr.new preview (preview.yml)
  if (semver.prerelease(version)) return { error: `${tag} is a prerelease: prereleases aren't released or published` }
  return { ...pkg, tag, prerelease: false, distTag: 'latest' }
}

export const tagOf = (pkg, version = pkg.version) => `${pkg.dir}-v${version}`

/**
 * The tag of a package's closest lower release, for the notes of `version`:
 * for a stable release the previous stable one, for a prerelease the previous
 * release of any kind. Undefined for a first release.
 */
export const previousRelease = (pkg, version = pkg.version) => {
  const prefix = `${pkg.dir}-v`
  const previous = git('tag', '--list', `${prefix}*`)
    .split('\n')
    .filter(Boolean)
    .map((t) => t.slice(prefix.length))
    .filter((v) => semver.valid(v))
    .filter((v) => semver.prerelease(version) || !semver.prerelease(v))
    .filter((v) => semver.lt(v, version))
    .sort(semver.compare)
    .pop()
  return previous ? `${prefix}${previous}` : undefined
}

/**
 * The most recent tag of a package, stable or not, reachable from HEAD: the
 * first in history order (git-semver-tags), not the closest one by commit
 * count, so a release made on a maintenance branch and merged back counts.
 */
export const lastTag = async (pkg) => (await getSemverTags({ tagPrefix: `${pkg.dir}-v` }))[0]
