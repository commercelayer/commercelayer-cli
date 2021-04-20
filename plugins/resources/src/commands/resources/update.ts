import Command, { flags } from '../../base'
import { baseURL } from '../../common'
import cl, { CLayer } from '@commercelayer/js-sdk'
import _ from 'lodash'
import chalk from 'chalk'
import { readDataFile, rawRequest, Operation } from '../../raw'

export default class ResourcesUpdate extends Command {

  static description = 'Update an exiasting resource'

  static aliases = ['update', 'ru', 'res:update']

  static flags = {
    ...Command.flags,
    attribute: flags.string({
      char: 'a',
      description: 'define a resource attribute',
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

    const resource = this.checkResource(res)

    const baseUrl = baseURL(flags.organization, flags.domain)
    const accessToken = flags.accessToken


    // Raw request
    if (flags.data) {
      try {
        const rawRes = await rawRequest({ operation: Operation.Update, baseUrl, accessToken, resource: resource.api }, readDataFile(flags.data), id)
        this.printOutput(rawRes, flags)
        this.log(`\n${chalk.green.bold('Success!')}: Updated resource of type ${chalk.italic(resource.api)} with id ${chalk.bold(rawRes.data.id)}\n`)
        return rawRes
      } catch (error) {
        this.printError(error)
      }
    }


    // Attributes flags
    const attributes = this.mapToSdkObject(this.attributeValuesMap(flags.attribute))
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

    // Metadata
    if (metadata && (Object.keys(metadata).length > 0)) attributes.metadata = metadata


    cl.init({ accessToken, endpoint: baseUrl })

    try {

      const resSdk: any = (cl as CLayer)[resource.sdk as keyof CLayer]

      const remRes = await resSdk.find(id)

      // Metadata attributes merge
      if (flags.metadata && remRes.metadata && (Object.keys(remRes.metadata).length > 0)) attributes.metadata = { ...remRes.metadata, ...metadata }

      const res = await remRes.update(attributes)

      /* */
      const rawRes = await resSdk.find(res.id, { rawResponse: true })
      this.printOutput(rawRes, flags)
      /* */
      // this.printOutput(res, flags)
      // if (res.valid())
      this.log(`\n${chalk.green.bold('Success!')}: Updated resource of type ${chalk.italic(resource.api as string)} with id ${chalk.bold(res.id)}\n`)

      return rawRes

    } catch (error) {
      this.printError(error)
    }

  }

}
