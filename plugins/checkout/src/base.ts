import commercelayer, { CommerceLayerClient, CommerceLayerStatic } from '@commercelayer/sdk'
import Command, { flags } from '@oclif/command'
import chalk from 'chalk'
import path from 'path'
import updateNotifier from 'update-notifier'
import { formatError } from './common'
import { decodeAccessToken } from './token'


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
      char: 'a',
      hidden: false,
      required: true,
      env: 'CL_CLI_ACCESS_TOKEN',
    }),
    open: flags.boolean({
      description: 'open checkout URL in default browser',
    }),
  }


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
        this.error(chalk.bgRed(`${err.title}:  ${err.detail}`),
          { suggestions: ['Execute login to get access to the organization\'s resources'] }
        )
      } else this.error(formatError(error, flags))
    } else throw error
  }


  protected commercelayerInit(flags: any): CommerceLayerClient {

    const organization = flags.organization
    const domain = flags.domain
    const accessToken = flags.accessToken

    return commercelayer({
      organization,
      domain,
      accessToken,
    })

  }


  protected checkApplication(accessToken: string, kind: string): boolean {

    const info = decodeAccessToken(accessToken)

    if (info === null) this.error('Invalid access token provided')
    else
    if (info.application.kind !== kind)
      this.error(`Invalid application kind: ${chalk.redBright(info.application.kind)}. Only ${chalk.cyanBright(kind)} access token can be used to generate a checkout URL`)

    return true

  }

}



export { flags }
