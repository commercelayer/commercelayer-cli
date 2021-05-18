import { Command, flags } from '@oclif/command'
import chalk from 'chalk'
import { configFileExists, tokenFileExists, AppKey, deleteConfigFile, deleteTokenFile } from '../../config'
import { execMode, appKey } from '../../common'
import cliux from 'cli-ux'


export default class ApplicationsLogout extends Command {

  static description = 'remove an application from CLI local configuration'

  static aliases = ['app:logout', 'app:remove', 'applications:remove']

  static flags = {
    // help: flags.help({ char: 'h' }),
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
        deleteConfigFile(this.config, app)
        if (tokenFileExists(this.config, app)) deleteTokenFile(this.config, app)
        this.log(`\n${chalk.greenBright('Successfully')} removed ${chalk.bold(app.mode)} application ${chalk.bold(app.key)}\n`)
      }
    } else this.error(`Unable to find ${chalk.bold(app.mode)} application ${chalk.bold(app.key)}`, {
      suggestions: [`Execute command ${chalk.italic(`${this.config.bin} applications`)} to get a list of all the available active applications`],
    })

  }

}
