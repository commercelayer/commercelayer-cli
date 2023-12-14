import { Command, Flags, Args, ux } from '@oclif/core'
import { type AccessTokenInfo, clColor, clConfig, clOutput, clUpdate, type AuthScope } from '@commercelayer/cli-core'
import { CLIError } from '@oclif/core/lib/errors'
import type { Package } from '@commercelayer/cli-core/lib/cjs/update'


const pkg = require('../package.json')


export default abstract class extends Command {

  // INIT (override)
  async init(): Promise<any> {
    clUpdate.checkUpdate(pkg as Package)
    return await super.init()
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


  protected printAccessToken(accessToken?: string, expMinutes?: number): void {
    if (accessToken) {
      this.log(`\n${clColor.api.token(accessToken)}\n`)
      if (expMinutes) this.warn(clColor.italic(`This access token will expire in ${clColor.style.number(expMinutes)} minutes\n`))
    }
  }


  protected checkScope(scopeFlags: string[] | undefined, provisioning?: boolean): AuthScope {

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
    else if (provisioning) scope.push(clConfig.provisioning.scope)

    const _scope = (scope.length === 1) ? scope[0] : scope

    return _scope

  }

}



export { Flags, Args, ux as cliux }
