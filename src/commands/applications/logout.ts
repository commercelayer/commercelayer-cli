import { Command, flags } from '@oclif/command'
import chalk from 'chalk'
import clicfg, { configFileExists, readConfigFile, tokenFileExists, readTokenFile, AppKey, deleteConfigFile, deleteTokenFile, ConfigParams } from '../../config'
import { execMode, appKey } from '../../common'
import cliux from 'cli-ux'
import { revokeAccessToken } from './token'


export default class ApplicationsLogout extends Command {

  static description = 'remove an application from CLI local configuration'

  static aliases = ['app:logout', 'app:remove', 'applications:remove']

  static flags = {
    organization: flags.string({
      char: 'o',
      description: 'organization slug',
      required: true,
    }),
    live: flags.boolean({
      description: 'live execution mode',
      dependsOn: ['organization'],
    }),
    domain: flags.string({
      char: 'd',
      description: 'api domain',
      required: false,
      hidden: true,
      dependsOn: ['organization'],
    }),
    revoke: flags.boolean({
      char: 'r',
      description: 'revoke current access token',
    }),
  }


  async run() {

    const { flags } = this.parse(ApplicationsLogout)

    const app: AppKey = {
      key: appKey(flags.organization, flags.domain),
      mode: execMode(flags.live),
    }

    if (configFileExists(this.config, app)) {

      const ok = await cliux.confirm(`>> Do you really want to remove this application from CLI configuration? ${chalk.dim('[Yy/Nn]')}`)
      if (ok) {

        if (tokenFileExists(this.config, app)) {

          // Revoke current access token
          if (flags.revoke) {
            const configData = readConfigFile(this.config, app)
            const tokenData = readTokenFile(this.config, app)
            await revokeAccessToken(configData, tokenData.access_token)
            this.log('\nCurrent access token has been revoked')
          }

          deleteTokenFile(this.config, app)
          clicfg.delete(ConfigParams.currentApplication)

        }

        deleteConfigFile(this.config, app)

        this.log(`\n${chalk.greenBright('Successfully')} removed ${chalk.bold(app.mode)} application ${chalk.bold(app.key)}\n`)

      }
    } else this.error(`Unable to find ${chalk.bold(app.mode)} application ${chalk.bold(app.key)}`, {
      suggestions: [`Execute command ${chalk.italic(`${this.config.bin} applications`)} to get a list of all the available active applications`],
    })

  }

}
