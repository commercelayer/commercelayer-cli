#!/usr/bin/env node

const OCLIF_PATCH = true
const COMMAND_PATCH_ENABLED = true

// Before anything else: on an older Node.js the CLI fails while loading
// (ERR_REQUIRE_ESM), so say which Node.js it needs instead
const nodeError = require('../lib/engines').nodeErrorMessage(require('../package.json'), process.versions.node)
if (nodeError) {
	console.error(nodeError)
	process.exit(1)
}

// eslint-disable-next-line unicorn/prefer-top-level-await
; (async () => {

	const oclif = OCLIF_PATCH ? require('../lib/patches/oclif/execute') : await import('@oclif/core')

	// Check Provisioning commands
	if (COMMAND_PATCH_ENABLED) require('../lib/patches/command').patchCommand(process.argv)

	await oclif.execute({ development: false, dir: __dirname })

})()
