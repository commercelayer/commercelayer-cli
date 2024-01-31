import Command, { Args } from '../../base'
import { type CommerceLayerProvisioningClient } from '@commercelayer/provisioning-sdk'
// import { addRequestReader, isRequestInterrupted } from '../../lang'
import { clCommand, clColor } from '@commercelayer/cli-core'


const OPERATION = 'delete'

export default class ProvisioningDelete extends Command {

	static description = 'delete an existing resource'

	static aliases = ['prov:delete', 'pd', 'pdelete', 'pdel']

	static examples = [
		'$ commercelayer provisioning:delete api_credentials/<id>',
		'$ cl prov:delete api_credentials <id>',
	]

	static flags = {
		...(clCommand.commandFlags<typeof Command.flags>(Command.flags, ['save-params', 'load-params']))
	}

	static args = {
		...Command.args,
		id: Args.string({ name: 'id', description: 'id of the resource to delete', required: false })
	}


	async run(): Promise<any> {

		const { args, flags } = await this.parse(ProvisioningDelete)

		const invalidFlags: string[] = ['fields', 'include']
		invalidFlags.forEach(x => {
			if (flags[x as keyof typeof flags]) this.error(`Flag not supported in ${clColor.cli.command(OPERATION)} operation: ${clColor.style.error(x)}`)
		})


		const { res, id } = this.checkResourceId(args.resource, args.id)

		const resource = this.checkResource(res, { singular: true })

		const showHeaders = flags.headers || flags['headers-only']


		const cl = this.initCommerceLayer(flags)

		const rawReader = (flags.raw && showHeaders) ? cl.addRawResponseReader({ headers: showHeaders }) : undefined
		// const reqReader = flags.doc ? addRequestReader(cl) : undefined

		try {

			const resSdk: any = cl[resource.api as keyof CommerceLayerProvisioningClient]
			this.checkOperation(resSdk, OPERATION)

			await resSdk.delete(id)

			if (showHeaders) this.printHeaders(rawReader?.headers, flags)

			this.log(`\n${clColor.style.success('Successfully')} deleted resource of type ${clColor.style.resource(resource.api as string)} with id ${clColor.style.id(id)}\n`)

		} catch (error) {
			/*
			if (isRequestInterrupted(error) && reqReader) {
				await this.showLiveDocumentation(reqReader.request, undefined, flags)
				cl.removeInterceptor('request', reqReader.id)
			} else */this.printError(error, flags, args)
		}

	}

}
