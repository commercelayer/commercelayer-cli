import { accessTokenFlag, CLCommand, clColor, clToken, domainFlag, organizationFlag } from '@commercelayer/cli-core'
import type { ApiVersion } from '@commercelayer/sdk'
import commercelayer, { type CommerceLayerClient, CommerceLayerStatic } from '@commercelayer/sdk'
import type { Interfaces } from '@oclif/core'
import { Flags } from '@oclif/core'

type CommandError = Interfaces.CommandError


const REQUIRED_APP_KIND = 'sales_channel'


export default abstract class extends CLCommand {

  static flags = {
    organization: organizationFlag(),
    domain: domainFlag(),
    accessToken: accessTokenFlag({
      char: 'a',
      description: 'custom access token to use instead of the one used for login',
      hidden: false,
      dependsOn: ['organization'],
    }),
    open: Flags.boolean({
      description: 'open microstore URL in default browser'
    }),
    staging: Flags.boolean({
      description: 'connect to Microstore application in Staging environment',
      hidden: true,
    })
    /* ,
    link: Flags.boolean({
      char: 'l',
      description: 'generate short link'
    }),
    client_id: Flags.string({
      description: 'the application client_id',
      hidden: true,
      dependsOn: ['link'],
      env: 'CL_CLI_CLIENT_ID'
    }),
    scope: Flags.string({
      description: 'the application scope',
      hidden: true,
      dependsOn: ['link'],
      env: 'CL_CLI_SCOPE'
    }),
    name: Flags.string({
      char: 'n',
      description: 'the name of the link',
      hidden: true,
      dependsOn: ['link']
    }),
    expires: Flags.string({
      char: 'e',
      description: 'the link\'s expiration date and time',
      dependsOn: ['link']
    })
      */
  }


  async catch(error: any): Promise<any> {
    return this.handleError(error)
  }


  protected async handleError(error: any, flags?: any): Promise<any> {
    if (CommerceLayerStatic.isApiError(error)) this.handleApiError(error, { flags })
    else return super.catch(error as CommandError)
  }


  protected commercelayerInit(flags: any): CommerceLayerClient {
    return commercelayer(this.clientOptions<ApiVersion>(flags))
  }


  protected checkAcessTokenData(accessToken: string, flags?: any): boolean {

    const info = clToken.decodeAccessToken(accessToken)

    if (info === null) this.error('Invalid access token provided')
    else
    if (info.application.kind !== REQUIRED_APP_KIND) // Application
      this.error(`Invalid application kind: ${clColor.msg.error(info.application.kind)}. Only ${clColor.api.kind(REQUIRED_APP_KIND)} access token can be used to generate a microstore URL`)
    else
    if (info.organization?.slug !== flags.organization) // Organization
      this.error(`The access token provided belongs to a wrong organization: ${clColor.msg.error(info.organization?.slug)} instead of ${clColor.style.organization(flags.organization)}`)

    return true

  }

  /*
  protected checkRequiredAttribute(flags: Record<string, any>, linkName: string, defaultValue?: string): string {
    const attrib = flags[linkName] || defaultValue
    if (!attrib) this.error(`Missing required attribute: ${clColor.msg.error(linkName)}`)
    return attrib
  }
    */

}


export { Flags }
