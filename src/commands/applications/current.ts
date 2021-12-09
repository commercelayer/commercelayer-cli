import { Command, flags } from '@oclif/command'
import chalk from 'chalk'
import { readConfigFile, AppInfo, currentApplication } from '../../config'
import { inspect } from 'util'
import { printScope } from '../../common'


export default class ApplicationsCurrent extends Command {

	static description = 'show the current application'

	static aliases = ['app:current']

	static examples = [
		'$ commercelayer applications:current',
		'$ commercelayer app:current --info',
	]

	static flags = {
		info: flags.boolean({
			hidden: true,
			exclusive: ['organization', 'live'],
		}),
		json: flags.boolean({
			char: 'j',
			description: 'show info in JSON format',
			dependsOn: ['info'],
		}),
	}

	async run() {

		const { flags } = this.parse(ApplicationsCurrent)

		const stored = currentApplication()
		if (stored) {

			const info = readConfigFile(this.config, stored)
			this.log(`\nCurrent application: ${printCurrent(info)}\n`)

			if (flags.info) {
				this.log(chalk.blueBright('-= Application Info =-'))
				this.log(flags.json ? JSON.stringify(info, null, 4) : inspect(info, false, null, true))
				this.log()
			}

		} else this.warn(chalk.italic('\nNo current application defined\n'))

	}

}


export const printCurrent = (app?: AppInfo): string => {
	if (!app || !app.key || (app.key === '')) return chalk.italic.dim('No current application')
	const mode = `${((app.mode === 'live') ? chalk.greenBright : chalk.yellowBright)(app.mode)}`
	return `${chalk.bold.yellowBright(app.name)}  [ ${app.organization} | ${app.kind} | ${mode} | ${app.alias} ]${app.scope?.length ? ` (Scope: ${printScope(app.scope)})` : ''}`
}
