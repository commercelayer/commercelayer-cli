import { Command } from '@oclif/core'
import clicfg from '../../config'
import { inspect } from 'util'
import { clColor } from '@commercelayer/cli-core'


export default class ConfigShow extends Command {

  static description = 'show current CLI configuration'

  static hidden = true


  async run(): Promise<any> {

    const config: object = clicfg.all

    if (!config || (Object.keys(config).length === 0)) this.warn(clColor.italic('CLI configuration is empty'))
    else {
      this.log(`\n${clColor.style.title('-= Commerce Layer CLI configuration =-')}\n`)
      this.log(inspect(clicfg.all, false, null, true))
      this.log()
    }

  }

}
