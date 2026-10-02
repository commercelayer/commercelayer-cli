/**
 * Workspace helpers shared by the release scripts.
 *
 * Every publishable package lives in `packages/<dir>` or `plugins/<dir>`, and
 * `<dir>` is unique across both. It is the package's identity everywhere in
 * the release flow: tags are `<dir>-v<version>`, labels are `pkg:<dir>`, the
 * release-notes config is `.github/release-<dir>.yml`.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { getSemverTags } from 'git-semver-tags'
import semver from 'semver'

export const ROOTS = ['packages', 'plugins']

export const git = (...args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()

export const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'))
export const writeJson = (path, data) => writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`)

/** All workspace packages, public and private, sorted by directory name. */
export const listPackages = () =>
  ROOTS.flatMap((root) =>
    existsSync(root)
      ? readdirSync(root, { withFileTypes: true })
          .filter((d) => d.isDirectory() && existsSync(join(root, d.name, 'package.json')))
          .map((d) => {
            const path = join(root, d.name)
            const manifest = readJson(join(path, 'package.json'))
            return { dir: d.name, path, name: manifest.name, version: manifest.version, private: manifest.private === true, manifest }
          })
      : [],
  ).sort((a, b) => a.dir.localeCompare(b.dir))

export const publicPackages = () => listPackages().filter((p) => !p.private)

/** The package a `<dir>-v<version>` tag belongs to, or an error message. */
export const resolveTag = (tag) => {
  const match = /^(.+?)-v(.+)$/.exec(tag)
  if (!match || !semver.valid(match[2])) return { error: `'${tag}' is not a <dir>-v<version> tag` }
  const [, dir, version] = match
  const pkg = listPackages().find((p) => p.dir === dir)
  if (!pkg) return { error: `Tag prefix '${dir}' does not match a directory in ${ROOTS.join(' or ')}` }
  if (pkg.private) return { error: `${pkg.name} is private and must not be released` }
  if (pkg.version !== version) return { error: `Tag version ${version} does not match ${pkg.path}/package.json (${pkg.version})` }
  // `6.0.0-beta.3` -> `beta`; a bare numeric prerelease (`6.0.0-0`) -> `next`
  const [preid] = semver.prerelease(version) ?? []
  const prerelease = preid !== undefined
  const distTag = prerelease ? (typeof preid === 'number' ? 'next' : preid) : 'latest'
  return { ...pkg, tag, prerelease, distTag }
}

export const tagOf = (pkg, version = pkg.version) => `${pkg.dir}-v${version}`

/**
 * The most recent tag of a package, stable or not, reachable from HEAD: the
 * first in history order (git-semver-tags), not the closest one by commit
 * count, so a release made on a maintenance branch and merged back counts.
 */
export const lastTag = async (pkg) => (await getSemverTags({ tagPrefix: `${pkg.dir}-v` }))[0]
