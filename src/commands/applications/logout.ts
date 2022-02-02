import Command, { Flags } from '../../base'
import clicfg, { configFileExists, readConfigFile, tokenFileExists, readTokenFile, deleteConfigFile, deleteTokenFile, ConfigParams, currentApplication } from '../../config'
import { clApplication, clColor, clToken } from '@commercelayer/cli-core'
import { CliUx as cliux } from '@oclif/core'


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
      const ok = await cliux.ux.confirm(`>> Do you really want to remove application ${clColor.api.application(app.name)} of ${clColor.api.organization(app.organization)} from CLI configuration? ${clColor.dim('[Yy/Nn]')}`)

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

        this.log(`\n${clColor.msg.success('Successfully')} removed application ${clColor.api.application(app.name)}`)

      }

      this.log()

    } else this.error('Unable to find application to logout', {
      suggestions: [`Execute command ${clColor.cli.command(`${this.config.bin} applications`)} to get a list of all the available active applications`],
    })

  }

}
