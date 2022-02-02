import Command, { Flags } from '../../base'
import { decodeAccessToken, generateAccessToken, VALIDITY_MIN, VALIDITY_MAX, testAccessToken } from '../../token'
import { checkValidity } from '../../check'
import { clColor } from '@commercelayer/cli-core'



export default class TokenCreate extends Command {

  static description = 'create a new custom access token for the current application'

  static examples = [
    '$ commercelayer token:create -s <sharedSecret> -m 30',
    '$ cl token:create -s <sharedSecret> -m 15 --info',
  ]

  static flags = {
    ...Command.flags,
    shared: Flags.string({
      char: 's',
      description: 'organization shared secret',
      required: true,
    }),
    minutes: Flags.integer({
      char: 'm',
      description: `minutes to token expiration [${VALIDITY_MIN}, ${VALIDITY_MAX}]`,
      required: true,
    }),
    info: Flags.boolean({
      description: 'show access token info',
    }),
  }

  static args = []


  async run() {

    const { flags } = await this.parse(TokenCreate)

    this.checkValidity(flags.minutes)


    try {

      const decoded = decodeAccessToken(flags.accessToken)

      const generated = generateAccessToken(decoded, flags.shared, flags.minutes)

      if (generated) {

        if (!testAccessToken(generated, flags)) this.error('Unable to generate a valid access token with the provided input data')

        const accessToken = generated.accessToken
        const decodedAccessToken = decodeAccessToken(accessToken)
        this.log(`\nAccess token for ${clColor.api.kind(decodedAccessToken.application.kind)} application of organization ${clColor.api.slug(decodedAccessToken.organization.slug)}:`)
        this.printAccessToken(accessToken)

        if (flags.info) {
          const tokenInfo = this.printAccessTokenInfo(decodedAccessToken)
          return `${accessToken}\n${tokenInfo}`
        }
        return accessToken

      }

    } catch (error: any) {
      this.error(error.message)
    }

  }


  private checkValidity(mins: number): boolean {
    const check = checkValidity(mins)
    if (check !== true) this.error(check)
    return true
  }

}
