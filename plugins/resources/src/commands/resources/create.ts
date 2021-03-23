import {Command} from '@oclif/command'

export default class ResourcesCreate extends Command {
  static description = 'describe the command here'

  static aliases = ['create', 'c']

  static flags = { }

  static args = [ ]

  async run() {

   // const {args, flags} = this.parse(ResourcesCreate)

    this.log('hello from /Users/pierlu/Documents/GitHub/commercelayer-cli-resources/src/commands/resources/create.ts')

  }

}
