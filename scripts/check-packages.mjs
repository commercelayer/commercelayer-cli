#!/usr/bin/env node
/**
 * Checks that the workspace packages stay consistent with each other.
 *
 * npm needs these fields in every published package, so they can't be shared:
 * this script is what keeps them aligned instead. Run in CI (verify.yml).
 *
 * Every package:
 *   - workspace dependencies use `workspace:`
 *   - dependencies in the pnpm catalog use `catalog:` (see EXCEPTIONS)
 *   - no per-package lint / check / posttest / release scripts (run from the root)
 *   - scripts only run (`pnpm <name>`) scripts the package has
 * Every public package:
 *   - license, author, bugs, publishConfig, engines (Node >= 22.13)
 *   - repository points at this monorepo with its directory, homepage at its folder
 *   - a LICENSE file
 * Every public oclif package (CLI and plugins):
 *   - files, topicSeparator, -h help flag, repositoryPrefix pointing at its folder
 *   - build, test, prepack, postpack and readme scripts
 *
 * Usage:  node scripts/check-packages.mjs
 */
import { existsSync, readFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { getPackagesSync } from '@manypkg/get-packages'

const REPO = 'https://github.com/commercelayer/commercelayer-cli'
const AUTHOR = 'Pierluigi Viti <pierluigi@commercelayer.io>'
// require(esm) without a flag (22.12), and the floor of inquirer 14 (22.13)
const NODE = '>=22.13'
const OCLIF_FILES = ['/bin/run.*', '/lib', '/npm-shrinkwrap.json', '/oclif.manifest.json']

/** pnpm commands that scripts may run, as opposed to the package's own scripts */
const PNPM_COMMANDS = new Set(['add', 'dlx', 'exec', 'install', 'pack', 'publish'])

/** Dependencies deliberately not on the catalog version: `<package dir>:<dependency>` */
const EXCEPTIONS = {}

// `catalog:` entries of pnpm-workspace.yaml (flat `  name: version` lines)
const catalog = new Set()
let inCatalog = false
for (const line of readFileSync('pnpm-workspace.yaml', 'utf8').split('\n')) {
  if (/^catalog:\s*$/.test(line)) inCatalog = true
  else if (inCatalog && /^\S/.test(line)) inCatalog = false
  else if (inCatalog) {
    const m = /^\s+'?([^':]+(?::[^':]+)?)'?:\s*\S/.exec(line)
    if (m) catalog.add(m[1])
  }
}

const packages = getPackagesSync(process.cwd()).packages.map(({ relativeDir: path, packageJson: manifest }) => ({
  dir: basename(path),
  path,
  name: manifest.name,
  private: manifest.private === true,
  manifest,
}))
const workspace = new Set(packages.map((p) => p.name))
const problems = []
const check = (pkg, ok, message) => {
  if (!ok) problems.push(`${pkg.path}: ${message}`)
}

for (const pkg of packages) {
  const m = pkg.manifest
  const scripts = m.scripts ?? {}

  for (const section of ['dependencies', 'devDependencies', 'peerDependencies']) {
    for (const [name, range] of Object.entries(m[section] ?? {})) {
      if (workspace.has(name)) check(pkg, range.startsWith('workspace:'), `${section}.${name} must use workspace: (is ${range})`)
      else if (catalog.has(name) && section !== 'peerDependencies' && !EXCEPTIONS[`${pkg.dir}:${name}`])
        check(pkg, range === 'catalog:', `${section}.${name} must use catalog: (is ${range})`)
    }
  }
  for (const script of ['lint', 'check', 'posttest', 'release']) check(pkg, !(script in scripts), `script '${script}' runs from the root, remove it`)
  // A script calling a missing one only fails when it runs: prepack at publish time
  for (const [name, body] of Object.entries(scripts)) {
    for (const [, called] of body.matchAll(/\bpnpm (?:run )?([a-z][\w:-]*)/g)) {
      if (!PNPM_COMMANDS.has(called)) check(pkg, called in scripts, `script '${name}' runs 'pnpm ${called}', which is not a script of the package`)
    }
  }

  if (pkg.private) continue

  check(pkg, m.license === 'MIT', `license must be MIT (is ${m.license})`)
  check(pkg, m.author === AUTHOR, `author must be '${AUTHOR}'`)
  check(pkg, m.bugs === `${REPO}/issues`, `bugs must be ${REPO}/issues`)
  check(pkg, m.publishConfig?.access === 'public', 'publishConfig.access must be public')
  check(pkg, m.engines?.node === NODE, `engines.node must be ${NODE} (is ${m.engines?.node})`)
  check(
    pkg,
    m.repository?.url === `${REPO}.git` && m.repository?.directory === pkg.path,
    `repository must be { type: git, url: ${REPO}.git, directory: ${pkg.path} }`,
  )
  check(pkg, m.homepage === `${REPO}/tree/main/${pkg.path}`, `homepage must be ${REPO}/tree/main/${pkg.path}`)
  check(pkg, existsSync(join(pkg.path, 'LICENSE')), 'LICENSE file missing')

  if (!m.oclif?.commands) continue

  check(pkg, JSON.stringify(m.files) === JSON.stringify(OCLIF_FILES), `files must be ${JSON.stringify(OCLIF_FILES)}`)
  check(pkg, m.oclif.topicSeparator === ':', "oclif.topicSeparator must be ':'")
  check(pkg, m.oclif.additionalHelpFlags?.includes('-h'), 'oclif.additionalHelpFlags must include -h')
  check(
    pkg,
    m.oclif.repositoryPrefix === `<%- repo %>/blob/main/${pkg.path}/<%- commandPath %>`,
    `oclif.repositoryPrefix must be <%- repo %>/blob/main/${pkg.path}/<%- commandPath %>`,
  )
  for (const script of ['build', 'test', 'prepack', 'postpack', 'readme']) check(pkg, script in scripts, `script '${script}' missing`)
}

if (problems.length > 0) {
  console.error(`${problems.length} problem(s):\n${problems.map((p) => `  - ${p}`).join('\n')}`)
  process.exit(1)
}
console.log(`${packages.length} packages are consistent.`)
