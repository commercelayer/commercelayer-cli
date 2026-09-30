/**
 * Mocha setup: makes @oclif/test load the package under test.
 *
 * Mocha runs in the package folder, but @oclif/test looks for the oclif root
 * from its own location, which in the workspace is the root node_modules, so
 * it finds the monorepo's package.json and no commands. Pin it to the cwd:
 * v4 reads OCLIF_TEST_ROOT, v2/v3 read loadConfig.root.
 *
 * It also turns off oclif's ts-node loading, so commands run from the built
 * lib/ as they did in the single repositories. There ts-node wasn't
 * resolvable; in the workspace it is (other packages depend on it), and it
 * fails to compile the plugins' src/ with TypeScript 6.
 */
const { createRequire } = require('node:module')
const { join } = require('node:path')

const root = process.cwd()
process.env.OCLIF_TEST_ROOT ??= root
globalThis.oclif = { enableAutoTranspile: false, ...globalThis.oclif }

try {
  createRequire(join(root, 'package.json'))('@oclif/test/lib/load-config').loadConfig.root = root
} catch {
  // @oclif/test v4 (no load-config module) or not a dependency of this package
}
