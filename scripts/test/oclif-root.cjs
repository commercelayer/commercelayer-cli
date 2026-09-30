/**
 * Mocha setup: makes @oclif/test load the package under test.
 *
 * Mocha runs in the package folder, but @oclif/test looks for the oclif root
 * from its own location, which in the workspace is the root node_modules, so
 * it finds the monorepo's package.json and no commands: OCLIF_TEST_ROOT pins
 * it to the cwd.
 *
 * It also turns off oclif's TypeScript auto-transpilation, so commands run
 * from the built lib/ (they did in the single repositories) instead of being
 * compiled from src/ at test time.
 */
process.env.OCLIF_TEST_ROOT ??= process.cwd()
globalThis.oclif = { enableAutoTranspile: false, ...globalThis.oclif }
