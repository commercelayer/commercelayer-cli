import { Command, flags } from '@oclif/command'
import clicfg, { configParam, ConfigParams, currentApplication } from '../../config'
import chalk from 'chalk'
import { findApplication } from './add'
import { printCurrent } from './current'
import { appKeyMatch } from '../../common'



export default class ApplicationsSwitch extends Command {

  static description = 'switch applications'

  static aliases = ['app:switch']

  static flags = {
    organization: flags.string({
      char: 'o',
      description: 'organization slug',
      required: false,
    }),
    live: flags.boolean({
      description: 'live execution mode',
    }),
    mode: flags.string({
      char: 'm',
      description: 'execution mode',
      options: ['test', 'live'],
      exclusive: ['live'],
    }),
    domain: flags.string({
      char: 'd',
      description: 'api domain',
      required: false,
      hidden: true,
      dependsOn: ['organization'],
    }),
    id: flags.string({
      description: 'application id',
      exclusive: ['alias', 'live', 'mode', 'kind'],
    }),
    kind: flags.string({
      char: 'k',
      description: 'application kind',
      options: configParam(ConfigParams.applicationTypeCheck),
    }),
    alias: flags.string({
      char: 'a',
      description: 'the alias associated to the application',
      exclusive: ['id'],
      multiple: false,
    }),
  }


  async run() {

    const { flags } = this.parse(ApplicationsSwitch)

    const app = await findApplication(this.config, flags)

    if (app === undefined) this.error(`Unable to find configuration file for application${flags.alias ? ` with alias ${chalk.bold(flags.alias)}` : ''}`)
    else clicfg.set(ConfigParams.currentApplication, app)

    const stored = currentApplication()
    if (stored) this.log(`\nCurrent application: ${printCurrent(appKeyMatch(app, stored) ? app : stored)}\n`)
    else this.warn(chalk.italic('No current application defined'))

  }

}
