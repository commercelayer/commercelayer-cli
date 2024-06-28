import commercelayer, { type CommerceLayerClient, CommerceLayerStatic } from '@commercelayer/sdk'
import { Command, Flags } from '@oclif/core'
import { clColor, clOutput, clToken, clUpdate, clUtil } from '@commercelayer/cli-core'
import type { CommandError } from '@oclif/core/lib/interfaces'


const pkg: clUpdate.Package = require('../package.json')


const REQUIRED_APP_KIND = 'sales_channel'


export default abstract class extends Command {

  static flags = {
    organization: Flags.string({
      char: 'o',
      description: 'the slug of your organization',
      required: true,
      env: 'CL_CLI_ORGANIZATION',
      hidden: true
    }),
    domain: Flags.string({
      char: 'd',
      required: false,
      hidden: true,
      dependsOn: ['organization'],
      env: 'CL_CLI_DOMAIN'
    }),
    accessToken: Flags.string({
      char: 'a',
      description: 'custom access token to use instead of the one used for login',
      hidden: false,
      required: true,
      env: 'CL_CLI_ACCESS_TOKEN',
      dependsOn: ['organization']
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
    } else return super.catch(error as CommandError)
  }


  protected commercelayerInit(flags: any): CommerceLayerClient {

    const organization = flags.organization
    const domain = flags.domain
    const accessToken = flags.accessToken
    const userAgent = clUtil.userAgent(this.config)

    return commercelayer({
      organization,
      domain,
      accessToken,
      userAgent
    })

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
