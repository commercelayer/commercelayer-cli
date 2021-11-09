import Command, { flags } from '../../base'
import { readConfigFile } from '../../config'
import chalk from 'chalk'
import { inspect } from 'util'


export default class ApplicationsInfo extends Command {

  static description = 'show application details'

  static aliases = ['app:info']

  static flags = {
    ...Command.flags,
    json: flags.boolean({
      char: 'j',
      description: 'show info in JSON format',
    }),
  }


  async run() {

    const { flags } = this.parse(ApplicationsInfo)

    const app = await this.findApplication(flags)

    if (app === undefined) this.error('Unable to find configuration file for application')
    else {

      const info = readConfigFile(this.config, app)

      this.log()
      this.log(chalk.blueBright('-= Application Info =-'))
      this.log(flags.json ? JSON.stringify(info, null, 4) : inspect(info, false, null, true))
      this.log()

      return info

    }

  }

}
