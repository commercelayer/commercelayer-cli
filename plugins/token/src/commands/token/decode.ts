import Command from '../../base'
import chalk from 'chalk'
import { decodeAccessToken } from '../../token'


export default class TokenDecode extends Command {

  static description = 'decode a Commerce Layer access token'

  static flags = {
    ...Command.flags,
  }

  static args = [
    { name: 'token', description: 'the access token to decode', required: false },
  ]


  async run() {

    const { args, flags } = this.parse(TokenDecode)

    const organization = flags.organization
    // const domain = flags.domain
    const accessToken = args.token || flags.accessToken

    const tokenData = decodeAccessToken(accessToken)

    if (tokenData.organization.slug !== organization) this.error(`You cannot decode an access token for an application of another organization: ${chalk.redBright(tokenData.organization.slug)}`, {
      suggestions: [`Execute ${chalk.italic('login')} or ${chalk.italic('switch')} to ${chalk.yellowBright(tokenData.organization.slug)} before trying decoding this token`],
    })


    return this.printAccessTokenInfo(tokenData)

  }

}
