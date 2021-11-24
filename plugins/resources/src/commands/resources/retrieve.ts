import Command, { flags, FLAG_LOAD_PARAMS, FLAG_SAVE_COMMAND } from '../../base'
import commercelayer, { CommerceLayerClient, QueryParamsRetrieve} from '@commercelayer/sdk'
import { addRequestReader, isRequestInterrupted } from '../../lang'
import { mergeCommandParams } from '../../commands'


const OPERATION = 'retrieve'


export default class ResourcesRetrieve extends Command {

	static description = 'fetch a single resource'

	static aliases = [OPERATION, 'rr', 'res:retrieve']

	static examples = [
		'$ commercelayer resources:retrieve customers/<customerId>',
		'$ commercelayer retrieve customers <customerId>',
		'$ cl res:retrieve customers <customerId>',
		'$ clayer rr customers/<customerId>',
	]

	static flags = {
		...Command.flags,
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
    extract: flags.string({
      char: 'e',
      description: 'extract subfields from object attributes',
      multiple: true,
      exclusive: ['raw'],
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

    const loadParams = flags[FLAG_LOAD_PARAMS]
    const saveCmd = flags[FLAG_SAVE_COMMAND]
    if (saveCmd) this.checkAlias(saveCmd, resource.api, OPERATION, this.config)

		const organization = flags.organization
		const domain = flags.domain
		const accessToken = flags.accessToken


		// Include flags
		const include: string[] = this.includeFlag(flags.include)
		// Fields flags
		const fields = this.fieldsFlag(flags.fields, resource.api)


		const cl = commercelayer({ organization, domain, accessToken })

		const rawReader = flags.raw ? cl.addRawResponseReader() : undefined
		const reqReader = flags.doc ? addRequestReader(cl) : undefined

		const params: QueryParamsRetrieve = {}

		try {

			const resSdk: any = cl[resource.api as keyof CommerceLayerClient]

			this.checkOperation(resSdk, OPERATION)

			if (include && (include.length > 0)) params.include = include
			if (fields && (Object.keys(fields).length > 0)) params.fields = fields


      // Load saved command arguments
      if (loadParams) {
        const savedParams = this.loadParams(loadParams, resource.api, OPERATION)
        if (savedParams) mergeCommandParams(params, savedParams)
      }

			const res = await resSdk.retrieve(id, params)

			const out = (flags.raw && rawReader) ? rawReader.rawResponse : res

      if (flags.extract) {
        const ext = this.extractFlag(flags.extract)
        this.extractObjectFields(ext, out)
      }

			this.printOutput(out, flags)


      // Save command output
			if (flags.save || flags['save-path']) this.saveOutput(out, flags)
      // Save command srguments
      if (saveCmd) this.saveParams(saveCmd, { type: resource.api, id }, OPERATION, params)


			return out

		} catch (error) {
			if (isRequestInterrupted(error) && reqReader) {
				this.showLiveDocumentation(reqReader.request, params, flags)
				cl.removeInterceptor('request', reqReader.id)
			} else this.printError(error)
		}

	}

}
