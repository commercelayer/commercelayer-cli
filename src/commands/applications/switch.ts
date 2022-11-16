import Command from '../../base'
import { currentApplication } from '../../config'
import { printCurrent } from './current'
import { clColor } from '@commercelayer/cli-core'



export default class ApplicationsSwitch extends Command {

  static description = 'switch applications'

  static aliases = ['app:switch']

  static flags = {
    ...Command.flags,
  }


  async run(): Promise<any> {

    const { flags } = await this.parse(ApplicationsSwitch)

    const app = await this.findApplication(flags)

    if (app === undefined) this.error(`No application found${flags.alias ? ` with alias ${clColor.cli.alias(flags.alias)}` : ''}`)
    else currentApplication(app)

    const stored = currentApplication()
    if (stored) this.log(`\nCurrent application: ${printCurrent(stored)}\n`)
    else this.warn(clColor.italic('No current application defined'))

  }

}
