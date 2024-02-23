#!/usr/bin/env node

const PROVISIONING = true;

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {

	const oclif = await import('@oclif/core')

	// Check Provisioning commands
	if (PROVISIONING) require('../lib/patches/provisioning').checkProvisioningCommand(process.argv)

	await oclif.execute({ development: false, dir: __dirname })
		.then(oclif.flush(60000))
		.catch(error => {
			if (error.code === 'EEXIT' && error.oclif.exit === 0) { /* command exit (quit) */ }
			else
			if (error.message === 'HOOK_EXIT') { /* hook exit */ }
			else
			return oclif.Errors.handle(error)
		})

})()