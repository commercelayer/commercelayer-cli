import Command from '../../base'

export default class ResourcesUpdate extends Command {

  static description = 'describe the command here'

  static aliases = ['update', 'ru']

  static flags = {
    ...Command.flags,
  }

  static args = [ ]

  async run() {

    const {flags} = this.parse(ResourcesUpdate)

    this.log(JSON.stringify(flags))

  }

}
