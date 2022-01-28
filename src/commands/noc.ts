import { Command, Flags} from '@oclif/core'

export default class Noc extends Command {

  static hidden = true

  static flags = {
    organization: Flags.string({
      required: false,
      hidden: true,
    }),
    accessToken: Flags.string({
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
