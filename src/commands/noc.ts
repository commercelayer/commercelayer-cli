import {Command, flags} from '@oclif/command'

export default class Noc extends Command {

  static hidden = true

  static flags = {
    organization: flags.string({
      required: false,
      hidden: true,
    }),
    accessToken: flags.string({
      required: false,
      hidden: true,
    }),
  }

  async run() {

    const output = '-= NoC =-'

    this.log(output)

    return output

  }

}
