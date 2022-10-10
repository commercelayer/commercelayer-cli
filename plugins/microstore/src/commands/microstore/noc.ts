import { Command } from '@oclif/core'

export default class Noc extends Command {

  static hidden = true

  static flags = { }

  async run() {

    const output = '-= NoC =-'

    this.log(output)

    return output

  }

}
