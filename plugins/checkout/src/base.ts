import commercelayer, { CommerceLayerClient, CommerceLayerStatic } from '@commercelayer/sdk'
import { Command, Flags } from '@oclif/core'
import chalk from 'chalk'
import { clOutput, clToken, clUpdate } from '@commercelayer/cli-core'


const pkg = require('../package.json')


export default abstract class extends Command {

  static flags = {
    organization: Flags.string({
      char: 'o',
      description: 'the slug of your organization',
      required: true,
      env: 'CL_CLI_ORGANIZATION',
    }),
    domain: Flags.string({
      char: 'd',
      required: false,
      hidden: true,
      dependsOn: ['organization'],
      env: 'CL_CLI_DOMAIN',
    }),
    accessToken: Flags.string({
      char: 'a',
      hidden: false,
      required: true,
      env: 'CL_CLI_ACCESS_TOKEN',
    }),
    open: Flags.boolean({
      description: 'open checkout URL in default browser',
    }),
  }


  // INIT (override)
  async init() {
    clUpdate.checkUpdate(pkg)
    return super.init()
  }


  async catch(error: any) {
    return this.handleError(error)
  }


  protected handleError(error: any, flags?: any) {
    if (CommerceLayerStatic.isApiError(error)) {
      if (error.status === 401) {
        const err = error.first()
        this.error(chalk.bgRed(`${err.title}:  ${err.detail}`),
          { suggestions: ['Execute login to get access to the organization\'s resources'] }
        )
      } else this.error(clOutput.formatError(error, flags))
    } else return super.catch(error)
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

    const info = clToken.decodeAccessToken(accessToken)

    if (info === null) this.error('Invalid access token provided')
    else
    if (info.application.kind !== kind)
      this.error(`Invalid application kind: ${chalk.redBright(info.application.kind)}. Only ${chalk.cyanBright(kind)} access token can be used to generate a checkout URL`)

    return true

  }

}



export { Flags }
