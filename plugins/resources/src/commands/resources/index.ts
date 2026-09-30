import { clColor, clConfig, clUtil } from '@commercelayer/cli-core'
import * as cliux from '@commercelayer/cli-ux'
import { Command, Flags } from '@oclif/core'
import type { CommandError } from '@oclif/core/lib/interfaces'
import { resourceList } from '../../util/resources'


export default class ResourcesIndex extends Command {

	static description = 'list all the available Commerce Layer API resources'

	static examples = [
		'$ cl-resources resources',
		'$ cl-res resources',
		'$ commercelayer resources',
		'$ cl resources'
	]

	static flags = {
		help: Flags.help({ char: 'h' })
	}



	async run(): Promise<any> {

		await this.parse(ResourcesIndex)

		this.log(clColor.style.title('\n-= Commerce Layer API available resources =-\n'))

		const resourceArray = resourceList('api').map(r => {
			return { name: r, url: `${clConfig.doc.core_api_reference}/${r}` }
		})

		cliux.Table.table(resourceArray, {
				key: { header: 'NAME', minWidth: 35, get: row => clColor.blueBright(row.name) },
				description: { header: 'ONLINE DOCUMENTATION URL', get: row => cliux.hyperlink(row.url, row.url) },
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
