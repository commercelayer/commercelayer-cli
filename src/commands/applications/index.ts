import { Command } from '@oclif/command'
import fs from 'fs'
import path from 'path'
import { AppInfo, configParam, ConfigParams } from '../../config'
import cliux from 'cli-ux'
import chalk from 'chalk'

export default class ApplicationsIndex extends Command {

	static description = 'show a list of all (logged in) available CLI applications'

	static aliases = ['app:list', 'applications:list', 'app:available', 'applications:available']

	static examples = [
		'$ commercelayer applications',
		'$ cl applications',
	]

	static flags = {
		// help: flags.help({char: 'h'}),
	}

	static args = []

	async run() {

		this.parse(ApplicationsIndex)

		let configData: AppInfo[]

		try {

			const configFiles = fs.readdirSync(this.config.configDir).filter(f => f.endsWith('.config.json'))

			configData = configFiles.map(cf => {
				const appConfig = fs.readFileSync(path.join(this.config.configDir, cf), { encoding: 'utf-8' })
				return JSON.parse(appConfig)
			})

		} catch (error) {
			this.error('No CLI applications config files found', { suggestions: ['Execute first login to at least one CLI application'] })
		}

		const current = configParam(ConfigParams.currentApplication)

		this.log()
		cliux.table(configData,
			{
				key: { header: 'APPLICATION (KEY)', minWidth: 20, get: row => (current && (current.key === row.key) && (current.mode === row.mode)) ? chalk.magentaBright(`${row.key} *`) : chalk.blueBright(row.key) },
				// slug: { header: '  SLUG  ', get: row => `  ${row.slug}  ` },
				name: { header: 'NAME', get: row => `${row.name}` },
				organization: { header: 'ORGANIZATION  ', get: row => `${row.organization}` },
				type: { header: 'TYPE' },
				scope: { header: 'SCOPE', minWidth: 10, get: row => printScope(row.scope) },
				mode: { header: 'MODE', get: row => `${(row.mode === 'live') ? chalk.greenBright(row.mode) : chalk.yellowBright(row.mode)}` },
			},
			{
				printLine: this.log,
			})
		this.log()

		if (current) {
			this.log(chalk.italic.magentaBright('(*) Current application'))
			this.log()
		}

	}

}


const printScope = (scope: string | string[] | undefined): string => {
	if (scope) {
		if (Array.isArray(scope)) {
			if (scope.length === 0) return ''
			return scope[0] + ((scope.length > 1) ? ` | ${scope[1]}` : '') + ((scope.length > 2) ? ` ${chalk.italic.dim('+' + (scope.length - 2))}` : '')
		}
		return scope
	}
	return ''
}
