import { clColor } from '@commercelayer/cli-core'
import { Command, Flags } from '@oclif/core'

export default class CliVersion extends Command {

  static description = 'Show installed version of Commerce Layer CLI'

  static aliases = ['version']

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    plugins: Flags.boolean({
      char: 'p',
      description: 'show version of installed plugins'
    })
  }

  public async run(): Promise<string> {

    const { flags } = await this.parse(CliVersion)

    const cliVersion = this.config.version

    this.log()
    this.log(clColor.underline(`\u00A9 ${new Date().getFullYear()} Commerce Layer`))
    this.log()
    this.log(`${this.config.name} ${clColor.cyanBright(cliVersion)}`)
    this.log()

    if (flags.plugins) {
      this.log(clColor.style.title('Installed plugins:'))
      await this.config.runCommand('plugins')
      this.log()
    }

    return cliVersion

  }

}
