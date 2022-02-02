import { Command, CliUx as cliux } from '@oclif/core'
import { exec } from 'child_process'


export default class Update extends Command {

  static description = 'Update Commerce Layer CLI'


  public async run(): Promise<void> {

    this.log()
    cliux.ux.action.start('Updating Commerce Layer CLI')

    const cp = exec('npm install -g @commercelayer/cli')

    cp.on('exit', async () => {
      cliux.ux.action.stop()
      const verCmd = await this.config.findCommand('version')?.load()
      await verCmd?.run()
      // eslint-disable-next-line no-process-exit, unicorn/no-process-exit
      process.exit()
    })

  }

}
