import { Command, Flags, Args } from '@oclif/core'
import { type AccessTokenInfo, clColor, clConfig, clOutput, clUpdate, type AuthScope } from '@commercelayer/cli-core'
import { CLIError } from '@oclif/core/lib/errors'


const pkg: clUpdate.Package = require('../package.json')


type CommerceLayerJWT = {
  header: any,
  payload: AccessTokenInfo,
  signature: string
}



export default abstract class extends Command {

  // INIT (override)
  override async init(): Promise<any> {
    clUpdate.checkUpdate(pkg)
    return await super.init()
  }


  protected printAccessTokenInfo(data: AccessTokenInfo | CommerceLayerJWT): string {

    this.log(`\n${clColor.style.title('-= Access token info =-')}\n`)
    const tokenData = clOutput.printObject(data)
    this.log(tokenData)
    this.log()

    const flatData: any = data
    const dataExp = flatData.payload?.exp || flatData.exp

    const exp = new Date((dataExp || 0) * 1000)
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


  protected checkScope(scopeFlags: string[] | undefined): AuthScope {

    const scope: string[] = []

    if (scopeFlags) {
      for (const s of scopeFlags) {

        if (['provisioning-api', 'metrics-api'].includes(s) && (scopeFlags.length > 1)) throw new Error(`Scope ${clColor.msg.error(s)} cannot be used together with other scopes`)

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



export { Flags, Args }
