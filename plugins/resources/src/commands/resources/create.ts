import Command, { flags } from '../../base'
import { baseURL } from '../../common'
import cl, { CLayer } from '@commercelayer/js-sdk'
import _ from 'lodash'
import chalk from 'chalk'
import { readDataFile, rawRequest, Operation } from '../../raw'
import { denormalize } from '../../jsonapi'

export default class ResourcesCreate extends Command {

  static description = 'create a new resource'

  static aliases = ['create', 'rc', 'res:create']

  static examples = [
    '$ commercelayer resources:create customers -a email=user@test.com',
    '$ clayer res:create customers -a email="user@test-com" -r customer_group=customer_groups/<customerGroupId>',
    '$ cl create customers -a email=user@test.com -m meta_key="meta value"',
    '$ cl rc customers -D /path/to/data/file/data.json',
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
      description: 'define a metadata attribute or a set of metadata attributes',
      multiple: true,
    }),
    data: flags.string({
      char: 'D',
      description: 'the data file to use as request body',
      multiple: false,
      exclusive: ['attribute', 'relationship', 'metadata'],
    }),
  }

  static args = [
    ...Command.args,
  ]

  async run() {

    const { args, flags } = this.parse(ResourcesCreate)

    const resource = this.checkResource(args.resource, { singular: true })

    const baseUrl = baseURL(flags.organization, flags.domain)
    const accessToken = flags.accessToken


    // Raw request
    if (flags.data) {
      try {
        const rawRes = await rawRequest({ operation: Operation.Create, baseUrl, accessToken, resource: resource.api }, readDataFile(flags.data))
        const out = flags.raw ? rawRes : denormalize(rawRes)
        this.printOutput(out, flags)
        this.log(`\n${chalk.greenBright('Successfully')} created new resource of type ${chalk.bold(resource.api)} with id ${chalk.bold(rawRes.data.id)}\n`)
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
    const metadata = this.mapToSdkObject(this.metadataValuesMap(flags.metadata), { camelCase: false })

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
      if (attributes.metadata) this.warn(`Attribute ${chalk.italic('metadata')} will be overwritten by the content defined with the flag ${chalk.italic('-m')}`)
      attributes.metadata = metadata
    }


    cl.init({ accessToken, endpoint: baseUrl })

    try {

      const resSdk: any = (cl as CLayer)[resource.sdk as keyof CLayer]
      const res = await resSdk.create(attributes, { rawResponse: true })

      const out = flags.raw ? res : denormalize(res)

      this.printOutput(out, flags)
      // if (res.valid())
      this.log(`\n${chalk.greenBright('Successfully')} created new resource of type ${chalk.bold(resource.api as string)} with id ${chalk.bold(res.data.id)}\n`)

      return out

    } catch (error) {
      this.printError(error)
    }

  }

}
