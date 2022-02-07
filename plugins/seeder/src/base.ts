import { Command, Flags, CliUx } from '@oclif/core'
import commercelayer, { CommerceLayerClient, QueryParamsList } from '@commercelayer/sdk'
import config from './config'
import { clUpdate, clColor } from '@commercelayer/cli-core'
import { isRemotePath, pathJoin } from './common'
import { BusinessModel, readModelData } from './data'
import { ResourceId } from '@commercelayer/sdk/lib/cjs/resource'
import { loadSchema } from './schema'


const pkg = require('../package.json')


export default abstract class extends Command {

  static flags = {
    businessModel: Flags.string({
      char: 'b',
      description: 'the kind of business model you want to import',
      options: ['single_sku', 'custom'],
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
  }


  static args = [
    { name: 'id', description: 'the unique id of the order', required: true },
  ]


  protected cl!: CommerceLayerClient


  async init() {
    clUpdate.checkUpdate(pkg)
    return super.init()
  }


  async catch(error: any) {
    if ((error.code === 'EEXIT') && (error.message === 'EEXIT: 0')) return
    return super.catch(error)
  }



  protected initCommerceLayer(flags: any): void {
    const organization = flags.organization
    const domain = flags.domain
    const accessToken = flags.accessToken
    this.cl = commercelayer({ organization, domain, accessToken })
  }


  protected async readOpenAPISchema() {
    CliUx.ux.action.start(`Reading ${clColor.yellowBright('OpenAPI')} schema`)
    return loadSchema()
      .then(() => CliUx.ux.action.stop(`done ${clColor.msg.success('\u2714')}`))
      .catch(() => {
        CliUx.ux.action.stop(clColor.msg.error('Error'))
        this.error('Error reading OpenAPI schema')
      })
      .finally(() => this.log())
  }


  protected async readBusinessModelData(url: string, model: string): Promise<BusinessModel> {
    CliUx.ux.action.start(`Reading business model ${clColor.yellowBright(model)} from ${isRemotePath(url) ? 'url' : 'path'} ${clColor.style.path(url)}`)
    return readModelData(url, model)
      .then(model => {
        CliUx.ux.action.stop(`done ${clColor.msg.success('\u2714')}`)
        return model
      })
      .catch(error => {
        CliUx.ux.action.stop(clColor.msg.error('Error'))
        this.error(error)
      })
      .finally(() => this.log())
  }


  protected async findByReference(type: string, reference: string): Promise<ResourceId | undefined> {

    const params: QueryParamsList & { fields: {[key: string]: string[] } } = {
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


  protected modelNameChack(flags: any): string {
    if (flags.name && (flags.businessModel !== 'custom')) if (flags.businessModel !== 'custom') this.error(`Model name can be specified only using the ${clColor.bold('custom')} business model`)
    return flags.name || flags.businessModel
  }

}



export { Flags }
