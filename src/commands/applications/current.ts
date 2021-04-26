import { Command, flags } from '@oclif/command'
import chalk from 'chalk'
import clicfg, { ConfigParams, configFileExists, AppKey, readConfigFile } from '../../config'
import { execMode, appKey } from '../../common'
import { inspect } from 'util'


export default class ApplicationsCurrent extends Command {

  static description = 'Set or show the current CLI application'

  static aliases = ['app:current']

  static examples = [
    'commercelayer applications:current',
    'commercelayer app:current -o organizationSlug --live',
  ]

  static flags = {
    // help: flags.help({ char: 'h' }),
    organization: flags.string({
      char: 'o',
      description: 'organization slug',
      required: false,
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
      dependsOn: ['organizarion'],
    }),
    info: flags.boolean({
      hidden: true,
      exclusive: ['organization', 'live'],
    }),
  }

  async run() {

    const { flags } = this.parse(ApplicationsCurrent)

    if (flags.organization) {
      const app: AppKey = {
        key: appKey(flags.organization, flags.domain),
        mode: execMode(flags.live),
      }

      if (configFileExists(this.config, app)) clicfg.set(ConfigParams.currentApplication, { key: app.key, mode: app.mode })
      else this.log(`${chalk.red('ERROR:')} Unable to find ${chalk.italic.bold(app.mode)} configuration file for application ${chalk.italic.bold(app.key)}`)

    }

    const stored = clicfg.get(ConfigParams.currentApplication)
    if (stored) {
      const current = `${stored.key}.${stored.mode}` || 'none'
      const color = (current === 'none') ? chalk.italic.gray : chalk.bold.yellow
      this.log(`\nCurrent application: ${color(current)}\n`)
    } else this.warn(chalk.italic('No current application defined'))

    if (flags.info) {
      const info = readConfigFile(this.config, stored)
      this.log(chalk.blueBright('-= Application Info =-'))
      // this.log(JSON.stringify(info, null, 4))
      this.log(inspect(info, false, null, true))
    }

  }

}
