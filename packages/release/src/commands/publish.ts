/**
 * Publishes the package a release tag points at, together with the workspace
 * dependencies it needs.
 *
 * Never "everything whose version is not on npm": publishing one draft
 * release publishes only that package, plus the workspace dependencies
 * (cli-core, cli-ux, …) whose required version isn't on npm yet. Those are
 * released in the same `chore(release)` PR (`cl-release version`), so
 * their tags exist on the same commit; they are published first, from that
 * tree, and reported so publish.yml can mark their draft releases published.
 * A dependency version without a release tag was bumped outside the release
 * flow, and publishing stops.
 *
 * A package already on npm is skipped: it may have been published as the
 * dependency of another one.
 *
 * Each package is published with `pnpm publish`, which runs prepack, rewrites
 * `workspace:` ranges to real versions, and in CI does the OIDC
 * trusted-publishing exchange with npm and attaches provenance. Not
 * `pnpm publish -r`: it would give every package the same dist-tag, and
 * publish any workspace version not on npm, tagged for release or not.
 *
 * The package and its workspace dependencies must be built first.
 */
import { spawnSync } from 'node:child_process'
import { appendFileSync } from 'node:fs'
import { parse } from '../args.ts'
import { fail, git, listPackages, onNpm, type Package, resolveTagOrFail, tagOf, waitForNpm, workspaceDeps } from '../workspace.ts'

const USAGE = `Usage: cl-release publish <tag> [--dry-run]
  --dry-run  pnpm publish --dry-run: nothing reaches npm`

/**
 * The workspace dependencies of a package that must be published with it,
 * dependencies first: those not on npm at the required version. Each needs a
 * release tag.
 */
export const dependenciesToPublish = (
  pkg: Package,
  packages: Package[],
  { published, tags }: { published: (p: Package) => boolean; tags: Set<string> },
): Package[] => {
  const workspace = new Map(packages.map((p) => [p.name, p]))
  const toPublish: Package[] = []
  const visit = (p: Package, chain: string[]): void => {
    for (const name of workspaceDeps(p)) {
      const dep = workspace.get(name)
      if (!dep || toPublish.includes(dep) || published(dep)) continue
      if (dep.private) throw new Error(`${p.name} depends on the private ${dep.name}`)
      const depTag = tagOf(dep)
      if (!tags.has(depTag))
        throw new Error(
          `${[...chain, p.name].join(' → ')} needs ${dep.name}@${dep.version}, which is not on npm and has no ${depTag} release tag. Release it with \`pnpm release:version\`.`,
        )
      visit(dep, [...chain, p.name])
      toPublish.push(dep)
    }
  }
  visit(pkg, [])
  return toPublish
}

/**
 * Whether npm refused a version because it is being published right now, by
 * another workflow run (e.g. the release of a dependency, published at the
 * same time as the plugins that need it): `E409 … previously staged version`.
 */
export const isConcurrentPublish = (stderr: string): boolean => /E409|previously staged version|cannot publish over/i.test(stderr)

export const run = (args: string[]): void => {
  const { values, positionals } = parse(args, { 'dry-run': { type: 'boolean' } }, USAGE)
  const dry = values['dry-run']
  const packages = listPackages()
  const pkg = resolveTagOrFail(positionals[0], packages)

  if (onNpm(pkg.name, pkg.version)) {
    console.log(`${pkg.name}@${pkg.version} is already on npm, nothing to publish`)
    return
  }

  let toPublish: Package[] = []
  try {
    toPublish = dependenciesToPublish(pkg, packages, {
      published: (p) => onNpm(p.name, p.version),
      tags: new Set(git('tag', '--list', '*-v*').split('\n')),
    })
  } catch (error) {
    fail((error as Error).message, '::error::')
  }

  /** Publishes a package: false if another run published it meanwhile */
  const publish = (p: Package): boolean => {
    const target = resolveTagOrFail(tagOf(p), packages)
    // The release tag is checked out detached: no branch or clean-tree checks
    const pnpmArgs = ['publish', '--access', 'public', '--tag', target.distTag, '--no-git-checks']
    if (process.env.CI) pnpmArgs.push('--provenance')
    if (dry) pnpmArgs.push('--dry-run')
    console.log(`› pnpm ${pnpmArgs.join(' ')}  (${p.path})`)
    const result = spawnSync('pnpm', pnpmArgs, { cwd: p.path, stdio: ['ignore', 'inherit', 'pipe'], encoding: 'utf8' })
    process.stderr.write(result.stderr ?? '')
    if (result.status !== 0) {
      // Being published by another run: wait for it instead of failing
      if (!dry && isConcurrentPublish(result.stderr ?? '')) {
        console.log(`· ${p.name}@${p.version} is being published by another run: waiting for it on npm`)
        if (waitForNpm(p.name, p.version)) {
          console.log(`✓ ${p.name}@${p.version} is on npm`)
          return false
        }
      }
      fail(`pnpm publish of ${p.name}@${p.version} failed`, '::error::')
    }
    console.log(`✓ ${dry ? 'Would publish' : 'Published'} ${p.name}@${p.version} (dist-tag ${target.distTag})`)
    return true
  }

  const published: Package[] = []
  for (const dep of toPublish) {
    console.log(`› ${pkg.name} needs ${dep.name}@${dep.version}, not on npm yet: publishing it first`)
    if (publish(dep)) published.push(dep)
  }
  publish(pkg)

  // Tags of the dependencies this run published, for publish.yml (one published by its own run marks its own release)
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `published_deps=${published.map((d) => tagOf(d)).join(' ')}\n`)
}
