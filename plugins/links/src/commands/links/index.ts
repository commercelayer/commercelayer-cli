import { BaseCommand, Args } from '../../base'
import ListCommand from './list'
import DetailsCommand from './details'


export default class LinksIndex extends BaseCommand {

  static description = 'list all the links or the details of a single link'

  static flags = {
    ...BaseCommand.flags,
    ...ListCommand.flags,
    ...DetailsCommand.flags
  }

  static args = {
    id: Args.string({ name: 'id', description: 'unique id of the link to get a single link', required: false, hidden: false })
  }


  async run(): Promise<any> {

    const { args } = await this.parse(LinksIndex)

    let result: any
    /*
    const command = args.id ? DetailsCommand : ListCommand
    result = command.run(this.argv, this.config)
    */
    if (args.id) result = DetailsCommand.run(this.argv, this.config)
    else result = ListCommand.run(this.argv, this.config)

    return result

  }

}
