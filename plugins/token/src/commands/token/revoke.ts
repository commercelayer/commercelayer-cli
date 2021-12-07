import Command, { flags } from '../../base'
import { decodeAccessToken, revokeAccessToken } from '../../token'
import chalk from 'chalk'


export default class TokenRevoke extends Command {

  static description = 'revoke a Commerce Layer access token'

  static flags = {
    ...Command.flags,
    clientId: flags.string({
      char: 'i',
      description: 'application client_id',
      required: true,
    }),
    clientSecret: flags.string({
      char: 's',
      description: 'application client_secret',
      required: true,
    }),
  }

  static args = [
    { name: 'token', description: 'access token to revoke', required: false },
  ]


  async run() {

    const { args, flags } = this.parse(TokenRevoke)

    const organization = flags.organization
    // const domain = flags.domain
    const accessToken = args.token || flags.accessToken

    try {

    const tokenData = decodeAccessToken(accessToken)

    if (tokenData.organization.slug !== organization) this.error(`You cannot revoke an access token for an application of another organization: ${chalk.redBright(tokenData.organization.slug)}`, {
      suggestions: [`Execute ${chalk.italic('login')} or ${chalk.italic('switch')} to ${chalk.yellowBright(tokenData.organization.slug)} before trying revoking this token`],
    })

    await revokeAccessToken({
      slug: tokenData.organization.slug,
      clientId: flags.clientId,
      clientSecret: flags.clientSecret,
    }, accessToken).then(() => {
      this.log('\nThe access token has been successfully revoked')
    })

  } catch (error: any) {
    this.error(error.message)
  }

}

}
