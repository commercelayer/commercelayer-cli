/* eslint-disable new-cap */
import Command, { Args } from '../../base'
import ListCommand from './list'
import DetailsCommand from './details'


export default class ImportsIndex extends Command {

  static description = 'list all the created imports or show details of a single import'

  static flags = {
    ...ListCommand.flags,
  }

  static args = {
    id: Args.string({ name: 'id', description: 'unique id of the import to be retrieved', required: false, hidden: false }),
  }


  async run(): Promise<any> {

    const { args } = await this.parse(ImportsIndex)

    const result = args.id ? DetailsCommand.run(this.argv, this.config) : ListCommand.run(this.argv, this.config)

    return result

  }

}
