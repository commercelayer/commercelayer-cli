import Command, { flags } from '../../base'

export default class ResourcesCreate extends Command {

  static description = 'create a new resource'

  static aliases = ['create', 'rc', 'res:create']

  static flags = {
    ...Command.flags,
    attribute: flags.string({
      char: 'a',
      description: 'define a resource attribute',
      multiple: true,
    }),
    relationship: flags.string({
      char: 'r',
      description: 'define a relationship with another resource',
      multiple: true,
    }),
  }

  static args = []

  async run() {

    const { flags } = this.parse(ResourcesCreate)

    this.log(JSON.stringify(flags))

  }

}
