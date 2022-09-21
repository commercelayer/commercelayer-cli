import { clColor } from '@commercelayer/cli-core'
import Command, { Flags } from '../../base'
import { revokeAccessToken } from '../../token'



export default class TokenRevoke extends Command {

  static description = 'revoke a Commerce Layer access token'

  static examples = [
    '$ commercelayer token:revoke -o <organizationSlug> <accessToken>',
    '$ cl token:revoke -o <organizationSlug> <accessToken>',
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
      hidden: true,
    }),
    clientSecret: Flags.string({
      char: 's',
      description: 'application client_secret',
      required: false,
      dependsOn: ['clientId'],
      hidden: true,
    }),
    scope: Flags.string({
      char: 'S',
      description: 'access token scope',
      required: false,
      multiple: true,
      dependsOn: ['clientId'],
      hidden: true,
    }),
  }

  static args = [
    { name: 'token', description: 'access token to revoke', required: true },
  ]


  async run() {

    const { args, flags } = await this.parse(TokenRevoke)

    if (!flags.clientSecret && !flags.scope)
      this.error(`You must provide one of the arguments ${clColor.cli.flag('clientSecret')} and ${clColor.cli.flag('scope')}`)

    const organization = flags.organization
    const domain = flags.domain
    const accessToken = args.token


    try {

      const scope = this.checkScope(flags.scope)

      await revokeAccessToken({
        domain,
        slug: organization,
        clientId: flags.clientId,
        clientSecret: flags.clientSecret,
        scope,
      }, accessToken).then(() => {
        this.log('\nThe access token has been successfully revoked')
      })

    } catch (error: any) {
      this.error(error.message)
    }

  }

}
