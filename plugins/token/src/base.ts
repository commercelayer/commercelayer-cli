import Command, { flags } from '@oclif/command'
import chalk from 'chalk'
import { AccessTokenInfo, clOutput, clUpdate } from '@commercelayer/cli-core'


const pkg = require('../package.json')


export default abstract class extends Command {

  static flags = {
    organization: flags.string({
      char: 'o',
      description: 'the slug of your organization',
      required: true,
      env: 'CL_CLI_ORGANIZATION',
    }),
    domain: flags.string({
      char: 'd',
      required: false,
      hidden: true,
      dependsOn: ['organization'],
      env: 'CL_CLI_DOMAIN',
    }),
    accessToken: flags.string({
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

    this.log(`\n${chalk.blueBright('-= Access token info =-')}\n`)
    const tokenData = clOutput.printObject(data)
    this.log(tokenData)
    this.log()

    const exp = new Date((data.exp || 0) * 1000)
    const expMsg = (exp.getTime() < Date.now()) ? `\t ${chalk.yellowBright.underline('Token expired!')}` : ''
    // \u23F0 \u23F1  \u23F2  \u23F3
    this.log(chalk.blueBright('\u23F1  This access token will expire at: ') + chalk.cyanBright(exp.toLocaleString()) + expMsg)
    this.log()

    return tokenData

  }


  protected printAccessToken(accessToken?: string, expMinutes?: number) {
    if (accessToken) {
      this.log(`\n${chalk.blueBright(accessToken)}\n`)
      if (expMinutes) this.warn(chalk.italic(`This access token will expire in ${chalk.yellowBright(expMinutes)} minutes\n`))
    }
  }

}



export { flags }
