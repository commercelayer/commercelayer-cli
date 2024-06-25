import { BaseCommand, Args } from '../../base'
import ListCommand from './list'
import DetailsCommand from './details'


export default class WebhooksIndex extends BaseCommand {

  static description = 'list all the registered webhooks or the details of a single webhook'

  static flags = {
    ...BaseCommand.flags,
    ...ListCommand.flags,
    ...DetailsCommand.flags
  }

  static args = {
    id: Args.string({ name: 'id', description: 'unique id of the webhook to get a single webhook', required: false, hidden: false })
  }


  async run(): Promise<any> {

    const { args } = await this.parse(WebhooksIndex)

    const command = args.id ? DetailsCommand : ListCommand
    const result = command.run(this.argv, this.config)

    return await result

  }

}
