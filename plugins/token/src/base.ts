import { Command, Flags } from '@oclif/core'
import { AccessTokenInfo, clColor, clConfig, clOutput, clUpdate} from '@commercelayer/cli-core'
import { AuthScope } from '@commercelayer/js-auth'
import { CLIError } from '@oclif/core/lib/errors'


const pkg = require('../package.json')


export default abstract class extends Command {

  // INIT (override)
  async init() {
    clUpdate.checkUpdate(pkg)
    return super.init()
  }



  protected printAccessTokenInfo(data: AccessTokenInfo): string {

    this.log(`\n${clColor.style.title('-= Access token info =-')}\n`)
    const tokenData = clOutput.printObject(data)
    this.log(tokenData)
    this.log()

    const exp = new Date((data.exp || 0) * 1000)
    const expMsg = (exp.getTime() < Date.now()) ? `\t ${clColor.msg.warning.underline('Token expired!')}` : ''
    // \u23F0 \u23F1  \u23F2  \u23F3
    this.log(clColor.blueBright('\u23F1  This access token will expire at: ') + clColor.style.datetime(exp.toLocaleString()) + expMsg)
    this.log()

    return tokenData

  }


  protected printAccessToken(accessToken?: string, expMinutes?: number) {
    if (accessToken) {
      this.log(`\n${clColor.api.token(accessToken)}\n`)
      if (expMinutes) this.warn(clColor.italic(`This access token will expire in ${clColor.style.number(expMinutes)} minutes\n`))
    }
  }


  protected checkScope(scopeFlags: string[] | undefined): AuthScope {

    const scope: string[] = []

    if (scopeFlags) {
      for (const s of scopeFlags) {

        const colonIdx = s.indexOf(':')
        const scopePrefix = s.substring(0, colonIdx)

        if ((colonIdx < 1) || (colonIdx === s.length - 1)) throw new Error(`Invalid scope: ${clColor.msg.error(s)}`)
        if (scope.includes(s)) throw new Error(`Duplicate scope: ${clColor.msg.error(s)}`)

        const scopeCheck = clConfig.application.login_scopes
        if (scopeCheck && !scopeCheck.includes(scopePrefix))
          throw new CLIError(`Invalid scope prefix: ${clColor.msg.error(scopePrefix)}`)

        scope.push(s)

      }
    }

    const _scope = (scope.length === 1) ? scope[0] : scope

    return _scope

  }

}



export { Flags }
