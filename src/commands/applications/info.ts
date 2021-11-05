import { Command, flags } from '@oclif/command'
import { readConfigFile } from '../../config'
import chalk from 'chalk'
import { inspect } from 'util'
import { findApplication } from './add'


export default class ApplicationsInfo extends Command {

  static description = 'show application details'

  static aliases = ['app:info']

  static flags = {
    organization: flags.string({
      char: 'o',
      description: 'organization slug',
      required: false,
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
      required: true,
    }),
    json: flags.boolean({
      char: 'j',
      dependsOn: ['info'],
    }),
  }


  async run() {

    const { flags } = this.parse(ApplicationsInfo)

    const app = await findApplication(this.config, flags)

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
