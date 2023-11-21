import Command, { Flags } from '../../base'
import {type AppAuth, clColor, clConfig } from '@commercelayer/cli-core'
import { decodeAccessToken, getAccessToken } from '../../token'



export default class TokenGet extends Command {

  static description = 'get a new access token'

  static examples = [
		'$ commercelayer token:get -o <organizationSlug> -i <clientId> -s <clientSecret>',
    '$ cl token:get -o <organizationSlug> -i <clientId> -S <scope> --info',
	]

  static flags = {
    organization: Flags.string({
      char: 'o',
      description: 'the slug of your organization',
      required: false,
      exactlyOne: ['organization', 'provisioning'],
      env: 'CL_CLI_ORGANIZATION',
    }),
    domain: Flags.string({
      char: 'd',
      required: false,
      hidden: true,
      env: 'CL_CLI_DOMAIN',
    }),
    clientId: Flags.string({
      char: 'i',
      description: 'application client_id',
      required: true,
    }),
    clientSecret: Flags.string({
      char: 's',
      description: 'application client_secret',
      required: false,
      dependsOn: ['clientId'],
      exclusive: ['email', 'password']
    }),
    scope: Flags.string({
      char: 'S',
      description: 'access token scope (market, stock location)',
      required: false,
      multiple: true,
      dependsOn: ['clientId'],
    }),
    email: Flags.string({
      char: 'e',
      description: 'customer email',
      dependsOn: ['password'],
    }),
    password: Flags.string({
      char: 'p',
      description: 'customer secret password',
      dependsOn: ['email'],
    }),
    info: Flags.boolean({
      description: 'show access token info',
    }),
    provisioning: Flags.boolean({
			char: 'P',
			description: 'execute login to Provisioning API',
			required: false,
			exclusive: ['scope', 'organization', 'email', 'password', 'api'],
			dependsOn: ['clientId', 'clientSecret']
		})
    /*,
		api: Flags.string({
			char: 'A',
			description: 'the API you want to excute login for',
			required: false,
			options: ['core', 'provisioning'],
			exclusive: ['provisioning']
		})
    */
  }



  async run(): Promise<any> {

    const { flags } = await this.parse(TokenGet)

    if (!flags.clientSecret && !flags.scope)
      this.error(`You must provide one of the arguments ${clColor.cli.arg('clientSecret')} and ${clColor.cli.arg('scope')}`)

    const scope = this.checkScope(flags.scope, flags.provisioning)
		const api = /* (flags.api as ApiType) || */(flags.provisioning? 'provisioning' : 'core')
		const slug = flags.organization || clConfig.provisioning.default_subdomain

    const config: AppAuth = {
      clientId: flags.clientId,
      clientSecret: flags.clientSecret,
      slug,
      domain: flags.domain,
      scope,
      email: flags.email,
      password: flags.password,
      api
    }


    const token = await getAccessToken(config).catch(error => this.error(error.message))

    if (token) {

      try {

        const accessToken = token.accessToken
        const decodedAccessToken = decodeAccessToken(accessToken)

        let msg = `Access token for ${clColor.api.kind(decodedAccessToken.application.kind)} application`
        if (decodedAccessToken.organization) msg += ` of organization ${clColor.api.slug(decodedAccessToken.organization.slug)}`
        if (flags.provisioning) msg += ' [provisioning]'

        this.log(`\n${msg}:`)
        this.printAccessToken(accessToken)

        if (flags.info) {
          const tokenInfo = this.printAccessTokenInfo(decodedAccessToken)
          return `${accessToken}\n${tokenInfo}`
        }

        return accessToken

      } catch (error: any) {
        this.error(error.message)
      }

    }

  }

}
