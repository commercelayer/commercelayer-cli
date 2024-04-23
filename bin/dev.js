#!/usr/bin/env node_modules/.bin/tsx

const OCLIF_PATCH = true
const COMMAND_PATCH_ENABLED = true

// eslint-disable-next-line node/shebang, unicorn/prefer-top-level-await
; (async () => {

	const oclif = OCLIF_PATCH ? require('../src/patches/oclif/execute') : await import('@oclif/core')

	// Check Provisioning commands
	if (COMMAND_PATCH_ENABLED) require('../src/patches/command').patchCommand(process.argv)

	await oclif.execute({ development: true, dir: __dirname })

})()
