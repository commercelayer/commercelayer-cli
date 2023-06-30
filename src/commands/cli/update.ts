/* eslint-disable @typescript-eslint/no-misused-promises */
import { clColor } from '@commercelayer/cli-core'
import { Command, Flags, ux as cliux } from '@oclif/core'
import { exec } from 'child_process'
// import { detect as detectPackageManager } from 'detect-package-manager'


export default class CliUpdate extends Command {

  static description = 'Update Commerce Layer CLI'

  static aliases = ['upgrade', 'latest']

  static examples = [
    '<%= config.bin %> <%= command.id %> --version=<version-or-tag>',
  ]

  static flags = {
    version: Flags.string({
      char: 'v',
      description: 'update CLI to a specific version or tag',
      required: false,
    })
  }


  public async run(): Promise<any> {

    const { flags } = await this.parse(CliUpdate)

    const version = flags.version ? `@${flags.version}` : ''
    // await detectPackageManager().then(pm => this.log)

    this.log()
    cliux.action.start('Updating Commerce Layer CLI')

    const cp = exec(`npm install --location=global @commercelayer/cli${version}`, async (error, stdout, stderr) => {

      const errorMessage = this.getErrorMessage(error, stdout, stderr)

      if (errorMessage) {
        cliux.action.stop('failed')
        this.log(errorMessage)
        this.error('CLI update failed.')
      } else {
        cliux.action.stop()
        await this.showCliVersion()
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


  private getErrorMessage(error: Error | null, stdout: string, stderr: string): string {
    let errorMessage = ''
    if (error) errorMessage = error.message
    if (stderr && !['Reshimming asdf nodejs', 'WARN', 'warn', 'npm'].some(str => stderr.includes(str))) errorMessage = String(stderr)
    return errorMessage
  }


  private async showCliVersion(): Promise<void> {
    try {
      const verCmd = await this.config.findCommand('cli:version')?.load()
      await verCmd?.run([]) // without [] the command uses args of command 'version' and it fails
    } catch (err) { this.log() }
  }

}
