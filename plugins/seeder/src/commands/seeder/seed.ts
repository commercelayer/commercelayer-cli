/* eslint-disable no-await-in-loop */
import Command, { Flags } from '../../base'
import { type ResourceData, type SeederResource, readResourceData, type BusinessModel } from '../../data'
import { type CommerceLayerClient } from '@commercelayer/sdk'
import config from '../../config'
import Listr from 'listr'
import { relationshipType } from '../../schema'
import type { ResourceCreate, ResourceUpdate } from '@commercelayer/sdk/lib/cjs/resource'
import { checkResourceType } from './check'
import { clToken, clColor, clUtil, clApi, clText } from '@commercelayer/cli-core'
import { type ResourceTypeNumber, requestsDelay } from '../../common'



export default class SeederSeed extends Command {

  static description = 'execute Commerce Layer seeder'

  static aliases = ['seed']

  static examples = [
    '$ commercelayer seeder:seed -u <seedUrl>',
    '$ cl seed -b multi_market',
  ]

  static flags = {
    organization: Flags.string({
      char: 'o',
      description: 'the slug of your organization',
      required: true,
      env: 'CL_CLI_ORGANIZATION',
      hidden: true,
    }),
    domain: Flags.string({
      char: 'd',
      required: false,
      hidden: true,
      dependsOn: ['organization'],
      env: 'CL_CLI_DOMAIN',
    }),
    accessToken: Flags.string({
      hidden: true,
      required: true,
      env: 'CL_CLI_ACCESS_TOKEN',
    }),
    keep: Flags.boolean({
      char: 'k',
      description: 'keep existing resources without updating them',
    }),
    delay: Flags.integer({
      char: 'D',
      description: 'add a delay in milliseconds between calls to different resources',
      hidden: true,
    }),
    debug: Flags.boolean({
      description: 'Show debug information',
      hidden: true
    })
  }




  async run(): Promise<any> {

    if (this.argv.includes('--debug')) this.log(this.argv.join())

    const { flags } = await this.parse(SeederSeed)

    if (flags.debug) this.log(JSON.stringify(flags))

    const organization = flags.organization
    const businessModel = flags.businessModel
    const accessToken = flags.accessToken
    const name = this.modelNameCheck(flags)


    try {

      const tokenInfo = clToken.decodeAccessToken(accessToken)
      if (tokenInfo.application.kind !== config.validApplicationKind)
        this.error(`Invalid application type: ${clColor.msg.error(tokenInfo.application.kind)}`, {
          suggestions: [`To execute ${clColor.cyanBright('seeder')} you must use an application ok kind ${clColor.yellowBright(config.validApplicationKind)}`],
        })

      this.initCommerceLayer(flags)

      this.log()

      // Initialize OpenAPI schema
      await this.readOpenAPISchema()

      // Read business model data
      const model = await this.readBusinessModelData(flags.url, name)


      const numRequests = await this.computeRequestsNumber(model, flags.url)
      this.delay = requestsDelay(numRequests, this.environment)

      if (flags.debug) {
        this.log(clColor.style.title('Debug information'))
        this.log('Execution environment: ' + clColor.cli.value(this.environment))
        this.log('Estimated total number of requests: ' + clColor.cli.value(`${numRequests.cacheable} (cacheable) / ${numRequests.uncacheable} (uncacheable)`))
        this.log('Computed delay between requests (ms): ' + clColor.cli.value(String(`${this.delay.cacheable} (cacheable) / ${this.delay.uncacheable} (uncacheable)`)))
        this.log('Cacheable resources: ' +  clColor.cli.value((numRequests.cacheableTypes || []).join(',')))
        this.log('Uncacheable resources: ' +  clColor.cli.value((numRequests.uncacheableTypes || []).join(',')))
        this.log()
      }


      // Create tasks
      const tasks = new Listr(model.map(res => {
        return {
          title: `Create ${clColor.italic(res.resourceType)}`,
          task: async (_ctx: any, task: Listr.ListrTaskWrapper<any>) => {
            const origTitle = task.title
            const n = await this.createResources(res, flags, task).catch(this.handleCommonError)
            task.title = `${origTitle}: [${n}]`
          },
        }
      }), { concurrent: false, exitOnError: true })

      this.log(`Seeding data for organization ${clColor.api.organization(organization)} using business model ${clColor.yellowBright(businessModel)}...\n`)

      // Execute tasks
      await tasks.run()
        .then(() => { this.log(`\n${clColor.msg.success.bold('SUCCESS')} - Data seeding completed! ${clText.symbols.check.bkgGreen}`) })
        .catch(() => { this.log(`\n${clColor.msg.error.bold('ERROR')} - Data seeding not completed, correct errors and rerun the ${clColor.cli.command('seed')} command`) })
        .finally(() => { this.log() })

    } catch (error: any) {
      this.error(error.message)
    }

  }



