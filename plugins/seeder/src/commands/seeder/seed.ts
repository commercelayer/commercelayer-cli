/* eslint-disable no-await-in-loop */
import Command, { flags } from '../../base'
import { ResourceData, SeederResource } from '../../data'
import { CommerceLayerClient, CommerceLayerStatic } from '@commercelayer/sdk'
import chalk from 'chalk'
import config from '../../config'
import Listr from 'listr'
import { readResourceData } from '../../data'
import { relationshipType } from '../../schema'
import { ResourceCreate, ResourceUpdate } from '@commercelayer/sdk/lib/cjs/resource'
import { checkResourceType } from './check'
import { token } from '@commercelayer/cli-core'



export default class SeederSeed extends Command {

  static description = 'execute Commerce Layer seeder'

  static aliases = ['seed']

  static examples = [
    '$ commercelayer seeder:seed -u <seedUrl>',
    '$ cl seed -b multi_market',
  ]

  static flags = {
    ...Command.flags,
    organization: flags.string({
      char: 'o',
      description: 'the slug of your organization',
      required: true,
      env: 'CL_CLI_ORGANIZATION',
    }),
    domain: flags.string({
      char: 'd',
      required: false,
      hidden: true,
      dependsOn: ['organization'],
      env: 'CL_CLI_DOMAIN',
    }),
    accessToken: flags.string({
      hidden: true,
      required: true,
      env: 'CL_CLI_ACCESS_TOKEN',
    }),
    keep: flags.boolean({
      char: 'k',
      description: 'keep existing resources without updating them',
    }),
  }


  async run() {

    const { flags } = this.parse(SeederSeed)

    const organization = flags.organization
    const businessModel = flags.businessModel
    const accessToken = flags.accessToken
    const name = this.modelNameChack(flags)

    const tokenInfo = token.decodeAccessToken(accessToken)
    if (tokenInfo.application.kind !== config.validApplicationKind)
      this.error(`Invalid application type: ${chalk.redBright(tokenInfo.application.kind)}`, {
        suggestions: [`To execute ${chalk.cyanBright('seeder')} you must use an application ok kind ${chalk.yellowBright(config.validApplicationKind)}`],
      })

    this.initCommerceLayer(flags)

    this.log()

    try {

      // Initialize OpenAPI schema
      await this.readOpenAPISchema()

      // Read business model data
      const model = await this.readBusinessModelData(flags.url, name)

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

    } catch (error: any) {
      this.error(error.message)
    }

  }


  private async resolveRelationships(type: string, res: ResourceData): Promise<any> {

    const resourceMod: any = {}

    for (const field in res) {
      if (field === 'key') continue
      const rel = relationshipType(type, field)
      if (rel) {
        if (Array.isArray(res[field])) throw new Error(`Relationship ${type}.${field} cannot be an array`)
        else {
          const remoteRes = await this.findByReference(rel, res[field] as string)
          if (remoteRes) resourceMod[field] = { type: rel, id: remoteRes.id }
          else throw new Error(`Unable to find resource of type ${rel} with reference ${chalk.redBright(res[field])}`)
        }
      } else resourceMod[field] = res[field]
    }

    return resourceMod

  }


  private async createResource(type: string, res: ResourceData): Promise<ResourceCreate> {

    const resourceCreate = await this.resolveRelationships(type, res)

    const resType = res.type || type
    checkResourceType(resType)

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


  private async updateResource(type: string, id: string, res: ResourceData): Promise<ResourceUpdate> {

    const resourceUpdate = await this.resolveRelationships(type, res)

    const resType = res.type || type
    checkResourceType(resType)

    const resSdk: any = this.cl[resType as keyof CommerceLayerClient]

    resourceUpdate.id = id
    resourceUpdate.reference_origin = config.referenceOrigin

    const remoteRes = await resSdk.update(resourceUpdate).catch((error: any) => {
      if (CommerceLayerStatic.isApiError(error)) {
        const err = error.first()
        if (err) throw new Error(`${err.code}: ${err.detail}${err.meta?.value ? ` (${err.meta?.value})` : ''}`)
        else throw new Error(`Error creating resource of type ${resType} and reference ${resourceUpdate.reference}`)
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

      // If resource exists in CL update it, otherwise create it
      const remoteRes = await this.findByReference(res.resourceType, resource.reference)
      if (remoteRes) {
        if (flags.keep) continue
        else await this.updateResource(res.resourceType, remoteRes.id, resource)
      } else await this.createResource(res.resourceType, resource)

    }

    return referenceKeys.length

  }

}
