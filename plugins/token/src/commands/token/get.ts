import Command, { Flags } from '../../base'
import { AppAuth, clColor } from '@commercelayer/cli-core'
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
  }

  static args = []


  async run() {

    const { flags } = await this.parse(TokenGet)

    if (!flags.clientSecret && !flags.scope)
      this.error(`You must provide one of the arguments ${clColor.cli.arg('clientSecret')} and ${clColor.cli.arg('scope')}`)

    const scope = this.checkScope(flags.scope)

    const config: AppAuth = {
      clientId: flags.clientId,
      clientSecret: flags.clientSecret,
      slug: flags.organization,
      domain: flags.domain,
      scope,
      email: flags.email,
      password: flags.password,
    }


    const token = await getAccessToken(config).catch(error => this.error(error.message))

    if (token) {

      try {

        const accessToken = token.accessToken
        const decodedAccessToken = decodeAccessToken(accessToken)
        this.log(`\nAccess token for ${clColor.api.kind(decodedAccessToken.application.kind)} application of organization ${clColor.api.slug(decodedAccessToken.organization.slug)}:`)
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
