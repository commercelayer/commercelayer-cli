import Command from '../../base'
import RetrieveCommand from './retrieve'
import ListCommand from './list'

export default class ResourcesGet extends Command {

  static description = 'retrieve or list resources'

  static aliases = ['get', 'res:get']

  static strict = false

  static flags = {
    ...ListCommand.flags,
  }

  static args = [
    ...RetrieveCommand.args,
  ]

  async run() {

    const { args } = this.parse(ResourcesGet)

    const { id } = this.checkResourceId(args.resource, args.id, false)

    const command = id ? RetrieveCommand : ListCommand
    const result = command.run(this.argv, this.config)

    return result

  }

}
