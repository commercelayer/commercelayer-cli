import { clColor } from '@commercelayer/cli-core'
import Command from '../../base'
import { decodeAccessToken } from '../../token'


export default class TokenDecode extends Command {

  static description = 'decode a Commerce Layer access token'

  static aliases = ['token:info']

  static examples = [
		'$ commercelayer token:decode',
		'$ cl token:info -a <accessToken>',
	]

  static flags = {
    ...Command.flags,
  }

  static args = [
    { name: 'token', description: 'the access token to decode', required: false },
  ]


  async run() {

    const { args, flags } = await this.parse(TokenDecode)

    /*
    const organization = flags.organization
    // const domain = flags.domain
    const accessToken = args.token || flags.accessToken

    // CHeck if the access token is related to the current organization
    const tokenData = decodeAccessToken(accessToken)
    if (tokenData.organization.slug !== organization) this.error(`You cannot decode an access token for an application of another organization: ${clColor.msg.error(tokenData.organization.slug)}`, {
      suggestions: [`Execute ${clColor.cli.command('login')} or ${clColor.cli.command('switch')} to ${clColor.api.slug(tokenData.organization.slug)} before trying revoking this token`],
    })

    // Check if the access token is related to the current application
    const tokenLogin = decodeAccessToken(flags.accessToken)
    if (tokenData.application.id !== tokenLogin.application.id) this.error('You cannot decode an access token for an application you are not logged in', {
      suggestions: [`Execute ${clColor.cli.command('login')} or ${clColor.cli.command('switch')} to ${clColor.api.slug(tokenData.organization.slug)} before trying revoking this token`],
    })
    */


    return this.printAccessTokenInfo(tokenData)

  }

}
