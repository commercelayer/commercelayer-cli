/**
 * Workspace helpers shared by the release commands.
 *
 * The packages are the workspace's (pnpm-workspace.yaml, read by
 * @manypkg/get-packages): `packages/<dir>` and `plugins/<dir>`, with `<dir>`
 * unique across both. It is the package's identity everywhere in
 * the release flow: tags are `<dir>-v<version>`, labels are `pkg:<dir>`, the
 * release notes cover the commits under its folder.
 *
 * Paths are relative to the workspace root, which cl-release makes the
 * working directory (src/cli.ts).
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { basename } from 'node:path'
import { getPackagesSync } from '@manypkg/get-packages'
import { graphSequencer } from '@pnpm/deps.graph-sequencer'
import { getSemverTags } from 'git-semver-tags'
import semver from 'semver'

export type Manifest = {
  name: string
  version: string
  private?: boolean
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  optionalDependencies?: Record<string, string>
  oclif?: { commands?: unknown; [key: string]: unknown }
  [key: string]: unknown
}

export type Package = {
  /** Folder name, unique in the workspace: the package's identity in tags and labels */
  dir: string
  /** Folder, relative to the workspace root */
  path: string
  name: string
  version: string
  private: boolean
  manifest: Manifest
}

export type ReleaseTarget = Package & { tag: string; prerelease: false; distTag: 'latest' }

export const git = (...args: string[]): string => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()

export const readJson = <T = any>(path: string): T => JSON.parse(readFileSync(path, 'utf8'))
export const writeJson = (path: string, data: unknown): void => writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`)

/** Prints an error and exits: the commands' way to stop. */
export const fail = (message: string, prefix = '✖ '): never => {
  console.error(`${prefix}${message}`)
  process.exit(1)
}

/** All workspace packages, public and private, sorted by directory name. */
export const listPackages = (): Package[] =>
  getPackagesSync(process.cwd())
    .packages.map(({ relativeDir: path, packageJson }) => {
      const manifest = packageJson as unknown as Manifest
      return { dir: basename(path), path, name: manifest.name, version: manifest.version, private: manifest.private === true, manifest }
    })
    .sort((a, b) => a.dir.localeCompare(b.dir))

export const publicPackages = (): Package[] => listPackages().filter((p) => !p.private)

/** The workspace packages a package needs at runtime (`workspace:` ranges, by name). */
export const workspaceDeps = (pkg: Pick<Package, 'manifest'>): string[] => {
  const { dependencies = {}, peerDependencies = {}, optionalDependencies = {} } = pkg.manifest
  return Object.entries({ ...dependencies, ...peerDependencies, ...optionalDependencies })
    .filter(([, range]) => range.startsWith('workspace:'))
    .map(([name]) => name)
}

/** Packages with their workspace dependencies first (pnpm's own sequencer), otherwise by directory. */
export const sortByDependencies = <P extends Package>(pkgs: P[]): P[] => {
  const byName = new Map([...pkgs].sort((a, b) => a.dir.localeCompare(b.dir)).map((p) => [p.name, p]))
  const graph = new Map([...byName.values()].map((p) => [p.name, workspaceDeps(p).filter((name) => byName.has(name))]))
  return graphSequencer(graph).order.map((name) => byName.get(name) as P)
}

export const tagOf = (pkg: Pick<Package, 'dir' | 'version'>, version = pkg.version): string => `${pkg.dir}-v${version}`

/** The package a `<dir>-v<version>` tag belongs to, or an error message. */
export const resolveTag = (tag: string, packages: Package[] = listPackages()): ReleaseTarget | { error: string } => {
  const match = /^(.+?)-v(.+)$/.exec(tag)
  if (!match || !semver.valid(match[2])) return { error: `'${tag}' is not a <dir>-v<version> tag` }
  const [, dir, version] = match
  const pkg = packages.find((p) => p.dir === dir)
  if (!pkg) return { error: `Tag prefix '${dir}' does not match a workspace package directory` }
  if (pkg.private) return { error: `${pkg.name} is private and must not be released` }
  if (pkg.version !== version) return { error: `Tag version ${version} does not match ${pkg.path}/package.json (${pkg.version})` }
  // Only stable versions reach npm: try a release with `pnpm release:try`, share a pkg.pr.new preview (preview.yml)
  if (semver.prerelease(version)) return { error: `${tag} is a prerelease: prereleases aren't released or published` }
  return { ...pkg, tag, prerelease: false, distTag: 'latest' }
}

/** resolveTag, stopping on an error with a GitHub Actions annotation. */
export const resolveTagOrFail = (tag: string | undefined, packages?: Package[]): ReleaseTarget => {
  const target = resolveTag(tag ?? '', packages)
  if ('error' in target) return fail(target.error, '::error::')
  return target
}

/**
 * Among a package's released versions, the closest lower one to `version`:
 * for a stable release the previous stable one, for a prerelease the previous
 * release of any kind.
 */
export const previousVersion = (versions: string[], version: string): string | undefined =>
  versions
    .filter((v) => semver.valid(v))
    .filter((v) => semver.prerelease(version) || !semver.prerelease(v))
    .filter((v) => semver.lt(v, version))
    .sort(semver.compare)
    .pop()

/** The tag of a package's previous release (previousVersion), undefined for a first release. */
export const previousRelease = (pkg: Pick<Package, 'dir' | 'version'>, version = pkg.version): string | undefined => {
  const prefix = `${pkg.dir}-v`
  const versions = git('tag', '--list', `${prefix}*`)
    .split('\n')
    .filter(Boolean)
    .map((t) => t.slice(prefix.length))
  const previous = previousVersion(versions, version)
  return previous ? `${prefix}${previous}` : undefined
}

/**
 * The most recent tag of a package, stable or not, reachable from HEAD: the
 * first in history order (git-semver-tags), not the closest one by commit
 * count, so a release made on a maintenance branch and merged back counts.
 */
export const lastTag = async (pkg: Pick<Package, 'dir'>): Promise<string | undefined> => (await getSemverTags({ tagPrefix: `${pkg.dir}-v` }))[0]

/** Whether a version of a package is on npm. */
export const onNpm = (name: string, version: string): boolean => {
  try {
    // --prefer-online: a version published a moment ago, not npm's cached answer
    return execFileSync('npm', ['view', '--prefer-online', `${name}@${version}`, 'version'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() === version
  } catch {
    return false
  }
}

/** Blocks for a while (the release commands run step by step). */
export const sleep = (ms: number): void => {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)
}

/**
 * Waits until a version is on npm, polling: a version just published takes a
 * few seconds to show. False if it doesn't show within the timeout.
 */
export const waitForNpm = (name: string, version: string, { timeout = 300_000, interval = 10_000 } = {}): boolean => {
  for (const end = Date.now() + timeout; ; sleep(interval)) {
    if (onNpm(name, version)) return true
    if (Date.now() >= end) return false
  }
}

/** HEAD must be an up-to-date base branch with a clean tree, to version or tag a release. */
export const requireUpToDate = (base: string): void => {
  if (git('status', '--porcelain')) fail('Working tree is not clean.')
  git('fetch', '--quiet', 'origin', base, '--tags')
  if (git('rev-parse', 'HEAD') !== git('rev-parse', `origin/${base}`)) fail(`HEAD is not origin/${base}. Check out an up-to-date ${base} first.`)
}
