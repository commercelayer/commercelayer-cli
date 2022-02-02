import { Command, Flags } from '@oclif/core'
import { AccessTokenInfo, clColor, clOutput, clUpdate } from '@commercelayer/cli-core'


const pkg = require('../package.json')


export default abstract class extends Command {

  static flags = {
    organization: Flags.string({
      char: 'o',
      description: 'the slug of your organization',
      required: true,
      env: 'CL_CLI_ORGANIZATION',
    }),
    domain: Flags.string({
      char: 'd',
      required: false,
      hidden: true,
      dependsOn: ['organization'],
      env: 'CL_CLI_DOMAIN',
    }),
    accessToken: Flags.string({
      hidden: true,
      required: true,
      env: 'CL_CLI_ACCESS_TOKEN',
    }),
  }


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

}



export { Flags }
