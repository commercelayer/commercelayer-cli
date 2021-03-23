import {Command} from '@oclif/command'

export default class ResourcesUpdate extends Command {
  static description = 'describe the command here'

  static aliases = ['update', 'ru']

  static flags = { }

  static args = [ ]

  async run() {

    // const {args, flags} = this.parse(ResourcesUpdate)

    this.log('hello from /Users/pierlu/Documents/GitHub/commercelayer-cli-resources/src/commands/resources/update.ts')

  }

}
