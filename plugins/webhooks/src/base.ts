import Command, { flags } from '@oclif/command'
import chalk from 'chalk'
import path from 'path'
import { inspect } from 'util'
import _ from 'lodash'

import updateNotifier from 'update-notifier'

const pkg = require('../package.json')


export default abstract class extends Command {

	static flags = {
		organization: flags.string({
			char: 'o',
			description: 'the slug of your organization',
			required: true,
			env: 'CL_CLI_ORGANIZATION',
		}),
		domain: flags.string({
			char: 'd',
			required: false,
			hidden: true,
			dependsOn: ['organization'],
			env: 'CL_CLI_DOMAIN',
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

}


export { flags }



const inspectObject = (object: any, color = true): string => {
	return inspect(object, {
		showHidden: false,
		depth: null,
		colors: color,
		sorted: false,
		maxArrayLength: Infinity,
		breakLength: 120,
	})
}


const formatOutput = (output: any, flags?: any, { color = true } = {}) => {
	if (!output) return ''
	if (typeof output === 'string') return output
	return (flags && flags.json) ?
		JSON.stringify(output, null, (flags.unformatted ? undefined : 4)) : inspectObject(output, color)
}
