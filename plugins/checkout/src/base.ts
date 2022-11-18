import commercelayer, { CommerceLayerClient, CommerceLayerStatic } from '@commercelayer/sdk'
import { Command, Flags } from '@oclif/core'
import { clColor, clOutput, clToken, clUpdate } from '@commercelayer/cli-core'
import { CommandError, OutputFlags } from '@oclif/core/lib/interfaces'


const pkg = require('../package.json')


export default abstract class extends Command {

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
      char: 'a',
      description: 'custom access token to use instead of the one used for login',
      hidden: false,
      required: true,
      env: 'CL_CLI_ACCESS_TOKEN',
    }),
    open: Flags.boolean({
      description: 'open checkout URL in default browser',
    }),
    staging: Flags.boolean({
      description: 'connect to Checkout application in Staging environment',
    }),
  }


  // INIT (override)
  async init(): Promise<any> {
    clUpdate.checkUpdate(pkg)
    return super.init()
  }


  async catch(error: CommandError): Promise<any> {
    return this.handleError(error)
  }


  protected async handleError(error: CommandError, flags?: OutputFlags<any>): Promise<any> {
    if (CommerceLayerStatic.isApiError(error)) {
      if (error.status === 401) {
        const err = error.first()
        this.error(clColor.msg.error(`${err.title}:  ${err.detail}`),
          { suggestions: ['Execute login to get access to the organization\'s resources'] },
        )
      } else this.error(clOutput.formatError(error, flags))
    } else return super.catch(error)
  }


  protected commercelayerInit(flags: OutputFlags<any>): CommerceLayerClient {

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
      this.error(`Invalid application kind: ${clColor.msg.error(info.application.kind)}. Only ${clColor.api.kind(kind)} access token can be used to generate a checkout URL`)

    return true

  }

}



export { Flags }
