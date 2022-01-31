import Command, { Flags } from '../../base'
import chalk from 'chalk'
import clicfg, { configFileExists, readConfigFile, tokenFileExists, readTokenFile, deleteConfigFile, deleteTokenFile, ConfigParams, currentApplication } from '../../config'
import { clApplication, clToken } from '@commercelayer/cli-core'
import cliux from 'cli-ux'


export default class ApplicationsLogout extends Command {

  static description = 'remove an application from CLI local configuration'

  static aliases = ['app:logout', 'app:remove', 'applications:remove']

  static flags = {
    ...Command.flags,
    revoke: Flags.boolean({
      char: 'r',
      description: 'revoke current access token',
    }),
  }


  async run() {

    const { flags } = await this.parse(ApplicationsLogout)

    const app = this.appFilterEnabled(flags) ? await this.findApplication(flags) : currentApplication()

    if (app && configFileExists(this.config, app)) {

      this.log()
      const ok = await cliux.confirm(`>> Do you really want to remove application ${chalk.bold.yellowBright(app.name)} of ${chalk.bold.yellowBright(app.organization)} from CLI configuration? ${chalk.dim('[Yy/Nn]')}`)

      if (ok) {

        if (tokenFileExists(this.config, app)) {

          // Revoke current access token
          if (flags.revoke) {
            const configData = readConfigFile(this.config, app)
            const tokenData = readTokenFile(this.config, app)
            await clToken.revokeAccessToken(configData, tokenData.access_token)
            this.log('\nCurrent access token has been revoked')
          }

          deleteTokenFile(this.config, app)
          if (clApplication.appKeyMatch(app, currentApplication())) clicfg.delete(ConfigParams.currentApplication)

        }

        deleteConfigFile(this.config, app)

        this.log(`\n${chalk.greenBright('Successfully')} removed application ${chalk.bold(app.name)}`)

      }

      this.log()

    } else this.error('Unable to find application to logout', {
      suggestions: [`Execute command ${chalk.italic(`${this.config.bin} applications`)} to get a list of all the available active applications`],
    })

  }

}
