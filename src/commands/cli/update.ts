import { Command, CliUx as cliux, Flags } from '@oclif/core'
import { exec } from 'child_process'


export default class CliUpdate extends Command {

  static description = 'Update Commerce Layer CLI'

  static aliases = ['upgrade', 'latest']

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

    const { flags } = await this.parse(CliUpdate)

    const version = flags.version ? `@${flags.version}` : ''

    this.log()
    cliux.ux.action.start('Updating Commerce Layer CLI')


    const cp = exec(`npm install -g @commercelayer/cli${version}`, async (error, _stdout, stderr) => {

      let errorMessage = ''

      if (error) errorMessage = error.message
      if (stderr && !stderr.includes('Reshimming asdf nodejs')) errorMessage = String(stderr)

      if (errorMessage) {
        cliux.ux.action.stop('failed')
        this.log(errorMessage)
        this.error('CLI update failed.')
      } else {
        cliux.ux.action.stop()
        const verCmd = await this.config.findCommand('cli:version')?.load()
        await verCmd?.run()
      }

    })


    cp.on('exit', async (code, signal) => {
      if (code || signal) {
        this.log()
        this.log('Code: ' + code)
        this.log('Signal: ' + signal)
        this.log()
        // eslint-disable-next-line no-process-exit, unicorn/no-process-exit
        process.exit()
      }
    })


  }

}
