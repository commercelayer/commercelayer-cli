import { Command, Flags } from '@oclif/core'
import { readConfigFile, currentApplication } from '../../config'
import { inspect } from 'util'
import { printScope } from '../../common'
import { AppInfo, clColor } from '@commercelayer/cli-core'


export default class ApplicationsCurrent extends Command {

	static description = 'show the current application'

	static aliases = ['app:current']

	static examples = [
		'$ commercelayer applications:current',
		'$ commercelayer app:current --info',
	]

	static flags = {
		info: Flags.boolean({
			hidden: true,
			exclusive: ['organization', 'live'],
		}),
		json: Flags.boolean({
			char: 'j',
			description: 'show info in JSON format',
			dependsOn: ['info'],
		}),
	}

	async run() {

		const { flags } = await this.parse(ApplicationsCurrent)

		const stored = currentApplication()
		if (stored) {

			const info = readConfigFile(this.config, stored)
			this.log(`\nCurrent application: ${printCurrent(info)}\n`)

			if (flags.info) {
				this.log(clColor.style.title('-= Application Info =-'))
				this.log(flags.json ? JSON.stringify(info, null, 4) : inspect(info, false, null, true))
				this.log()
			}

		} else this.warn(clColor.italic('\nNo current application defined\n'))

	}

}


export const printCurrent = (app?: AppInfo): string => {
	if (!app || !app.key || (app.key === '')) return clColor.italic.dim('No current application')
	const mode = `${((app.mode === 'live') ? clColor.api.live.greenBright : clColor.api.test)(app.mode)}`
	return `${clColor.api.application(app.name)} (${clColor.api.slug(app.slug)}) [ ${app.organization} | ${app.kind} | ${mode} | ${app.alias} ]${app.scope?.length ? ` (Scope: ${printScope(app.scope)})` : ''}`
}
