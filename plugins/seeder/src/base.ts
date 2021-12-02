import Command, { flags } from '@oclif/command'
import commercelayer, { CommerceLayerClient, QueryParamsList } from '@commercelayer/sdk'
import chalk from 'chalk'
import path from 'path'
import config from './config'
import updateNotifier from 'update-notifier'
import { isRemotePath, pathJoin } from './common'
import { BusinessModel, readModelData } from './data'
import cliux from 'cli-ux'
import { ResourceId } from '@commercelayer/sdk/lib/cjs/resource'
import { loadSchema } from './schema'


const pkg = require('../package.json')


export default abstract class extends Command {

  static flags = {
    businessModel: flags.string({
      char: 'b',
      description: 'the kind of business model you want to import',
      // options: ['single_sku'],
      default: 'single_sku',
    }),
    url: flags.string({
      char: 'u',
      description: 'seeder data URL',
      default: pathJoin(config.dataUrl, config.seederFolder),
    }),
  }


  static args = [
    { name: 'id', description: 'the unique id of the order', required: true },
  ]


  protected cl!: CommerceLayerClient


  async init() {

    const notifier = updateNotifier({ pkg, updateCheckInterval: 1000 * 60 * 60 })

    if (notifier.update) {

      const pluginMode = path.resolve(__dirname).includes(`/@commercelayer/cli/node_modules/${pkg.name}/`)
      const command = pluginMode ? 'commercelayer plugins:update' : '{updateCommand}'

      notifier.notify({
        isGlobal: !pluginMode,
        message: `-= ${chalk.bgWhite.black.bold(` ${pkg.description} `)} =-\n\nNew version available: ${chalk.dim('{currentVersion}')} -> ${chalk.green('{latestVersion}')}\nRun ${chalk.cyanBright(command)} to update`,
      })

    }

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
    cliux.action.start(`Reading ${chalk.yellowBright('OpenAPI')} schema`)
    return loadSchema()
      .then(() => cliux.action.stop(`done ${chalk.green('\u2714')}`))
      .catch(() => {
        cliux.action.stop(chalk.redBright('Error'))
        this.error('Error reading OpenAPI schema')
      })
      .finally(() => this.log())
  }


  protected async readBusinessModelData(url: string, model: string): Promise<BusinessModel> {
    cliux.action.start(`Reading business model ${chalk.yellowBright(model)} from ${isRemotePath(url) ? 'url' : 'path'} ${chalk.yellowBright(url)}`)
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


  protected async findByReference(type: string, reference: string): Promise<ResourceId | undefined> {

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

}



export { flags }
