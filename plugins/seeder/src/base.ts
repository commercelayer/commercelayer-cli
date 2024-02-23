import { Command, Flags, ux as cliux } from '@oclif/core'
import commercelayer, { CommerceLayerStatic, type CommerceLayerClient, type QueryParamsList } from '@commercelayer/sdk'
import config from './config'
import { clUpdate, clColor, clToken, type ApiMode, clUtil, clApi } from '@commercelayer/cli-core'
import { isRemotePath, pathJoin } from './common'
import { type BusinessModel, readModelData } from './data'
import { loadSchema } from './schema'
import type { ListResponse, ResourceId } from '@commercelayer/sdk/lib/cjs/resource'
import type { Method } from 'axios'
import type { CommandError } from '@oclif/core/lib/interfaces'
import type { CLIError } from '@oclif/core/lib/errors'


const pkg: clUpdate.Package = require('../package.json')


export default abstract class extends Command {

  static baseFlags = {
    businessModel: Flags.string({
      char: 'b',
      description: 'the kind of business model you want to import',
      options: ['single_sku', 'multi_market', 'custom'],
      default: 'single_sku',
    }),
    url: Flags.string({
      char: 'u',
      description: 'seeder data URL',
      default: pathJoin(config.dataUrl, config.seederFolder),
    }),
    name: Flags.string({
      char: 'n',
      description: 'the name of the business model file to use',
      dependsOn: ['url'],
    }),
    debug: Flags.boolean({
      description: 'show command debug information',
      hidden: true,
      required: false,
    })
  }


  static args = {}


  protected cl!: CommerceLayerClient

  protected environment!: ApiMode

  protected delay!: {
    cacheable: number;
    uncacheable: number;
  }


  protected async applyRequestDelay(resourceType: string, method: Method = 'get'): Promise<void> {
      const delay = (clApi.isResourceCacheable(resourceType, method)? this.delay.cacheable : this.delay.uncacheable) || 0
      if (delay > 0) await clUtil.sleep(delay)
  }


  async init(): Promise<any> {
    clUpdate.checkUpdate(pkg)
    return await super.init()
  }


  async catch(error: CLIError): Promise<any> {
    if ((error.code === 'EEXIT') && (error.message === 'EEXIT: 0')) return
    return await super.catch(error)
  }



  protected initCommerceLayer(flags: any): void {

    const organization = flags.organization
    const domain = flags.domain
    const accessToken: string = flags.accessToken
    const userAgent = clUtil.userAgent(this.config)

    this.cl = commercelayer({ organization, domain, accessToken, userAgent })

    this.environment = clToken.getTokenEnvironment(accessToken)

  }


  protected async readOpenAPISchema(): Promise<any> {
    cliux.action.start(`Reading ${clColor.yellowBright('OpenAPI')} schema`)
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    return await loadSchema()
      .then(() => { cliux.action.stop(`done ${clColor.msg.success('\u2714')}`) })
      .catch(error => {
        cliux.action.stop(clColor.msg.error('Error'))
        console.log(error)
        this.error('Error reading OpenAPI schema')
      })
      .finally(() => { this.log() })
  }


  protected async readBusinessModelData(url: string, model: string): Promise<BusinessModel> {
    cliux.action.start(`Reading business model ${clColor.yellowBright(model)} from ${isRemotePath(url) ? 'url' : 'path'} ${clColor.style.path(url)}`)
    return await readModelData(url, model)
      .then(model => {
        cliux.action.stop(`done ${clColor.msg.success('\u2714')}`)
        return model
      })
      .catch(error => {
        cliux.action.stop(clColor.msg.error('Error'))
        this.error(error as CommandError)
      })
      .finally(() => { this.log() })
  }


  protected async findByReference(type: string, reference: string): Promise<ResourceId | undefined> {

    const params: QueryParamsList & { fields: Record<string, string[]> } = {
      fields: {},
      filters: {
        reference_eq: reference,
      },
      pageSize: 1,
    }
    if (params.fields) params.fields[type] = ['id', 'reference']

    await this.applyRequestDelay(type, 'get')

    const resSdk = this.cl[type as keyof CommerceLayerClient] as any
    const list = await resSdk.list(params) as ListResponse<ResourceId>

    return list.first()

  }


  protected modelNameCheck(flags: any): string {
    if (flags.name && (flags.businessModel !== 'custom'))
      if (flags.businessModel !== 'custom') this.error(`Model name can be specified only using the ${clColor.bold('custom')} business model`)
    return flags.name || flags.businessModel
  }


  protected handleCommonError(error: Error): never {
    console.error(error)
    if (CommerceLayerStatic.isApiError(error)) {
      const err = error.first()
      if (err) throw new Error(`${err.code}: ${err.detail}${err.meta?.value ? ` (${err.meta?.value})` : ''}`)
      else throw new Error(`Error executing task [${error.code}]`)
    } else throw error
  }

}



export { Flags }
