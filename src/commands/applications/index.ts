import Command, { filterApplications, Flags } from '../../base'
import {configParam, ConfigParams } from '../../config'
import cliux from 'cli-ux'
import chalk from 'chalk'
import { printScope } from '../../common'
import { AppInfo, clApplication, clOutput, clUtil } from '@commercelayer/cli-core'


export default class ApplicationsIndex extends Command {

	static description = 'show a list of all (logged in) available CLI applications'

	static aliases = ['app:list', 'applications:list', 'app:available', 'applications:available', 'apps']

	static examples = [
		'$ commercelayer applications',
		'$ cl applications',
	]

	static flags = {
		...Command.flags,
		extra: Flags.boolean({
			char: 'X',
			description: 'show applications extra info',
			hidden: true,
		}),
	}

	static args = []

	async run() {

		const { flags } = await this.parse(ApplicationsIndex)

		let configData: AppInfo[]
		try {
			configData = filterApplications(this.config, flags)
		} catch (error) {
			this.error('No application config file found', { suggestions: ['Execute first login to at least one Commerce Layer application'] })
		}

		const current = configParam(ConfigParams.currentApplication)
		const currentChar = '\u25C9'

		this.log()
		if (configData.length > 0) {

			const currentVisibile = configData.some(a => clApplication.appKeyMatch(current, a))

			cliux.table(configData as any, {
				current: { header: `[${currentChar}]`, minWidth: 3, get: row => clApplication.appKeyMatch(current, row as unknown as AppInfo) ? chalk.magentaBright(` ${currentChar} `) : '   ' },
				organization: { header: 'ORGANIZATION', get: row => currentColor(row, current)(row.organization) },
				slug: { header: 'SLUG', get: row => currentColor(row, current)(row.slug) },
				name: { header: 'APPLICATION', get: row => currentColor(row, current)(row.name) },
				id: { header: 'ID', get: row => currentColor(row, current)(row.id)},
				kind: { header: 'KIND', get: row => currentColor(row, current)(row.kind) },
				scope: { header: 'SCOPE', minWidth: 10, get: row => currentColor(row, current)(printScope(row.scope as string)) },
				customer: { header: 'PWD', get: row => (row.email && row.password) ? chalk.cyanBright(clOutput.center('\u221A', 'PWD'.length)) : '' },
				mode: { header: 'MODE', get: row => `${((row.mode === 'live') ? chalk.greenBright : chalk.yellowBright)(row.mode)}` },
				alias: { header: 'ALIAS', get: row => chalk.cyanBright(row.alias || '') },
				...extraColumns(flags),
			}, {
				printLine: clUtil.log,
			})

			if (current && currentVisibile) this.log(chalk.italic.magentaBright(`\n(${currentChar}) Current application`))

		} else this.log(chalk.italic('No application found'))

		this.log()

	}

}


const extraColumns = (flags: any): any => {
	const extra: any = {}
	if (flags.extra) {
		extra.appkey = { header: chalk.dim('APPKEY'), get: (row: { key: any }) => chalk.dim(row.key || '') }
		extra.domain = { header: chalk.dim('   DOMAIN'), get: (row: { domain: any }) => chalk.dim(row.domain || '') }
	}
	return extra
}


const currentColor = (app: any, current: any): Function => {
	return (clApplication.appKeyMatch(current, app) ? chalk.magentaBright : chalk.visible)
}

