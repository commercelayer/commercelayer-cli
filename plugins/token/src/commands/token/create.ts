import Command, { flags } from '../../base'
import config from '../../api-conf'
import chalk from 'chalk'
import { decodeAccessToken, generateAccessToken } from '../../token'


const VALIDITY_MIN = 2
const VALIDITY_MAX = config.default_token_expiration_mins



export default class TokenCreate extends Command {

  static description = 'create a new custom access token'

  static flags = {
    ...Command.flags,
    shared: flags.string({
      char: 's',
      description: 'organization shared secret',
      required: true,
    }),
    minutes: flags.integer({
      char: 'm',
      description: `minutes to token expiration [${VALIDITY_MIN}, ${VALIDITY_MAX}]`,
      required: true,
    }),
    info: flags.boolean({
      description: 'show access token info',
    }),
  }

  static args = []


  async run() {

    const { flags } = this.parse(TokenCreate)

    this.checkValidity(flags.minutes)


    try {

      const generated = await generateAccessToken(flags.accessToken, flags.shared, flags.minutes)

      if (generated) {

        const accessToken = generated.accessToken
        const decodedAccessToken = decodeAccessToken(accessToken)
        this.log(`\nAccess token for ${chalk.bold.yellowBright(decodedAccessToken.application.kind)} application of organization ${chalk.bold.yellowBright(decodedAccessToken.organization.slug)}:`)
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
    if ((mins < VALIDITY_MIN) || (mins > VALIDITY_MAX)) this.error(`Token expiration time must be beyween ${VALIDITY_MIN} and ${VALIDITY_MAX} minutes`)
    return true
  }

}
