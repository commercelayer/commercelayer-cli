import { Command } from '@oclif/command'
import cliux from 'cli-ux'
import chalk from 'chalk'
import apiConf from '../../api-conf'


export default class ImportsTopics extends Command {

  static description = 'show online documentation for supported resources'


  async run() {

    this.log()
    this.log(chalk.blueBright('Supported import types'))
    this.log()
    this.log(apiConf.imports_types.sort().join(' | '))
    this.log()

    await cliux.open('https://docs.commercelayer.io/api/importing-resources#supported-resources')

  }

}
