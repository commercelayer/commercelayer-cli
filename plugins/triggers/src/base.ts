import { CommerceLayerStatic, Order } from '@commercelayer/sdk'
import Command, { flags } from '@oclif/command'
import chalk from 'chalk'
import path from 'path'
import updateNotifier from 'update-notifier'
import { formatError, formatOutput } from './common'


const pkg = require('../package.json')


export default abstract class extends Command {

  static flags = {
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
  }


  static args = [
    { name: 'id', description: 'the unique id of the order', required: true },
  ]


  // INIT (override)
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
    this.handleError(error)
  }


  protected handleError(error: any, flags?: any): void {
    if (CommerceLayerStatic.isApiError(error)) {
      if (error.status === 401) {
        const err = error.first()
        const res = error.code?.startsWith('RES_') ? error.code.replace('RES_', '') : ''
        this.error(chalk.bgRed(`${err.title}:  ${err.detail}`),
          { suggestions: [`Execute login with sufficient privileges to get access to the organization's resources${res ? ` of type ${chalk.bold(res)}` : ''}`] }
        )
      } else this.error(formatError(error, flags))
    } else throw error
  }


  protected printOutput(order: Order, flags: any): void {
    this.log(formatOutput(order, flags))
  }


  protected successMessage(resource: string, action: string, id: string) {
    this.log(`\nAction ${chalk.italic.cyanBright(action)} executed without errors on ${resource.replace(/_/g, ' ')} ${chalk.yellowBright(id)}\n`)
  }

}



export { flags }
