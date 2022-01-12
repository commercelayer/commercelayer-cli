import Command, { flags } from '../../base'
import { AppAuth, clCommand } from '@commercelayer/cli-core'
import chalk from 'chalk'
import { decodeAccessToken, getAccessToken } from '../../token'
import { AuthScope } from '@commercelayer/js-auth'



const checkScope = (scopeFlags: string[]): AuthScope => {

  const scope: string[] = []

  if (scopeFlags) {
    for (const s of scopeFlags) {
      const colonIdx = s.indexOf(':')
      if ((colonIdx < 0) || (colonIdx === s.length - 1)) throw new Error(`Invalid scope: ${chalk.red(s)}`)
      else
        if (scope.includes(s)) throw new Error(`Duplicate login scope: ${chalk.red(s)}`)
        else scope.push(s)
    }
  }

  return (scope.length === 1) ? scope[0] : scope

}


export default class TokenGet extends Command {

  static description = 'get a new access token'

  static examples = [
		'$ commercelayer token:get',
    '$ cl token:get --info',
	]

  static flags = {
    ...(clCommand.commandFlags<typeof Command.flags>(Command.flags, ['accessToken'])),
    clientId: flags.string({
      char: 'i',
      description: 'application client_id',
      required: true,
    }),
    clientSecret: flags.string({
      char: 's',
      description: 'application client_secret',
      required: false,
    }),
    scope: flags.string({
      char: 'S',
      description: 'access token scope (market, stock location)',
      required: false,
      multiple: true,
    }),
    email: flags.string({
      char: 'e',
      description: 'customer email',
      dependsOn: ['password'],
    }),
    password: flags.string({
      char: 'p',
      description: 'customer secret password',
      dependsOn: ['email'],
    }),
    info: flags.boolean({
      description: 'show access token info',
    }),
  }

  static args = []


  async run() {

    const { flags } = this.parse(TokenGet)

    if (!flags.clientSecret && !flags.scope)
      this.error(`You must provide one of the arguments ${chalk.italic('clientSecret')} and ${chalk.italic('scope')}`)

    const scope = checkScope(flags.scope)

    const config: AppAuth = {
      clientId: flags.clientId,
      clientSecret: flags.clientSecret,
      slug: flags.organization,
      domain: flags.domain,
      scope,
      email: flags.email,
      password: flags.password,
    }


    const token = await getAccessToken(config).catch(error => this.error(error.message))

    if (token) {

      try {

        const accessToken = token.accessToken
        const decodedAccessToken = decodeAccessToken(accessToken)
        this.log(`\nAccess token for ${chalk.bold.yellowBright(decodedAccessToken.application.kind)} application of organization ${chalk.bold.yellowBright(decodedAccessToken.organization.slug)}:`)
        this.printAccessToken(accessToken)

        if (flags.info) {
          const tokenInfo = this.printAccessTokenInfo(decodedAccessToken)
          return `${accessToken}\n${tokenInfo}`
        }

        return accessToken

      } catch (error: any) {
        this.error(error.message)
      }

    }

  }

}
