import {Command} from '@oclif/command'
import UpdateCommand from '../resources/update'
import BaseCommand from '../../base'

export default class OrderApprove extends Command {

  static description = 'approve an order'

  static hidden = true

  static flags = {
    ...BaseCommand.flags,
  }

  static args = [
    { name: 'id', description: 'the id of the order to approve', required: true },
  ]

  async run() {

    this.parse(OrderApprove)

    const result = UpdateCommand.run(['orders', ...this.argv, '-a=_approve=true'], this.config)

    return result

  }

}
