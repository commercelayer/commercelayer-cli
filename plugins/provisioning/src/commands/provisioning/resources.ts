import { Command, Flags, ux as cliux } from '@oclif/core'
import { resourceList } from '../../util/resources'
import { clUtil, clColor, clConfig } from '@commercelayer/cli-core'
import type { CommandError } from '@oclif/core/lib/interfaces'


export default class ProvisioningResources extends Command {

	static description = 'list all the available Provisioning API resources'

	static aliases = ['prov:resources', 'pres']

	static examples = [
		'$ commercelayer provisioning:resources',
		'$ cl prov:resources',
	]

	static flags = {
		help: Flags.help({ char: 'h' }),
	}



	async run(): Promise<any> {

		await this.parse(ProvisioningResources)

		this.log(clColor.style.title('\n-= Provisioning API available resources =-\n'))

		const resourceArray = resourceList('api').map(r => {
			return { name: r, url: `${clConfig.doc.provisioning_api_reference}/${r}` }
		})

		cliux.Table.table(resourceArray, {
			key: { header: 'NAME', minWidth: 35, get: row => clColor.blueBright(row.name) },
			description: { header: 'ONLINE DOCUMENTATION URL', get: row => row.url },
		}, {
			printLine: clUtil.log,
		})
		this.log()

	}


	async catch(error: any): Promise<any> {
		if ((error.code === 'EEXIT') && (error.message === 'EEXIT: 0')) return
		return await super.catch(error as CommandError)
	}

}
