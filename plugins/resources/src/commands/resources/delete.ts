import Command from '../../base'

export default class ResourcesDelete extends Command {
  static description = 'describe the command here'

  static aliases = ['delete', 'rd']

  static flags = {
    ...Command.flags,
  }

  static args = [ ]

  async run() {

    const {flags} = this.parse(ResourcesDelete)

    this.log(JSON.stringify(flags))

  }

}
