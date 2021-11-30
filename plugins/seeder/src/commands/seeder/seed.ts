/* eslint-disable no-await-in-loop */
import Command, { flags } from '../../base'
import { ResourceData, SeederResource } from '../../data'
import commercelayer, { CommerceLayerClient, CommerceLayerStatic, QueryParamsList } from '@commercelayer/sdk'
import chalk from 'chalk'
import config from '../../config'
import Listr from 'listr'
import { readModelData, readResourceData } from '../../data'
import { loadSchema, relationshipType } from '../../schema'
import { ResourceCreate, ResourceId } from '@commercelayer/sdk/lib/cjs/resource'
import cliux from 'cli-ux'
import { pathJoin } from '../../common'



export default class SeederSeed extends Command {

  static description = 'execute Commerce Layer seeder'

  static aliases = ['seed']

  static examples = [
    '$ cl-seeder seed -o <organizationSlug> -i <clientId> -s <clientSecret> --accessToken=<accessToken> -u <seedUrl>',
    '$ cl seed -m all -u <seedUrl> -b multi_market',
  ]

  static flags = {
    ...Command.flags,
    businessModel: flags.string({
      char: 'b',
      description: 'the kind of business model you want to import',
      options: ['single_sku'],
      default: 'single_sku',
    }),
    url: flags.string({
      char: 'u',
      description: 'seeder data URL',
      default: pathJoin(config.dataUrl, config.seederFolder),
    }),
  }


  private cl!: CommerceLayerClient


  async run() {

    const { flags } = this.parse(SeederSeed)

    const organization = flags.organization
    const domain = flags.domain
    const businessModel = flags.businessModel
    const accessToken = flags.accessToken

    this.cl = commercelayer({ organization, domain, accessToken })

    this.log()

    // Initialize OpenAPI schema
    await this.readOpenAPISchema()

    // Read business model data
    const model = await this.readBusinessModelData(flags.url, businessModel)

    // Create tasks
    const tasks = new Listr(model.map(res => {
      return {
        title: `Create ${chalk.italic(res.resourceType)}`,
        task: async (_ctx: any, task: Listr.ListrTaskWrapper<any>) => {
          const origTitle = task.title
          const n = await this.createResources(res, flags, task)
          task.title = `${origTitle}: [${n}]`
        },
      }
    }), { concurrent: false, exitOnError: true })

    this.log(`Seeding data for organization ${chalk.yellowBright(organization)} using business model ${chalk.yellowBright(businessModel)}...\n`)

    // Execute tasks
    tasks.run()
      .then(() => this.log(`\n${chalk.bold.greenBright('SUCCESS')} - Data seeding completed! \u2705`))
      .catch(() => this.log(`\n${chalk.bold.redBright('ERROR')} - Data seeding not completed, correct errors and rerun the ${chalk.bold('seed')} command`))
      .finally(() => this.log())

  }


  private async readOpenAPISchema() {
    cliux.action.start(`Reading ${chalk.yellowBright('OpenAPI')} schema`)
    return loadSchema()
      .then(() => cliux.action.stop(`done ${chalk.green('\u2714')}`))
      .catch(() => {
        cliux.action.stop(chalk.redBright('Error'))
        this.error('Error reading OpenAPI schema')
      })
      .finally(() => this.log())
  }


  private async readBusinessModelData(url: string, model: string) {
    cliux.action.start(`Reading business model ${chalk.yellowBright(model)} from path ${chalk.yellowBright(url)}`)
    return readModelData(url, model)
      .then(model => {
        cliux.action.stop(`done ${chalk.green('\u2714')}`)
        return model
      })
      .catch(error => {
        cliux.action.stop(chalk.redBright('Error'))
        this.error(error)
      })
      .finally(() => this.log())
  }


  private async findByReference(type: string, reference: string): Promise<ResourceId | undefined> {

    const params: QueryParamsList = {
      fields: {},
      filters: {
        reference_eq: reference,
      },
      pageSize: 1,
    }
    if (params.fields) params.fields[type] = ['id', 'reference']

    try {
      const resSdk = this.cl[type as keyof CommerceLayerClient] as any
      const list = await resSdk.list(params)
      return list[0] as ResourceId
    } catch (error) {
      return undefined
    }

  }


  private async resolveRelationships(type: string, res: ResourceData): Promise<ResourceCreate> {

    const resourceCreate: any = {}

    for (const field in res) {
      if (field === 'key') continue
      const rel = relationshipType(type, field)
      if (rel) {
        if (Array.isArray(res[field])) throw new Error(`Relationship ${type}.${field} cannot be an array`)
        else {
          const remoteRes = await this.findByReference(rel, res[field] as string)
          if (remoteRes) resourceCreate[field] = { type: rel, id: remoteRes.id }
          else throw new Error(`Unable to find resource of type ${rel} with reference ${chalk.redBright(res[field])}`)
        }
      } else resourceCreate[field] = res[field]
    }

    return resourceCreate

  }


  private async createResource(type: string, res: ResourceData): Promise<ResourceCreate> {

    const resourceCreate = await this.resolveRelationships(type, res)

    const resType = res.type || type

    if (!this.cl.resources().includes(resType)) throw new Error(`Invalid resource type: ${chalk.redBright(resType)}`)

    const resSdk: any = this.cl[resType as keyof CommerceLayerClient]
    resourceCreate.reference_origin = config.referenceOrigin
    const remoteRes = await resSdk.create(resourceCreate).catch((error: any) => {
      if (CommerceLayerStatic.isApiError(error)) {
        const err = error.first()
        if (err) throw new Error(`${err.code}: ${err.detail}${err.meta?.value ? ` (${err.meta?.value})` : ''}`)
        else throw new Error(`Error creating resource of type ${resType} and reference ${resourceCreate.reference}`)
      }
    })

    return remoteRes

  }


  private async createResources(res: SeederResource, flags: any, task: Listr.ListrTaskWrapper): Promise<number> {

    // Read resource type data
    const resourceData = await readResourceData(flags.url, res.resourceType).catch(() => {
      throw new Error(`Error reading ${chalk.redBright(res.resourceType)} data file`)
    })

    // Build reference keys list
    const referenceKeys = res.importAll ? Object.values(resourceData).map(v => v.reference) : res.referenceKeys
    if (!Array.isArray(referenceKeys)) throw new Error(`Attribute ${chalk.redBright('referenceKeys')} of ${chalk.yellowBright(res.resourceType)} must be an array`)


    for (const r of referenceKeys) {

      task.title = task.title.substring(0, task.title.indexOf(res.resourceType)) + chalk.italic(res.resourceType) + ': ' + r

      // Read resource data
      const resource = resourceData[r]
      if (!resource) throw new Error(`Resource not found in ${res.resourceType} file: ${chalk.redBright(r)}`)

      // If resource exists in CL exit, otherwise create it
      const remoteRes = await this.findByReference(res.resourceType, resource.reference)
      if (remoteRes) continue
      else await this.createResource(res.resourceType, resource)

    }

    return referenceKeys.length

  }

}
