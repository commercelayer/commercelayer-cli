import { Command, Flags } from '@oclif/core'
import { configParam, ConfigParams, filterApplications } from './config'
import { type AppInfo } from '@commercelayer/cli-core'
import { promptApplication } from './common'
import * as cliux from '@commercelayer/cli-ux'


export default abstract class extends Command {

	static baseFlags = {
		organization: Flags.string({
			char: 'o',
			description: 'organization slug',
		}),
		domain: Flags.string({
			char: 'd',
			description: 'api domain',
			required: false,
			hidden: true,
			dependsOn: ['organization'],
		}),
		kind: Flags.string({
			char: 'k',
			description: 'application kind',
			options: configParam(ConfigParams.applicationTypeCheck),
		}),
		mode: Flags.string({
			char: 'm',
			description: 'execution mode',
			options: ['test', 'live'],
		}),
		live: Flags.boolean({
			description: 'live execution mode',
			exclusive: ['mode'],
		}),
		id: Flags.string({
			description: 'application id',
		}),
		alias: Flags.string({
			char: 'a',
			description: 'the alias associated to the application',
			exclusive: ['id'],
			multiple: false,
		}),
		appkey: Flags.string({
			description: 'CLI application key',
			hidden: true,
			exclusive: ['alias', 'id', 'mode', 'kind'],
		}),
		api: Flags.string({
			char: 'A',
			description: 'specific API application',
			exclusive: ['organization'],
			options: ['core', 'provisioning']
		})
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


export { Flags, cliux }
