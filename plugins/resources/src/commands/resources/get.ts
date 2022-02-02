import Command from '../../base'
import RetrieveCommand from './retrieve'
import ListCommand from './list'


export default class ResourcesGet extends Command {

  static description = 'retrieve a resource or list a set of resources'

  static aliases = ['get', 'res:get']

  static examples = [
    '$ commercelayer resources:get customers',
    '$ commercelayer res:get customers',
    '$ clayer res:get customers/<customerId>',
    '$ cl get customers <customerId>',
  ]

  static strict = false

  static flags = {
    ...ListCommand.flags,
  }

  static args = [
    ...RetrieveCommand.args,
  ]


  async run() {

    const { args } = await this.parse(ResourcesGet)

    const { id, singleton } = this.checkResourceId(args.resource, args.id, false)

    const command = (id || singleton) ? RetrieveCommand : ListCommand
    const result = command.run(this.argv, this.config)

    return result

  }

}
