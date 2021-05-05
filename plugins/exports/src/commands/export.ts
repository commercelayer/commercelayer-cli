import { Command, flags } from '@oclif/command'

export default class Export extends Command {

  static description = 'describe the command here'

  static flags = {
    // help: flags.help({ char: 'h' }),
    
  }

  static args = []

  async run() {

    const { args, flags } = this.parse(Export)


  }

}
