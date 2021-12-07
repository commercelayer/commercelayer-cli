import Command, { flags } from '@oclif/command'
import chalk from 'chalk'
import path from 'path'
import updateNotifier from 'update-notifier'
import { printObject } from './common'


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

    const notifier = updateNotifier({ pkg, updateCheckInterval: 1000 * 60 * 60 })

    if (notifier.update) {

      const pluginMode = path.resolve(__dirname).includes(`/@commercelayer/cli/node_modules/${pkg.name}/`)
      const command = pluginMode ? 'commercelayer plugins:update' : '{updateCommand}'

      notifier.notify({
        isGlobal: !pluginMode,
        message: `-= ${chalk.bgWhite.black.bold(` ${pkg.description} `)} =-\n\nNew version available: ${chalk.dim('{currentVersion}')} -> ${chalk.green('{latestVersion}')}\nRun ${chalk.cyanBright(command)} to update`,
      })

    }

    return super.init()

  }



  protected printAccessTokenInfo(data: any): string {

    this.log(`\n${chalk.blueBright('-= Access token info =-')}\n`)
    const tokenData = printObject(data)
    this.log(tokenData)
    this.log()

    const exp = new Date(data.exp * 1000)
    const expMsg = (exp.getTime() < Date.now()) ? `\t ${chalk.yellowBright.underline('Token expired!')}` : ''
    // \u23F0 \u23F1  \u23F2  \u23F3
    this.log(chalk.blueBright('\u23F1  This access token will expire at: ') + chalk.cyanBright(exp.toLocaleString()) + expMsg)
    this.log()

    return tokenData

  }


  protected printAccessToken(accessToken?: string, expMinutes?: number) {
    if (accessToken) {
      this.log(`\n${chalk.blueBright(accessToken)}\n`)
      if (expMinutes) {
        this.warn(chalk.italic(`this access token will expire in ${expMinutes} minutes`))
        this.log()
      }
    }
  }

}



export { flags }
