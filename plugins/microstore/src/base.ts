import commercelayer, { type CommerceLayerClient, CommerceLayerStatic } from '@commercelayer/sdk'
import { Command, Flags } from '@oclif/core'
import { clColor, clOutput, clToken, clUpdate } from '@commercelayer/cli-core'


const pkg = require('../package.json')


const REQUIRED_APP_KIND = 'sales_channel'


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
      hidden: false,
      required: true,
      env: 'CL_CLI_ACCESS_TOKEN',
      dependsOn: ['organization']
    }),
    open: Flags.boolean({
      description: 'open microstore URL in default browser',
    }),
  }


  // INIT (override)
  async init(): Promise<any> {
    clUpdate.checkUpdate(pkg)
    return super.init()
  }


  async catch(error: any): Promise<any> {
    return this.handleError(error)
  }


  protected async handleError(error: any, flags?: any): Promise<any> {
    if (CommerceLayerStatic.isApiError(error)) {
      if (error.status === 401) {
        const err = error.first()
        this.error(clColor.msg.error(`${err.title}:  ${err.detail}`),
          { suggestions: ['Execute login to get access to the organization\'s resources'] },
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


  protected checkAcessTokenData(accessToken: string, flags?: any): boolean {

    const info = clToken.decodeAccessToken(accessToken)

    if (info === null) this.error('Invalid access token provided')
    else
    if (info.application.kind !== REQUIRED_APP_KIND) // Application
      this.error(`Invalid application kind: ${clColor.msg.error(info.application.kind)}. Only ${clColor.api.kind(REQUIRED_APP_KIND)} access token can be used to generate a microstore URL`)
    else
    if (info.organization.slug !== flags.organization) // Organization
      this.error(`The access token provided belongs to a wrong organization: ${clColor.msg.error(info.organization.slug)} instead of ${clColor.style.organization(flags.organization)}`)

    return true

  }

}



export { Flags }
