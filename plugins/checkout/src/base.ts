import { accessTokenFlag, CLCommand, clColor, clToken } from '@commercelayer/cli-core'
import commercelayer, { type CommerceLayerClient, CommerceLayerStatic } from '@commercelayer/sdk'
import type { Interfaces } from '@oclif/core'
import { Args, Flags } from '@oclif/core'

type CommandError = Interfaces.CommandError


const REQUIRED_APP_KIND = 'sales_channel'


export default abstract class extends CLCommand {

  static baseFlags = {
    ...CLCommand.baseFlags,
    accessToken: accessTokenFlag({
      char: 'a',
      description: 'custom access token to use instead of the one used for login',
      hidden: false,
      dependsOn: ['organization'],
    }),
    open: Flags.boolean({
      description: 'open checkout URL in default browser'
    })
  }


  async catch(error: CommandError): Promise<any> {
    return this.handleError(error)
  }


  protected async handleError(error: CommandError, flags?: any): Promise<any> {
    if (CommerceLayerStatic.isApiError(error)) this.handleApiError(error, { flags })
    else return super.catch(error)
  }


  protected commercelayerInit(flags: any): CommerceLayerClient {
    return commercelayer(this.clientOptions(flags))
  }


  protected checkAcessTokenData(accessToken: string, flags?: any): boolean {

    const info = clToken.decodeAccessToken(accessToken)

    if (info === null) this.error('Invalid access token provided')
    else
    if (info.application.kind !== REQUIRED_APP_KIND) // Application
      this.error(`Invalid application kind: ${clColor.msg.error(info.application.kind)}. Only ${clColor.api.kind(REQUIRED_APP_KIND)} access token can be used to generate a checkout URL`)
    else
    if (info.organization?.slug !== flags.organization) // Organization
      this.error(`The access token provided belongs to a wrong organization: ${clColor.msg.error(info.organization?.slug)} instead of ${clColor.style.organization(flags.organization)}`)

    return true

  }

}


export { Args, Flags }
