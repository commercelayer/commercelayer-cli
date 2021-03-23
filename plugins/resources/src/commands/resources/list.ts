import {Command} from '@oclif/command'

export default class ResourcesList extends Command {
  static description = 'describe the command here'

  static aliases = ['list', 'l']

  static flags = { }

  static args = [ ]

  async run() {

    // const {args, flags} = this.parse(ResourcesList)

    this.log('hello from /Users/pierlu/Documents/GitHub/commercelayer-cli-resources/src/commands/resources/list.ts')

  }

}
