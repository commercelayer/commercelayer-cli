import Command, { flags } from '@oclif/command'
import { AppInfo, configParam, ConfigParams, readConfigDir } from './config'
import inquirer from 'inquirer'
import { execMode, maxLength, printScope } from './common'
import { IConfig } from '@oclif/config'


export default abstract class extends Command {

	static flags = {
		organization: flags.string({
			char: 'o',
			description: 'organization slug',
		}),
		domain: flags.string({
			char: 'd',
			description: 'api domain',
			required: false,
			hidden: true,
			dependsOn: ['organization'],
		}),
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
		live: flags.boolean({
			description: 'live execution mode',
			exclusive: ['mode'],
		}),
		id: flags.string({
			description: 'application id',
		}),
		alias: flags.string({
			char: 'a',
			description: 'the alias associated to the application',
			exclusive: ['id'],
			multiple: false,
		}),
		appkey: flags.string({
			description: 'CLI application key',
			hidden: true,
			exclusive: ['alias', 'id', 'mode', 'kind'],
		}),
	}


	// CATCH (override)
	async catch(error: any) {
		this.error(error.message)
	}


	protected appFilterEnabled(flags: any): boolean {
		return flags.organization || flags.kind || flags.mode || flags.live || flags.id || flags.alias || flags.appkey || flags.key
	}


	protected async findApplication(flags: any): Promise<AppInfo | undefined> {

		const applications = filterApplications(this.config, flags)

		let app: AppInfo | undefined

		if (applications.length > 0)
			if (applications.length === 1) app = applications[0]
			else app = await promptApplication(applications)

		return app

	}

}


export { flags }



const promptApplication = async (apps: AppInfo[]) => {

	const appMaxLength = maxLength(apps, 'name') + 2
	const details = ['organization', 'kind', 'mode', 'alias']

	const answers = await inquirer.prompt([{
		type: 'list',
		name: 'application',
		message: 'Select an application to switch to:',
		choices: apps.map(a => {
			return { name: `${a.name.padEnd(appMaxLength, ' ')} [ ${details.map(d => {
				return String(a[d as keyof AppInfo]).padEnd(maxLength(apps, d))
			}).join(' | ')} ]${(a.scope && a.scope.length > 0) ? ` (${printScope(a.scope)})` : ''}`, value: a }
		}),
		loop: false,
		pageSize: 10,
	}])

	return answers.application

}


export const filterApplications = (config: IConfig, flags: any): AppInfo[] => {

	const mode = flags.mode || (flags.live ? execMode(flags.live) : undefined)

	const applications = readConfigDir(config, { key: flags.key || flags.appkey }).filter(app => {

		if (flags.organization && (flags.organization !== app.slug)) return false
		if (flags.domain && (flags.domain !== app.domain)) return false
		if (flags.kind && (flags.kind !== app.kind)) return false
		if (mode && (mode !== app.mode)) return false
		if (flags.id && (flags.id !== app.id)) return false
		if (flags.alias && (flags.alias !== app.alias)) return false

		return true

	})

	return applications

}
