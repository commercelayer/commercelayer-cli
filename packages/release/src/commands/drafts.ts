/**
 * Publishes the draft GitHub releases (`pnpm release:publish`), the last step
 * of a release after `pnpm release:tag`: publishing a draft makes publish.yml
 * publish its package to npm, as publishing it on GitHub does.
 *
 * The drafts are published in dependency order (cli-core and cli-ux first),
 * each one when the workspace dependencies drafted along with it are on npm:
 * a plugin published at the same time as the cli-core it needs would try to
 * publish cli-core too. It shows the plan and asks for a confirmation first,
 * then follows the publish.yml runs and reports what reached npm.
 *
 * Uses the GitHub CLI (gh), signed in with the right to publish releases.
 */
import { execFileSync } from 'node:child_process'
import { createInterface } from 'node:readline/promises'
import semver from 'semver'
import { parse } from '../args.ts'
import { fail, listPackages, onNpm, type Package, sleep, sortByDependencies, waitForNpm, workspaceDeps } from '../workspace.ts'

const USAGE = `Usage: pnpm release:publish [<tag>...] [--yes] [--dry-run] [--timeout <minutes>]
  <tag>          publish only these drafts, e.g. core-v5.12.0 (default: all the drafts)
  --yes          no confirmation
  --dry-run      show the plan and publish nothing
  --timeout <m>  how long to wait for a release to reach npm (default: 20)`

type Draft = { tag: string }

/** A draft to publish: its package, version, and the drafts it waits for */
export type PlannedRelease = { tag: string; pkg: Package; version: string; waitFor: string[] }

const gh = (...args: string[]): string => execFileSync('gh', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()

/**
 * The drafts in publishing order: each `<dir>-v<version>` tag resolved to its
 * workspace package, dependencies first, with the drafts of its workspace
 * dependencies it has to wait for.
 */
export const planDrafts = (drafts: Draft[], packages: Package[]): PlannedRelease[] => {
  const byTag = new Map<string, { pkg: Package; version: string }>()
  for (const { tag } of drafts) {
    const match = /^(.+?)-v(.+)$/.exec(tag)
    if (!match || !semver.valid(match[2])) throw new Error(`'${tag}' is not a <dir>-v<version> tag`)
    const pkg = packages.find((p) => p.dir === match[1])
    if (!pkg) throw new Error(`${tag}: no workspace package in a '${match[1]}' folder`)
    if (pkg.private) throw new Error(`${tag}: ${pkg.name} is private and must not be released`)
    byTag.set(tag, { pkg, version: match[2] })
  }
  const tagOfName = new Map([...byTag].map(([tag, { pkg }]) => [pkg.name, tag]))
  return sortByDependencies([...byTag.values()].map(({ pkg }) => pkg)).map((pkg) => {
    const tag = tagOfName.get(pkg.name) as string
    const waitFor = workspaceDeps(pkg)
      .map((name) => tagOfName.get(name))
      .filter((t): t is string => Boolean(t))
    return { tag, pkg, version: byTag.get(tag)?.version as string, waitFor }
  })
}

export const run = async (args: string[]): Promise<void> => {
  const { values, positionals } = parse(
    args,
    { yes: { type: 'boolean' }, 'dry-run': { type: 'boolean' }, timeout: { type: 'string', default: '20' } },
    USAGE,
  )
  const timeout = Number(values.timeout) * 60_000
  if (!(timeout > 0)) fail(`Invalid --timeout '${values.timeout}'`)

  let drafts: Draft[] = []
  try {
    drafts = (JSON.parse(gh('release', 'list', '--limit', '200', '--json', 'tagName,isDraft')) as { tagName: string; isDraft: boolean }[])
      .filter((r) => r.isDraft)
      .map((r) => ({ tag: r.tagName }))
  } catch (error) {
    fail(`Unable to list the GitHub releases with gh: ${(error as Error).message}`)
  }
  if (positionals.length > 0) {
    const missing = positionals.filter((t) => !drafts.some((d) => d.tag === t))
    if (missing.length > 0) fail(`No draft release for ${missing.join(', ')}`)
    drafts = drafts.filter((d) => positionals.includes(d.tag))
  }
  if (drafts.length === 0) {
    console.log('No draft release to publish.')
    return
  }

  let plan: PlannedRelease[] = []
  try {
    plan = planDrafts(drafts, listPackages())
  } catch (error) {
    fail((error as Error).message)
  }

  const width = Math.max(...plan.map((r) => r.pkg.name.length))
  console.log(`\n${plan.length} draft release(s), in publishing order:\n`)
  for (const r of plan) console.log(`  ${r.pkg.name.padEnd(width)}  ${r.version}${r.waitFor.length > 0 ? `  after ${r.waitFor.join(', ')}` : ''}`)

  if (values['dry-run']) {
    console.log('\n(dry run: nothing published)')
    return
  }
  if (!values.yes) {
    const rl = createInterface({ input: process.stdin, output: process.stdout })
    const answer = (await rl.question('\nPublish these releases to npm? [y/N] ')).trim().toLowerCase()
    rl.close()
    if (answer !== 'y' && answer !== 'yes') {
      console.log('Aborted.')
      return
    }
  }

  const failed: string[] = []
  const versionOf = new Map(plan.map((r) => [r.tag, r]))
  for (const r of plan) {
    const missing = r.waitFor.filter((t) => {
      const dep = versionOf.get(t) as PlannedRelease
      console.log(`· ${r.tag} waits for ${dep.pkg.name}@${dep.version} on npm`)
      return !waitForNpm(dep.pkg.name, dep.version, { timeout })
    })
    if (missing.length > 0) {
      console.log(`✖ ${r.tag} not published: ${missing.join(', ')} didn't reach npm`)
      failed.push(r.tag)
      continue
    }
    gh('release', 'edit', r.tag, '--draft=false')
    console.log(`› Published the release ${r.tag}: publish.yml publishes ${r.pkg.name}@${r.version}`)
  }

  // What reached npm, and the publish.yml run of each release
  console.log('\nWaiting for npm…')
  sleep(5_000)
  for (const r of plan) {
    if (failed.includes(r.tag)) continue
    const ok = onNpm(r.pkg.name, r.version) || waitForNpm(r.pkg.name, r.version, { timeout })
    let runInfo = ''
    try {
      const [last] = JSON.parse(gh('run', 'list', '--workflow', 'publish.yml', '--branch', r.tag, '--limit', '1', '--json', 'conclusion,url')) as {
        conclusion: string
        url: string
      }[]
      if (last) runInfo = ` (publish.yml ${last.conclusion || 'running'}: ${last.url})`
    } catch {}
    console.log(`${ok ? '✓' : '✖'} ${r.pkg.name}@${r.version} ${ok ? 'is on npm' : 'is not on npm'}${runInfo}`)
    if (!ok) failed.push(r.tag)
  }

  if (failed.length > 0) fail(`\n${failed.length} release(s) not on npm: ${failed.join(', ')}`)
  console.log(`\n✓ ${plan.length} release(s) published to npm`)
}
