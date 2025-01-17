import { jwtDecode } from '@commercelayer/js-auth'
import Command, { Args, Flags } from '../../base'
import { decodeAccessToken } from '../../token'
import type { AccessTokenInfo } from '@commercelayer/cli-core'



export default class TokenDecode extends Command {

  static description = 'decode a Commerce Layer access token'

  static aliases = ['token:info']

  static examples = [
		'$ commercelayer token:decode <accessToken>',
    '$ cl token:info <accessToken> -f',
	]


  static flags = {
    full: Flags.boolean({
      char: 'f',
      description: 'show the full token info',
      default: false
    })
  }


  static args = {
    token: Args.string({ name: 'token', description: 'the access token to be decoded', required: true })
  }


  async run(): Promise<any> {

    const { args, flags } = await this.parse(TokenDecode)

    const accessToken = args.token
    const tokenData = flags.full? jwtDecode(accessToken) : decodeAccessToken(accessToken)


    return this.printAccessTokenInfo(tokenData as AccessTokenInfo)

  }

}
