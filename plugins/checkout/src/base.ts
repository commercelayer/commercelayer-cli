import commercelayer, { CommerceLayerClient, CommerceLayerStatic } from '@commercelayer/sdk'
import Command, { flags } from '@oclif/command'
import chalk from 'chalk'
import { output, token, update } from '@commercelayer/cli-core'


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
    update.checkUpdate(pkg)
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
      } else this.error(output.formatError(error, flags))
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

    const info = token.decodeAccessToken(accessToken)

    if (info === null) this.error('Invalid access token provided')
    else
    if (info.application.kind !== kind)
      this.error(`Invalid application kind: ${chalk.redBright(info.application.kind)}. Only ${chalk.cyanBright(kind)} access token can be used to generate a checkout URL`)

    return true

  }

}



export { flags }
