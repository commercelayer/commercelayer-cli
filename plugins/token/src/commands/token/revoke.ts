import { clColor } from '@commercelayer/cli-core'
import Command, { Flags } from '../../base'
import { decodeAccessToken, revokeAccessToken } from '../../token'



export default class TokenRevoke extends Command {

  static description = 'revoke a Commerce Layer access token'

  static examples = [
    '$ commercelayer token:revoke',
    '$ cl token:revoke -a <accessToken>',
  ]

  static flags = {
    ...Command.flags,
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
    { name: 'token', description: 'access token to revoke', required: false },
  ]


  async run() {

    const { args, flags } = await this.parse(TokenRevoke)

    if (!flags.clientSecret && !flags.scope)
      this.error(`You must provide one of the arguments ${clColor.cli.flag('clientSecret')} and ${clColor.cli.flag('scope')}`)

    const organization = flags.organization
    const domain = flags.domain
    const accessToken = args.token || flags.accessToken

    try {

      // CHeck if the access token is related to the current organization
      const tokenData = decodeAccessToken(accessToken)
      if (tokenData.organization.slug !== organization) this.error(`You cannot revoke an access token for an application of another organization: ${clColor.msg.error(tokenData.organization.slug)}`, {
        suggestions: [`Execute ${clColor.cli.command('login')} or ${clColor.cli.command('switch')} to ${clColor.api.slug(tokenData.organization.slug)} before trying revoking this token`],
      })

      // Check if the access token is related to the current application
      const tokenLogin = decodeAccessToken(flags.accessToken)
      if (tokenData.application.id !== tokenLogin.application.id) this.error('You cannot revoke an access token for an application you are not logged in', {
        suggestions: [`Execute ${clColor.cli.command('login')} or ${clColor.cli.command('switch')} to ${clColor.api.slug(tokenData.organization.slug)} before trying revoking this token`],
      })

      const scope = this.checkScope(flags.scope)

      await revokeAccessToken({
        domain,
        slug: tokenData.organization.slug,
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
