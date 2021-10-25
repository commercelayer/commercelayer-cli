import Command, { flags } from '../../base'
import commercelayer, { CommerceLayerClient, QueryParamsRetrieve} from '@commercelayer/sdk'
import { addRequestReader, buildCommand, getLanguage, isRequestInterrupted } from '../../lang'


export default class ResourcesRetrieve extends Command {

	static description = 'fetch a single resource'

	static aliases = ['retrieve', 'rr', 'res:retrieve']

	static examples = [
		'$ commercelayer resources:retrieve customers/<customerId>',
		'$ commercelayer retrieve customers <customerId>',
		'$ cl res:retrieve customers <customerId>',
		'$ clayer rr customers/<customerId>',
	]

	static flags = {
		...Command.flags,
		include: flags.string({
			char: 'i',
			multiple: true,
			description: 'comma separated resources to include',
		}),
		fields: flags.string({
			char: 'f',
			multiple: true,
			description: 'comma separeted list of fields in the format [resource]=field1,field2...',
		}),
		save: flags.string({
			char: 'x',
			description: 'save command output to file',
			multiple: false,
			exclusive: ['save-path'],
		}),
		'save-path': flags.string({
			char: 'X',
			description: 'save command output to file and create missing path directories',
			multiple: false,
			exclusive: ['save'],
		}),
	}

	static args = [
		...Command.args,
		{ name: 'id', description: 'id of the resource to retrieve', required: false },
	]

	async run() {

		const { args, flags } = this.parse(ResourcesRetrieve)

		const { res, id } = this.checkResourceId(args.resource, args.id)

		const resource = this.checkResource(res, { singular: true })

		const organization = flags.organization
		const domain = flags.domain
		const accessToken = flags.accessToken

		const lang = getLanguage(flags)


		// Include flags
		const include: string[] = this.includeFlag(flags.include)
		// Fields flags
		const fields = this.fieldsFlag(flags.fields, resource.api)


		const cl = commercelayer({ organization, domain, accessToken })

		const rawReader = flags.raw ? cl.addRawResponseReader() : undefined
		const reqReader = lang ? addRequestReader(cl) : undefined

		try {

			const resSdk: any = cl[resource.api as keyof CommerceLayerClient]
			const params: QueryParamsRetrieve = {}

			this.checkOperation(resSdk, 'retrieve')

			if (include && (include.length > 0)) params.include = include
			if (fields && (Object.keys(fields).length > 0)) params.fields = fields

			const res = await resSdk.retrieve(id, params)

			const out = (flags.raw && rawReader) ? rawReader.rawResponse : res

			this.printOutput(out, flags)

			if (flags.save || flags['save-path']) this.saveOutput(out, flags)

			if (lang && reqReader) {
				this.printCommand(lang, buildCommand(lang, reqReader.request, params))
				cl.removeInterceptor('request', reqReader.id)
			}


			return out

		} catch (error) {
			if (isRequestInterrupted(error)) {
				if (lang && reqReader) {
					this.printCommand(lang, buildCommand(lang, reqReader.request))
					cl.removeInterceptor('request', reqReader.id)
				}
			} else this.printError(error)
		}

	}

}
