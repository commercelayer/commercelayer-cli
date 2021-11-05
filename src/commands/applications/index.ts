import { Command, flags } from '@oclif/command'
import fs from 'fs'
import path from 'path'
import { AppInfo, configParam, ConfigParams } from '../../config'
import cliux from 'cli-ux'
import chalk from 'chalk'
import { appKeyMatch, center } from '../../common'


export default class ApplicationsIndex extends Command {

	static description = 'show a list of all (logged in) available CLI applications'

	static aliases = ['app:list', 'applications:list', 'app:available', 'applications:available', 'apps']

	static examples = [
		'$ commercelayer applications',
		'$ cl applications',
	]

	static flags = {
		kind: flags.string({
			char: 'k',
			description: 'application kind',
			options: configParam(ConfigParams.applicationTypeCheck),
		}),
		mode: flags.string({
			char: 'm',
			description: 'execution mode',
			options: ['test', 'live'],
		}),
	}

	static args = []

	async run() {

		const { flags } = this.parse(ApplicationsIndex)

		let configData: AppInfo[]

		try {

			const configFiles = fs.readdirSync(this.config.configDir).filter(f => f.endsWith('.config.json') && (f.split('.').length === 5))

			configData = configFiles.map(cf => {
				const appConfig = fs.readFileSync(path.join(this.config.configDir, cf), { encoding: 'utf-8' })
				return JSON.parse(appConfig)
			})

			if (flags.kind) configData = configData.filter(a => a.kind === flags.kind)
			if (flags.mode) configData = configData.filter(a => a.mode === flags.mode)

		} catch (error) {
			this.error('No CLI applications config files found', { suggestions: ['Execute first login to at least one CLI application'] })
		}

		const current = configParam(ConfigParams.currentApplication)

		this.log()
		if (configData.length > 0) {

			cliux.table(configData, {
				current: { header: '[*]', minWidth: 3, get: row => appKeyMatch(current, row) ? chalk.magentaBright(' * ') : '   ' },
				organization: { header: 'ORGANIZATION', get: row => currentColor(row, current)(row.organization) },
				name: { header: 'APPLICATION', get: row => currentColor(row, current)(row.name) },
				kind: { header: 'KIND', get: row => currentColor(row, current)(row.kind) },
				scope: { header: 'SCOPE', minWidth: 10, get: row => currentColor(row, current)(printScope(row.scope)) },
				customer: { header: 'PWD', get: row => (row.email && row.password) ? chalk.cyanBright(center('\u25C9', 'PWD'.length)) : '' },
				key: { header: 'SLUG', get: row => currentColor(row, current)(row.key) },
				id: { header: 'ID', get: row => currentColor(row, current)(row.id)},
				mode: { header: 'MODE', get: row => `${((row.mode === 'live') ? chalk.greenBright : chalk.yellowBright)(row.mode)}` },
				alias: { header: 'ALIAS', get: row => chalk.cyanBright(row.alias || '') },
			}, {
				printLine: this.log,
			})

			if (current) this.log(chalk.italic.magentaBright('\n(*) Current application'))

		} else this.log(chalk.italic('No application found'))

		this.log()

	}

}


const currentColor = (app: any, current: any): Function => {
	return (appKeyMatch(current, app) ? chalk.magentaBright : chalk.visible)
}


const printScope = (scope: string | string[] | undefined): string => {
	if (scope) {
		if (Array.isArray(scope)) {
			if (scope.length === 0) return ''
			return scope[0] + ((scope.length > 1) ? ` ${chalk.italic.dim('+' + (scope.length - 1))}` : '')
		}
		return scope
	}
	return ''
}
