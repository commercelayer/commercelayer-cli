import Command from '../../base'
import RetrieveCommand from './retrieve'
import ListCommand from './list'


export default class ProvisioningGet extends Command {

  static description = 'retrieve a resource or list a set of resources'

  static aliases = ['prov:get', 'pg', 'pget']

  static examples = [
    '$ commercelayer provisioning:get roles',
    '$ commercelayer prov:get roles',
    '$ clayer prov:get roles/<roleId>',
    '$ cl prov:get roles <roleId>',
  ]

  static strict = false

  static flags = {
    ...RetrieveCommand.flags,
    ...ListCommand.flags,
  }

  static args = {
    ...RetrieveCommand.args,
  }


  async run(): Promise<any> {

    const { args } = await this.parse(ProvisioningGet)

    const { id, singleton } = this.checkResourceId(args.resource, args.id, false)

    const command = (id || singleton) ? RetrieveCommand : ListCommand
    const result = await command.run(this.argv, this.config)

    return result

  }

}
