#!/usr/bin/env node

const OCLIF_PATCH = true
const COMMAND_PATCH_ENABLED = true

// eslint-disable-next-line unicorn/prefer-top-level-await
; (async () => {

	const oclif = OCLIF_PATCH ? require('../lib/patches/oclif/execute') : await import('@oclif/core')

	// Check Provisioning commands
	if (COMMAND_PATCH_ENABLED) require('../lib/patches/command').patchCommand(process.argv)

	await oclif.execute({ development: false, dir: __dirname })

})()