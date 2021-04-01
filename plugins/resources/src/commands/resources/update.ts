import Command from '../../base'

export default class ResourcesUpdate extends Command {

  static description = 'update a resource'

  static aliases = ['update', 'ru', 'res:update']

  static flags = {
    ...Command.flags,
  }

  static args = []

  async run() {

    const { flags } = this.parse(ResourcesUpdate)

    this.log(JSON.stringify(flags))

  }

}
