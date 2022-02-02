import Command from '../../base'
import commercelayer, { CommerceLayerClient } from '@commercelayer/sdk'
import { addRequestReader, isRequestInterrupted } from '../../lang'
import { clCommand, clColor } from '@commercelayer/cli-core'

export default class ResourcesDelete extends Command {

	static description = 'delete an existing resource'

	static aliases = ['delete', 'rd', 'res:delete']

	static examples = [
		'$ commercelayer resources:delete customers/<customerId>',
		'$ cl delete customers <customerId>',
	]

	static flags = {
		...(clCommand.commandFlags<typeof Command.flags>(Command.flags, ['save-params', 'load-params'])),
	}

	static args = [
		...Command.args,
		{ name: 'id', description: 'id of the resource to retrieve', required: false },
	]


	async run() {

		const { args, flags } = await this.parse(ResourcesDelete)

		const invalidFlags: string[] = ['fields', 'include']
		invalidFlags.forEach(x => {
			if (flags[x as keyof typeof flags]) this.error(`Flag non supported in ${clColor.italic('delete')} operation: ${clColor.style.error(x)}`)
		})


		const { res, id } = this.checkResourceId(args.resource, args.id)

		const resource = this.checkResource(res, { singular: true })

		const organization = flags.organization
		const domain = flags.domain
		const accessToken = flags.accessToken


		const cl = commercelayer({ organization, domain, accessToken })

		const reqReader = flags.doc ? addRequestReader(cl) : undefined

		try {

			const resSdk: any = cl[resource.api as keyof CommerceLayerClient]
			this.checkOperation(resSdk, 'delete')

			await resSdk.delete(id)

			this.log(`\n${clColor.style.success('Successfully')} deleted resource of type ${clColor.style.resource(resource.api as string)} with id ${clColor.style.id(id)}\n`)

		} catch (error) {
			if (isRequestInterrupted(error) && reqReader) {
				this.showLiveDocumentation(reqReader.request, undefined, flags)
				cl.removeInterceptor('request', reqReader.id)
			} else this.printError(error)
		}

	}

}
