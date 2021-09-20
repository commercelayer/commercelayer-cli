import Command, { flags } from '@oclif/command'
import chalk from 'chalk'
import path from 'path'
import _ from 'lodash'
import { formatOutput } from './common'

import updateNotifier from 'update-notifier'

const pkg = require('../package.json')


export default abstract class extends Command {

	static flags = {
		organization: flags.string({
			char: 'o',
			description: 'the slug of your organization',
			required: true,
			env: 'CL_CLI_ORGANIZATION',
			// default: 'cli-test-org',
		}),
		domain: flags.string({
			char: 'd',
			required: false,
			hidden: true,
			dependsOn: ['organization'],
			env: 'CL_CLI_DOMAIN',
			// default: 'preprod.commercelayer.dev',
		}),
		accessToken: flags.string({
			hidden: true,
			required: true,
			env: 'CL_CLI_ACCESS_TOKEN',
		}),
	}


	static args = [
		{ name: 'fake-arg', description: 'fake argument', required: false, hidden: true },
	]


	// INIT (override)
	async init() {

		const notifier = updateNotifier({ pkg, updateCheckInterval: 1000 * 60 * 60 })

		if (notifier.update) {

			const pluginMode = path.resolve(__dirname).includes(`/@commercelayer/commercelayer-cli/node_modules/${pkg.name}/`)
			const command = pluginMode ? 'commercelayer plugins:update' : '{updateCommand}'

			notifier.notify({
				isGlobal: !pluginMode,
				message: `-= ${chalk.bgWhite.black.bold(` ${pkg.description} `)} =-\n\nNew version available: ${chalk.dim('{currentVersion}')} -> ${chalk.green('{latestVersion}')}\nRun ${chalk.cyanBright(command)} to update`,
			})

		}

		return super.init()

	}


	printError(error: any, flags?: any): void {

		let err = error

		if (error.response) {
			if (error.response.status === 401) this.error(chalk.bgRed(`${error.response.statusText} [${error.response.status}]`),
				{ suggestions: ['Execute login to get access to the selected resource'] }
			)
			else
				if (error.response.status === 500) this.error('We\'re sorry, but something went wrong (500)')
				else err = error.response.data.errors
		} else
		if (error.errors) err = error.errors
		else
		if (error.toArray) err = error.toArray().map((e: { code: string | undefined }) => {
			if (e.code) e.code = _.snakeCase(e.code).toUpperCase()	// Fix SDK camelCase issue
			return e
		})
		else
		if (error.message) err = error.message


		this.error(formatOutput(err, flags))

	}


	protected specialFolder(filePath: string): string {
		// Special directory (home / desktop)
		const root = filePath.toLowerCase().split('/')[0]
		if (['desktop', 'home'].includes(root)) {
			let filePrefix = this.config.home
			if (root === 'desktop') filePrefix += '/Desktop'
			filePath = filePath.replace(root, filePrefix)
		}
		return filePath
	}


	protected importStatus(status?: string): string {
		if (!status) return ''
		switch (status.toLowerCase()) {
			case 'completed': return chalk.greenBright(status)
			case 'interrupted': return chalk.redBright(status)
			case 'pending':
			case 'in_progress':
			default: return status
		}
	}

}


export { flags }
