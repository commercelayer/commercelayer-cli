import { Command, flags } from '@oclif/command'
import { getIntegrationToken } from '@commercelayer/js-auth'
import chalk from 'chalk'
import { AppKey, readConfigFile, writeTokenFile, configFileExists, currentOrganization, currentModeLive } from '../../config'
import { execMode, appKey } from '../../common'
import { IConfig } from '@oclif/config'
import { AuthReturnType } from '@commercelayer/js-auth/dist/typings'



export default class ApplicationsToken extends Command {

  static description = 'get new access_token from Commerce Layer'

  static flags = {
    // help: flags.help({ char: 'h' }),
    organization: flags.string({
      char: 'o',
      description: 'organization slug',
      required: true,
      default: currentOrganization(),
    }),
    live: flags.boolean({
      description: 'live execution mode',
      dependsOn: ['organization'],
      default: currentModeLive(),
    }),
    domain: flags.string({
      char: 'd',
      description: 'api domain',
      required: false,
      hidden: true,
      dependsOn: ['organization'],
    }),
    save: flags.boolean({
      char: 's',
      description: 'save access_token',
    }),
  }

  async run() {

    const { flags } = this.parse(ApplicationsToken)

    const app: AppKey = {
      key: appKey(flags.organization, flags.domain),
      mode: execMode(flags.live),
    }


    if (!configFileExists(this.config, app))
      this.error(`Unable to find ${chalk.italic.bold(app.mode)} configuration file for application ${chalk.italic.bold(app.key)}`,
        { suggestions: ['execute \'login\' command to initialize application and get the first access_token'] }
      )

    try {

      const token = await newAccessToken(this.config, app, flags.save)

      const accessToken = token?.accessToken
      this.log(`\n${accessToken}\n`)

      if (flags.save) this.log(`The new ${app.mode} access_token has been locally saved for application ${chalk.italic.bold(app.key)}`)

    } catch (error) {
      this.log(chalk.red.bold('FAILURE! ') + error.message)
    }

  }

}


const newAccessToken = async (config: IConfig, app: AppKey, save: boolean = false): Promise<AuthReturnType> => {

  const cfg = readConfigFile(config, app)
  const token = await getIntegrationToken(cfg)

  if (save) writeTokenFile(config, app, token?.data)

  return token

}

export { newAccessToken }
