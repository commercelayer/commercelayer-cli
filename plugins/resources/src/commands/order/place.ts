import {Command} from '@oclif/command'
import UpdateCommand from '../resources/update'
import BaseCommand from '../../base'

export default class OrderPlace extends Command {

  static description = 'place an order'

  static hidden = true

  static flags = {
    ...BaseCommand.flags,
  }

  static args = [
    { name: 'id', description: 'the id of the order to place', required: true },
  ]

  async run() {

    this.parse(OrderPlace)

    const result = UpdateCommand.run(['orders', ...this.argv, '-a=_place=true'], this.config)

    return result

  }

}
