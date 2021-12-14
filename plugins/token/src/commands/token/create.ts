import Command, { flags } from '../../base'
import { config } from '@commercelayer/cli-core'
import chalk from 'chalk'
import { CustomToken, decodeAccessToken, generateAccessToken } from '../../token'
import commercelayer from '@commercelayer/sdk'


const VALIDITY_MIN = 2
const VALIDITY_MAX = config.api.default_token_expiration_mins



export default class TokenCreate extends Command {

  static description = 'create a new custom access token'

  static examples = [
		'$ commercelayer token:create -s <sharedSecret> -m 30',
		'$ cl token:create -s <sharedSecret> -m 15 --info',
	]

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

      const decoded = decodeAccessToken(flags.accessToken)

      const generated = generateAccessToken(decoded, flags.shared, flags.minutes)

      if (generated) {

        if (!this.testAccessToken(generated, flags)) this.error('Unable to generate a valid access token with the provided input data')

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
    if ((mins < VALIDITY_MIN) || (mins > VALIDITY_MAX))
      this.error(`Token expiration time must be between ${chalk.yellowBright(VALIDITY_MIN)} and ${chalk.yellowBright(VALIDITY_MAX)} minutes`)
    return true
  }


  private async testAccessToken(token: CustomToken, flags: any): Promise<boolean> {

    const organization = flags.organization
    const domain = flags.domain
    const accessToken = token.accessToken

    const cl = commercelayer({
      organization,
      domain,
      accessToken,
    })

    return cl.organization.retrieve()
      .then(org => org.slug === organization)
      .catch(() => false)

  }

}
