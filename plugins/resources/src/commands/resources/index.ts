import { Command, Flags, CliUx } from '@oclif/core'
import { resourceList } from '../../util/resources'
import { clUtil, clColor } from '@commercelayer/cli-core'


export default class ResourcesIndex extends Command {

	static description = 'list all the available Commerce Layer API resources'

	static examples = [
		'$ cl-resources resources',
		'$ cl-res resources',
		'$ commercelayer resources',
		'$ cl resources',
	]

	static flags = {
		help: Flags.help({ char: 'h' }),
	}

	static args = []

	async run() {

		await this.parse(ResourcesIndex)

		this.log(clColor.style.title('\n-= Commerce Layer API available resources =-\n'))

		const resourceArray = resourceList('api').map(r => {
			return { name: r, url: `https://docs.commercelayer.io/api/resources/${r}` }
		})

		CliUx.Table.table(resourceArray, {
				key: { header: 'NAME', minWidth: 35, get: row => clColor.blueBright(row.name) },
				description: { header: 'ONLINE DOCUMENTATION URL', get: row => row.url },
			}, {
				printLine: clUtil.log,
			})
		this.log()

	}


	async catch(error: any) {
		if ((error.code === 'EEXIT') && (error.message === 'EEXIT: 0')) return
		return super.catch(error)
	}


}
