/* eslint-disable @typescript-eslint/no-misused-promises */
import { clColor } from '@commercelayer/cli-core'
import { Command, Flags, ux as cliux } from '@oclif/core'
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


  public async run(): Promise<any> {

    const { flags } = await this.parse(CliUpdate)

    const version = flags.version ? `@${flags.version}` : ''

    this.log()
    cliux.action.start('Updating Commerce Layer CLI')


    const cp = exec(`npm install --location=global @commercelayer/cli${version}`, async (error, _stdout, stderr) => {

      let errorMessage = ''

      if (error) errorMessage = error.message
      if (stderr && !stderr.includes('Reshimming asdf nodejs') && !stderr.includes('WARN') && !stderr.includes('warn')) errorMessage = String(stderr)

      if (errorMessage) {
        cliux.action.stop('failed')
        this.log(errorMessage)
        this.error('CLI update failed.')
      } else {
        cliux.action.stop()
        const verCmd = await this.config.findCommand('cli:version')?.load()
        await verCmd?.run()
      }

    })


    cp.on('exit', async (code, signal) => {
      if (code || signal) {
        this.log(clColor.msg.error('Unexpected error occurred'))
        this.log()
        this.log(`Code: ${code}`)
        this.log(`Signal: ${signal}`)
        this.log()
        process.exit()
      }
    })


  }

}
