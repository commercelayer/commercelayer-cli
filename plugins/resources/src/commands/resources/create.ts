import Command from '../../base'

export default class ResourcesCreate extends Command {
  static description = 'describe the command here'

  static aliases = ['create', 'rc']

  static flags = {
    ...Command.flags,
  }

  static args = []

  async run() {

    const {flags} = this.parse(ResourcesCreate)

   this.log(JSON.stringify(flags))

  }

}
