import { clColor } from '@commercelayer/cli-core'
import { Command } from '@oclif/core'

export default class Version extends Command {

  static description = 'Show installed version of Commerce Layer CLI'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  public async run(): Promise<string> {

    const cliVersion = this.config.version

    this.log()
    this.log(clColor.underline(`\u00A9 ${new Date().getFullYear()} Commerce Layer`))
    this.log()
    this.log(`${this.config.name} ${clColor.cyanBright(cliVersion)}`)
    this.log()

    return cliVersion

  }

}
