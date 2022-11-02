import Command from '../../base'
import { decodeAccessToken } from '../../token'


export default class TokenDecode extends Command {

  static description = 'decode a Commerce Layer access token'

  static aliases = ['token:info']

  static examples = [
		'$ commercelayer token:decode <accessToken>',
    '$ cl token:info <accessToken>',
	]


  static args = [
    { name: 'token', description: 'the access token to be decoded', required: true },
  ]


  async run(): Promise<any> {

    const { args } = await this.parse(TokenDecode)

    const accessToken = args.token
    const tokenData = decodeAccessToken(accessToken)


    return this.printAccessTokenInfo(tokenData)

  }

}
