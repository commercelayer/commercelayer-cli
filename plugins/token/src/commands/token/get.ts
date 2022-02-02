import Command, { Flags } from '../../base'
import { AppAuth, clCommand, clColor } from '@commercelayer/cli-core'
import { decodeAccessToken, getAccessToken } from '../../token'
import { AuthScope } from '@commercelayer/js-auth'



const checkScope = (scopeFlags: string[]): AuthScope => {

  const scope: string[] = []

  if (scopeFlags) {
    for (const s of scopeFlags) {
      const colonIdx = s.indexOf(':')
      if ((colonIdx < 0) || (colonIdx === s.length - 1)) throw new Error(`Invalid scope: ${clColor.msg.error(s)}`)
      else
        if (scope.includes(s)) throw new Error(`Duplicate login scope: ${clColor.msg.error(s)}`)
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
    clientId: Flags.string({
      char: 'i',
      description: 'application client_id',
      required: true,
    }),
    clientSecret: Flags.string({
      char: 's',
      description: 'application client_secret',
      required: false,
    }),
    scope: Flags.string({
      char: 'S',
      description: 'access token scope (market, stock location)',
      required: false,
      multiple: true,
    }),
    email: Flags.string({
      char: 'e',
      description: 'customer email',
      dependsOn: ['password'],
    }),
    password: Flags.string({
      char: 'p',
      description: 'customer secret password',
      dependsOn: ['email'],
    }),
    info: Flags.boolean({
      description: 'show access token info',
    }),
  }

  static args = []


  async run() {

    const { flags } = await this.parse(TokenGet)

    if (!flags.clientSecret && !flags.scope)
      this.error(`You must provide one of the arguments ${clColor.cli.arg('clientSecret')} and ${clColor.cli.arg('scope')}`)

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
        this.log(`\nAccess token for ${clColor.api.kind(decodedAccessToken.application.kind)} application of organization ${clColor.api.slug(decodedAccessToken.organization.slug)}:`)
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
