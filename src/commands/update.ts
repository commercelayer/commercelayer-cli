import { Command, CliUx as cliux, Flags } from '@oclif/core'
import { exec } from 'child_process'


export default class Update extends Command {

  static description = 'Update Commerce Layer CLI'

  static examples = [
    '<%= config.bin %> <%= command.id %> --version=<version-or-tag>',
  ]

  static flags = {
    version: Flags.string({
      char: 'v',
      description: 'Update CLI to a specific version or tag',
      required: false,
    }),
  }


  public async run(): Promise<void> {

    const { flags } = await this.parse(Update)

    const version = flags.version ? `@${flags.version}` : ''

    this.log()
    cliux.ux.action.start('Updating Commerce Layer CLI')

    const cp = exec(`npm install -g @commercelayer/cli${version}`)

    cp.on('exit', async () => {

      cliux.ux.action.stop()

      const verCmd = await this.config.findCommand('version')?.load()
      await verCmd?.run()

      // eslint-disable-next-line no-process-exit, unicorn/no-process-exit
      process.exit()

    })

  }

}
