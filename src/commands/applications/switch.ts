import Command from '../../base'
import { currentApplication } from '../../config'
import chalk from 'chalk'
import { printCurrent } from './current'



export default class ApplicationsSwitch extends Command {

  static description = 'switch applications'

  static aliases = ['app:switch']

  static flags = {
    ...Command.flags,
  }


  async run() {

    const { flags } = await this.parse(ApplicationsSwitch)

    const app = await this.findApplication(flags)

    if (app === undefined) this.error(`No application found${flags.alias ? ` with alias ${chalk.bold(flags.alias)}` : ''}`)
    else currentApplication(app)

    const stored = currentApplication()
    if (stored) this.log(`\nCurrent application: ${printCurrent(stored)}\n`)
    else this.warn(chalk.italic('No current application defined'))

  }

}
