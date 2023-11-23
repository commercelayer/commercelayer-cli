import Command, { Flags, cliux } from '../../base'
import { configParam, ConfigParams, filterApplications } from '../../config'
import { printScope } from '../../common'
import { type AppInfo, clApplication, clOutput, clUtil, clColor } from '@commercelayer/cli-core'


export default class ApplicationsIndex extends Command {

	static description = 'show a list of all (logged in) available CLI applications'

	static aliases = ['app:list', 'applications:list', 'app:available', 'applications:available', 'apps']

	static examples = [
		'$ commercelayer applications',
		'$ cl applications',
	]

	static flags = {
		extra: Flags.boolean({
			char: 'X',
			description: 'show applications extra info',
			hidden: true,
		}),
		sort: Flags.boolean({
			char: 'S',
			description: 'sort applications by Organization and Application name',
		}),
	}


	async run(): Promise<any> {

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

			const currentVisible = configData.some(a => clApplication.appKeyMatch(current, a))

			const sortedData = flags.sort ? configData.sort((a: AppInfo, b: AppInfo): number => {
				const cmp = a.organization.localeCompare(b.organization)
				return (cmp === 0) ? a.name.localeCompare(b.name) : cmp
			}) : configData

			cliux.Table.table(sortedData as any, {
				current: { header: `[${currentChar}]`, minWidth: 3, get: row => clApplication.appKeyMatch(current, row as unknown as AppInfo) ? clColor.magentaBright(` ${currentChar} `) : '   ' },
				organization: { header: 'ORGANIZATION / API', get: row => currentColor(row, current)(row.organization) },
				slug: { header: 'SLUG', get: row => currentColor(row, current)(row.slug) },
				name: { header: 'APPLICATION', get: row => currentColor(row, current)(row.name) },
				kind: { header: 'KIND', get: row => currentColor(row, current)(row.kind) },
				scope: { header: 'SCOPE', minWidth: 10, get: row => currentColor(row, current)(printScope(row.scope as string)) },
				customer: { header: 'PWD', get: row => (row.email && row.password) ? clColor.cyanBright(clOutput.center('\u221A', 'PWD'.length)) : '' },
				mode: { header: 'MODE', get: row => `${((row.mode === 'live') ? clColor.api.live : clColor.api.test)(row.mode)}` },
				alias: { header: 'ALIAS', get: row => clColor.cli.alias(row.alias || '') },
				...extraColumns(flags),
			}, {
				printLine: clUtil.log,
			})

			if (current && currentVisible) this.log(clColor.italic.magentaBright(`\n(${currentChar}) Current application`))

		} else this.log(clColor.italic('No application found'))

		this.log()

	}

}


const extraColumns = (flags: any): any => {
	const extra: any = {}
	if (flags.extra) {
		extra.id = { header: 'ID', get: (row: { id: any }) => clColor.dim(row.id || '')  }
		extra.appkey = { header: 'APPKEY', get: (row: { key: any }) => clColor.dim(row.key || '') }
		extra.domain = { header: 'DOMAIN', get: (row: { domain: any }) => clColor.dim(row.domain || '') }
	}
	return extra
}


const currentColor = (app: any, current: any): ((s: unknown) => string) => {
	return (clApplication.appKeyMatch(current, app) ? clColor.magentaBright : clColor.visible)
}