  private async computeRequestsNumber(model: BusinessModel, dataFilesUrl: string): Promise<ResourceTypeNumber> {

    let resources: ResourceTypeNumber = {
      cacheable: 0,
      cacheableTypes: [],
      uncacheable: 0,
      uncacheableTypes: []
    }

    try {
      for (const res of model) {

       let gets = 0 // get requests
       let paps = 0 // post and patch requests

        const resourceData = await readResourceData(dataFilesUrl, res.resourceType)
        const referenceKeys = res.importAll ? Object.keys(resourceData) : res.referenceKeys

        for (const r of referenceKeys) {

          gets++  // find resource by reference
          paps++  // create or update the resource

          const resource = resourceData[r]

          for (const field in resource) {
            if (['key', 'type'].includes(field)) continue
            const val = resource[field] as string
            const rel = relationshipType(res.resourceType, field, val)
            if (rel) {
              if (clApi.isResourceCacheable(rel, 'get')) {
                resources.cacheable++ // find related resource by reference
                if (!resources.cacheableTypes?.includes(rel)) resources.cacheableTypes?.push(rel)
              } else {
                resources.uncacheable++
                if (!resources.uncacheableTypes?.includes(rel)) resources.uncacheableTypes?.push(rel)
              }
            }
          }

        }

        if (clApi.isResourceCacheable(res.resourceType, 'get')) {
          resources.cacheable += gets
          if (!resources.cacheableTypes?.includes(res.resourceType)) resources.cacheableTypes?.push(res.resourceType)
        } else {
          resources.uncacheable += gets
          if (resources.uncacheableTypes?.includes(res.resourceType)) resources.uncacheableTypes?.push(res.resourceType)
        }
        // Posts and patches are always uncacheable
        resources.uncacheable += paps

      }
    } catch (error) {
      resources = {
        cacheable: 0,
        uncacheable: 0
      }
    }

    return resources

  }


  private async resolveRelationships(type: string, res: ResourceData): Promise<any> {

    const resourceMod: any = {}

    for (const field in res) {
      if (field === 'key') continue
      let val = res[field] as string
      const rel = relationshipType(type, field, val)
      if (rel) {
        if (Array.isArray(val)) throw new Error(`Relationship ${type}.${field} cannot be an array`)
        else {
          const slashIdx = val.indexOf('/')
          if (slashIdx >= 0) val = val.substring(slashIdx + 1)
          const remoteRes = await this.findByReference(rel, val).catch(error => {
            if (this.cl.isApiError(error)) {
              const err = error.first()
              if (err) throw new Error(`${err.code}: ${err.detail}${err.meta?.value ? ` (${JSON.stringify(err.meta?.value)})` : ''}`)
              else throw new Error(`Unable to find resource of type ${rel} with reference ${clColor.msg.error(val)} [${error.code}]`)
            }
          })
          if (remoteRes) resourceMod[field] = { type: rel, id: remoteRes.id }
          else throw new Error(`Unable to find resource of type ${rel} with reference ${clColor.msg.error(val)}`)
        }
      } else resourceMod[field] = val
    }

    return resourceMod

  }


  private async createResource(type: string, res: ResourceData): Promise<ResourceCreate> {

    const resourceCreate = await this.resolveRelationships(type, res)

    const resType = res.type || type
    checkResourceType(resType)

    const resSdk: any = this.cl[resType as keyof CommerceLayerClient]
    resourceCreate.reference_origin = config.referenceOrigin

    await this.applyRequestDelay(type, 'post')

    const remoteRes = await resSdk.create(resourceCreate).catch((error: any) => {
      if (this.cl.isApiError(error)) {
        const err = error.first()
        if (err) throw new Error(`${err.code}: ${err.detail}${err.meta?.value ? ` (${JSON.stringify(err.meta?.value)})` : ''}`)
        else throw new Error(`Error creating resource of type ${resType} and reference ${resourceCreate.reference} [${error.code}]`)
      } else throw error
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

    await this.applyRequestDelay(type, 'patch')

    const remoteRes = await resSdk.update(resourceUpdate).catch((error: any) => {
      if (this.cl.isApiError(error)) {
        const err = error.first()
        if (err) throw new Error(`${err.code}: ${err.detail}${err.meta?.value ? ` (${err.meta?.value})` : ''}`)
        else throw new Error(`Error creating resource of type ${resType} and reference ${resourceUpdate.reference} [${error.code}]`)
      } else throw error
    })

    return remoteRes

  }


  private async createResources(res: SeederResource, flags: any, task: Listr.ListrTaskWrapper): Promise<number> {

    // Read resource type data
    const resourceData = await readResourceData(flags.url, res.resourceType).catch(() => {
      throw new Error(`Error reading ${clColor.msg.error(res.resourceType)} data file`)
    })

    // Build reference keys list
    const referenceKeys = res.importAll ? Object.values(resourceData).map(v => v.reference) : res.referenceKeys
    if (!Array.isArray(referenceKeys)) throw new Error(`Attribute ${clColor.msg.error('referenceKeys')} of ${clColor.api.resource(res.resourceType)} must be an array`)

    for (const r of referenceKeys) {

      task.title = task.title.substring(0, task.title.indexOf(res.resourceType)) + clColor.italic(res.resourceType) + ': ' + r

      // Read resource data
      const resource = resourceData[r]
      if (!resource) throw new Error(`Resource not found in ${res.resourceType} file: ${clColor.msg.error(r)}`)

      // If resource exists in CL update it, otherwise create it
      const remoteRes = await this.findByReference(res.resourceType, resource.reference)
      if (remoteRes) {
        if (flags.keep) continue
        else await this.updateResource(res.resourceType, remoteRes.id, resource)
      } else await this.createResource(res.resourceType, resource)

    }

    if (flags.delay) await clUtil.sleep(flags.delay)

    return referenceKeys.length

  }

}
