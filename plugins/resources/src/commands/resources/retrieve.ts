import {Command} from '@oclif/command'

export default class ResourcesRetrieve extends Command {
  static description = 'describe the command here'

  static aliases = ['retrieve', 'r']

  static flags = { }

  static args = [ ]

  async run() {

    // const {args, flags} = this.parse(ResourcesRetrieve)

    this.log('hello from /Users/pierlu/Documents/GitHub/commercelayer-cli-resources/src/commands/resources/retrieve.ts')

  }

}
