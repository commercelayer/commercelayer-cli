import {Command} from '@oclif/command'

export default class ResourcesDelete extends Command {
  static description = 'describe the command here'

  static aliases = ['delete', 'd']

  static flags = { }

  static args = [ ]

  async run() {

    // const {args, flags} = this.parse(ResourcesDelete)

    this.log('hello  from /Users/pierlu/Documents/GitHub/commercelayer-cli-resources/src/commands/resources/delete.ts')

  }

}
