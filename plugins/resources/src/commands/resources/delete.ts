import Command from '../../base'

export default class ResourcesDelete extends Command {

  static description = 'ddelete a resource'

  static aliases = ['delete', 'rd', 'res:delete']

  static flags = {
    ...Command.flags,
  }

  static args = [ ]

  async run() {

    const {flags} = this.parse(ResourcesDelete)

    this.log(JSON.stringify(flags))

  }

}
