import Command, { Flags, Args, FLAG_LOAD_PARAMS, FLAG_SAVE_PARAMS } from '../../base'
import { clApi, clColor } from '@commercelayer/cli-core'
import type { CommerceLayerClient, QueryParamsRetrieve } from '@commercelayer/sdk'
import { addRequestReader, isRequestInterrupted } from '../../lang'
import { mergeCommandParams } from '../../commands'


const OPERATION = 'update'


export default class ResourcesUpdate extends Command {

  static description = 'update an existing resource'

  static aliases = [OPERATION, 'ru', 'res:update', 'patch']

  static examples = [
    '$ commercelayer resources:update customers/<customerId> -a reference=referenceId',
    '$ commercelayer res:update customers <customerId> -a reference_origin="Ref Origin"',
    '$ cl update customers/<customerId> -m meta_key="meta value"',
    '$ cl ru customers <customerId> -M meta_key="metadata overwrite',
    '$ clayer update customers <customerId> -D /path/to/data/file/data.json',
    '$ cl update order <orderId> -r billing_address=addresses/<addressId>',
    '$ cl update customer <customerId> -r customer_group=<customerGroupId>'
  ]

  static flags = {
    ...Command.flags,
    attribute: Flags.string({
      char: 'a',
      description: 'define a resource attribute',
      multiple: true,
    }),
    object: Flags.string({
      char: 'O',
      description: 'define a resource object attribute',
      multiple: true,
    }),
    relationship: Flags.string({
      char: 'r',
      description: 'define a relationship with another resource',
      multiple: true,
    }),
    metadata: Flags.string({
      char: 'm',
      description: 'define a metadata attribute and merge it with the metadata already present in the remote resource',
      multiple: true,
      exclusive: ['metadata-replace'],
    }),
    'metadata-replace': Flags.string({
      char: 'M',
      description: 'define a metadata attribute and replace every item already present in the remote resource',
      multiple: true,
      exclusive: ['metadata'],
    }),
    data: Flags.string({
      char: 'D',
      description: 'the data file to use as request body',
      multiple: false,
      exclusive: ['attribute', 'relationship', 'metadata', 'metadata-replace', 'doc', FLAG_LOAD_PARAMS, FLAG_SAVE_PARAMS],
    }),
    tags: Flags.string({
      char: 't',
      description: 'list of tags associated with the resource',
      multiple: true
    })
  }

  static args = {
    ...Command.args,
    id: Args.string({ name: 'id', description: 'id of the resource to update', required: false }),
  }


  async run(): Promise<any> {

    const { args, flags } = await this.parse(ResourcesUpdate)

    const { res, id } = this.checkResourceId(args.resource, args.id)
    const resource = this.checkResource(res, { singular: true })

    const loadParams = flags[FLAG_LOAD_PARAMS]
    const saveCmd = flags[FLAG_SAVE_PARAMS]
    if (saveCmd) this.checkAlias(saveCmd, resource.api, OPERATION, this.config)
    const showHeaders = flags.headers || flags['headers-only']


    // Raw request
    if (flags.data) {
      try {
        const baseUrl = clApi.baseURL('core', flags.organization, flags.domain)
        const accessToken = flags.accessToken
        const rawRes = await clApi.request.raw({ operation: clApi.Operation.Update, baseUrl, accessToken, resource: resource.api }, clApi.request.readDataFile(flags.data), id)
        const out = flags.raw ? rawRes : clApi.response.denormalize(rawRes)
        this.printOutput(out, flags)
        this.log(`\n${clColor.style.success('Successfully')} updated resource of type ${clColor.style.resource(resource.api)} with id ${clColor.style.id(rawRes.id)}\n`)
        return out
      } catch (error) {
        this.printError(error)
      }
    }

    const cl = this.initCommerceLayer(flags)

    // Attributes flags
    const attributes = this.attributeFlag(flags.attribute)
    // Objects flags
    const objects = this.objectFlag(flags.object)
    // Relationships flags
    const relationships = this.relationshipFlag(flags.relationship, flags.organization)
    // Metadata flags
    const metadata = this.metadataFlag(flags.metadata || flags['metadata-replace'], { fixTypes: true })

    // Relationships
    if (relationships && Object.keys(relationships).length > 0) Object.entries(relationships).forEach(([key, value]) => {
      const relSdk: any = cl[value.type as keyof CommerceLayerClient]
      const rel = relSdk.relationship(((value.id === null) || (value.id === 'null')) ? null : value)
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
      if (attributes.metadata) this.warn(`Attribute ${clColor.style.attribute('metadata')} will be overwritten by the content defined with the flags ${clColor.style.flag('-m/-M')}`)
      attributes.metadata = metadata
    }

    // Tag flags
    if (flags.tags) {
      this.checkTag(resource.api)
      const tags = this.tagFlag(flags.tags)
      if (tags) attributes.tags = tags.map(t => cl.tags.relationship(t))
    }

    // Include flags
    const include: string[] = this.includeFlag(flags.include, relationships, flags['force-include'])
    // Fields flags
    const fields = this.fieldsFlag(flags.fields, resource.api)


    const rawReader = flags.raw ? cl.addRawResponseReader({ headers: showHeaders }) : undefined
    const reqReader = flags.doc ? addRequestReader(cl) : undefined

    const params: QueryParamsRetrieve = {}

    try {

      const resSdk: any = cl[resource.api as keyof CommerceLayerClient]
      this.checkOperation(resSdk, OPERATION, attributes)

      if (include && (include.length > 0)) params.include = include
      if (fields && (Object.keys(fields).length > 0)) params.fields = fields

      // Metadata attributes merge
      if (flags.metadata) {
        const params: QueryParamsRetrieve = { fields: { [resource.api]: ['metadata'] } }
        const remRes = await resSdk.retrieve(id, params)
        const remMeta: object = remRes.metadata
        if (remMeta && (Object.keys(remMeta).length > 0)) attributes.metadata = { ...remMeta, ...metadata }
      }

      attributes.id = id


      // Load saved command arguments
      if (loadParams) {
        const savedParams = this.loadParams(loadParams, resource.api, OPERATION)
        if (savedParams) mergeCommandParams(params, savedParams)
      }


      const res = await resSdk.update(attributes, params)

      // Save last resource id
      if (res?.id) this.lastResources(flags.organization, { [res.type]: res.id })

      const out = (flags.raw && rawReader) ? rawReader.rawResponse : res

      this.printHeaders(rawReader?.headers, flags)
      this.printOutput(out, flags)

      this.log(`\n${clColor.style.success('Successfully')} updated resource of type ${clColor.style.resource(resource.api)} with id ${clColor.style.id(res.id)}\n`)


      // Save command arguments
      if (saveCmd) this.saveParams(saveCmd, { type: resource.api }, OPERATION, params)


      return out

    } catch (error) {
      if (isRequestInterrupted(error) && reqReader) {
        await this.showLiveDocumentation(reqReader.request, undefined, flags)
        cl.removeInterceptor('request', reqReader.id)
      } else this.printError(error, flags, args)
    }

  }

}
