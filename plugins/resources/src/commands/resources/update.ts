import Command, { flags } from '../../base'
import { baseURL } from '../../common'
import cl, { CLayer } from '@commercelayer/js-sdk'
import _ from 'lodash'
import chalk from 'chalk'
import { readDataFile, rawRequest, Operation } from '../../raw'
import { denormalize } from '../../jsonapi'

export default class ResourcesUpdate extends Command {

  static description = 'update an existing resource'

  static aliases = ['update', 'ru', 'res:update']

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
      exclusive: ['attribute', 'relationship', 'metadata', 'metadata-replace'],
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

    const baseUrl = baseURL(flags.organization, flags.domain)
    const accessToken = flags.accessToken


    // Raw request
    if (flags.data) {
      try {
        const rawRes = await rawRequest({ operation: Operation.Update, baseUrl, accessToken, resource: resource.api }, readDataFile(flags.data), id)
        const out = flags.raw ? rawRes : denormalize(rawRes)
        this.printOutput(out, flags)
        this.log(`\n${chalk.greenBright('Successfully')} updated resource of type ${chalk.bold(resource.api)} with id ${chalk.bold(rawRes.data.id)}\n`)
        return out
      } catch (error) {
        this.printError(error)
      }
    }


    // Attributes flags
    const attributes = this.mapToSdkObject(this.attributeValuesMap(flags.attribute))
    // Objects flags
    const objects = this.objectValuesMap(flags.object)
    // Relationships flags
    const relationships = this.relationshipValuesMap(flags.relationship)
    // Metadata flags
    const metadata = this.mapToSdkObject(this.metadataValuesMap(flags.metadata || flags['metadata-replace']), { camelCase: false })

    // Relationships
    if (relationships && (relationships.size > 0)) relationships.forEach((value, key) => {
      const relSdk: any = (cl as CLayer)[value.sdk as keyof CLayer]
      const rel = relSdk.build({ id: value.id })
      attributes[_.camelCase(key)] = rel
    })

    // Objects
    if (objects && (objects.size > 0)) {
      for (const o of objects.keys()) {
        if (Object.keys(attributes).includes(o)) this.warn(`Object ${o} will overwrite attribute ${o}`)
        else attributes[o] = objects.get(o)
      }
    }

    // Metadata
    if (metadata && (Object.keys(metadata).length > 0)) {
      if (attributes.metadata) this.warn(`Attribute ${chalk.italic('metadata')} will be overwritten by the content defined with the flags ${chalk.italic('-m/-M')}`)
      attributes.metadata = metadata
    }


    cl.init({ accessToken, endpoint: baseUrl })

    try {

      const resSdk: any = (cl as CLayer)[resource.sdk as keyof CLayer]

      // Metadata attributes merge
      if (flags.metadata) {
        const remRes = await resSdk.select('metadata').find(id, { rawResponse: true })
        const remMeta = remRes.data.attributes.metadata
        if (remMeta && (Object.keys(remMeta).length > 0)) attributes.metadata = { ...remMeta, ...metadata }
      }


      const res = await resSdk.build({ id }).update(attributes, undefined, { rawResponse: true })

      const out = flags.raw ? res : denormalize(res)

      this.printOutput(out, flags)
      // if (res.valid())
      this.log(`\n${chalk.greenBright('Successfully')} updated resource of type ${chalk.bold(resource.api as string)} with id ${chalk.bold(res.data.id)}\n`)

      return out

    } catch (error) {
      this.printError(error)
    }

  }

}
