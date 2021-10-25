import Command, { flags } from '../../base'
import { baseURL } from '../../common'
import commercelayer, { CommerceLayerClient, QueryParamsRetrieve } from '@commercelayer/sdk'
import chalk from 'chalk'
import { readDataFile, rawRequest, Operation } from '../../raw'
import { denormalize } from '../../jsonapi'
import { addRequestReader, buildCommand, getLanguage, isRequestInterrupted } from '../../lang'

export default class ResourcesUpdate extends Command {

	static description = 'update an existing resource'

	static aliases = ['update', 'ru', 'res:update', 'patch']

	static examples = [
		'$ commercelayer resources:update customers/<customerId> -a reference=referenceId',
		'$ commercelayer res:update customers <customerId> -a reference_origin="Ref Origin"',
		'$ cl update customers/<customerId> -m meta_key="meta value"',
		'$ cl ru customers <customerId> -M mete_keu="metadata overwrite',
		'$ clayer update customers <customerId> -D /path/to/data/file/data.json',
	]

	static flags = {
		...Command.flags,
		attribute: flags.string({
			char: 'a',
			description: 'define a resource attribute',
			multiple: true,
		}),
		object: flags.string({
			char: 'O',
			description: 'define a resource object attribute',
			multiple: true,
		}),
		relationship: flags.string({
			char: 'r',
			description: 'define a relationship with another resource',
			multiple: true,
		}),
		metadata: flags.string({
			char: 'm',
			description: 'define a metadata attribute and merge it with the metadata already present in the remote resource',
			multiple: true,
			exclusive: ['metadata-replace'],
		}),
		'metadata-replace': flags.string({
			char: 'M',
			description: 'define a metadata attribute and replace every item already presente in the remote resource',
			multiple: true,
			exclusive: ['metadata'],
		}),
		data: flags.string({
			char: 'D',
			description: 'the data file to use as request body',
			multiple: false,
			exclusive: ['attribute', 'relationship', 'metadata', 'metadata-replace', 'doc'],
		}),
	}

	static args = [
		...Command.args,
		{ name: 'id', description: 'id of the resource to retrieve', required: false },
	]


	async run() {

		const { args, flags } = this.parse(ResourcesUpdate)

		const { res, id } = this.checkResourceId(args.resource, args.id)

		const resource = this.checkResource(res, { singular: true })

		const organization = flags.organization
		const domain = flags.domain
		const accessToken = flags.accessToken

		const lang = getLanguage(flags)


		// Raw request
		if (flags.data) {
			try {
				const baseUrl = baseURL(flags.organization, flags.domain)
				const rawRes = await rawRequest({ operation: Operation.Update, baseUrl, accessToken, resource: resource.api }, readDataFile(flags.data), id)
				const out = flags.raw ? rawRes : denormalize(rawRes)
				this.printOutput(out, flags)
				this.log(`\n${chalk.greenBright('Successfully')} updated resource of type ${chalk.bold(resource.api)} with id ${chalk.bold(rawRes.id)}\n`)
				return out
			} catch (error) {
				this.printError(error)
			}
		}

		const cl = commercelayer({ organization, domain, accessToken })

		// Attributes flags
		const attributes = this.attributeFlag(flags.attribute)
		// Objects flags
		const objects = this.objectFlag(flags.object)
		// Relationships flags
		const relationships = this.relationshipFlag(flags.relationship)
		// Metadata flags
		const metadata = this.metadataFlag(flags.metadata || flags['metadata-replace'])

		// Relationships
		if (relationships && Object.keys(relationships).length > 0) Object.entries(relationships).forEach(([key, value]) => {
			const relSdk: any = cl[value.type as keyof CommerceLayerClient]
			const rel = relSdk.relationship(value)
			attributes[key] = rel
		})

		// Objects
		if (objects && (Object.keys(objects).length > 0)) {
			for (const o of Object.keys(objects)) {
				if (Object.keys(attributes).includes(o)) this.warn(`Object ${o} will overwrite attribute ${o}`)
				else attributes[o] = objects[o]
			}
		}

		// Metadata
		if (metadata && (Object.keys(metadata).length > 0)) {
			if (attributes.metadata) this.warn(`Attribute ${chalk.italic('metadata')} will be overwritten by the content defined with the flags ${chalk.italic('-m/-M')}`)
			attributes.metadata = metadata
		}

		// Include flags
		const include: string[] = this.includeFlag(flags.include)
		// Fields flags
		const fields = this.fieldsFlag(flags.fields, resource.api)


		const rawReader = flags.raw ? cl.addRawResponseReader() : undefined
		const reqReader = lang ? addRequestReader(cl) : undefined

		try {

			const resSdk: any = cl[resource.api as keyof CommerceLayerClient]
			this.checkOperation(resSdk, 'update')

			const params: QueryParamsRetrieve = {}
			if (include && (include.length > 0)) params.include = include
			if (fields && (Object.keys(fields).length > 0)) params.fields = fields

			// Metadata attributes merge
			if (flags.metadata) {
				const params: QueryParamsRetrieve = { fields: {} }
				if (params?.fields) params.fields[resource.api] = ['metadata']
				const remRes = await resSdk.retrieve(id, params)
				const remMeta = remRes.metadata
				if (remMeta && (Object.keys(remMeta).length > 0)) attributes.metadata = { ...remMeta, ...metadata }
			}

			attributes.id = id

			const res = await resSdk.update(attributes, params)

			const out = (flags.raw && rawReader) ? rawReader.rawResponse : res

			this.printOutput(out, flags)
			// if (res.valid())
			this.log(`\n${chalk.greenBright('Successfully')} updated resource of type ${chalk.bold(resource.api as string)} with id ${chalk.bold(res.id)}\n`)


			if (lang && reqReader) {
				this.printCommand(lang, buildCommand(lang, reqReader.request))
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
