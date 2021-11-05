import { Command, flags } from '@oclif/command'
import chalk from 'chalk'
import { ConfigParams, readConfigFile, configParam, AppInfo } from '../../config'
import { inspect } from 'util'


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
			dependsOn: ['info'],
		}),
	}

	async run() {

		const { flags } = this.parse(ApplicationsCurrent)

		const stored = configParam(ConfigParams.currentApplication)
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


export const printCurrent = (app: AppInfo): string => {
	if (!app.key || (app.key === '')) return chalk.italic.dim('No current application')
	const mode = `${((app.mode === 'live') ? chalk.greenBright : chalk.yellowBright)(app.mode)}`
	return `${chalk.bold.yellowBright(app.name)}  [ ${app.organization} | ${mode} ]`
}
