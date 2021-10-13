import { Command, flags } from '@oclif/command'
import chalk from 'chalk'
import cliux from 'cli-ux'
import RESOURCES from '../../util/resources/available'


export default class ResourcesIndex extends Command {

	static description = 'list all the available Commerce Layer API resources'

	static examples = [
		'$ cl-resources resources',
		'$ cl-res resources',
		'$ commercelayer resources',
		'$ cl resources',
	]

	static flags = {
		help: flags.help({ char: 'h' }),
	}

	static args = []

	async run() {

		this.parse(ResourcesIndex)

		this.log(chalk.blueBright('\n-= Commerce Layer API available resources =-\n'))

		const resourceArray = resourceList('api').map(r => {
			return { name: r, url: `https://docs.commercelayer.io/api/resources/${r}` }
		})

		cliux.table(resourceArray,
			{
				key: { header: 'NAME', minWidth: 35, get: row => chalk.blueBright(row.name) },
				description: { header: 'ONLINE DOCUMENTATION URL', get: row => row.url },
			},
			{
				printLine: this.log,
			})
		this.log()

	}


	async catch(error: any) {
		if ((error.code === 'EEXIT') && (error.message === 'EEXIT: 0')) return
		return super.catch(error)
	}


}


interface Resource {
	name: string;
	api: string;
	model: string;
	singleton?: boolean;
}


const resources: readonly Resource[] = RESOURCES



const findResource = (res: string, { singular = false } = {}): (Resource | undefined) => {
	if (res === undefined) return undefined
	const lowRes = res.toLowerCase()
	return resources.find(r => {
		return (lowRes === r.api) || (singular && (lowRes === r.name))
	})
}


const resourceList = (field: 'name' | 'api' | 'model'): string[] => {
	return resources.map(r => r[field])
}


export { findResource, Resource }
