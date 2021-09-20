import {Command} from '@oclif/command'
import UpdateCommand from '../resources/update'
import BaseCommand from '../../base'

export default class OrderCapture extends Command {

  static description = 'capture an order'

  static hidden = false

  static flags = {
    ...BaseCommand.flags,
  }

  static args = [
    { name: 'id', description: 'the id of the order to capture', required: true },
  ]

  async run() {

    this.parse(OrderCapture)

    const result = UpdateCommand.run(['orders', ...this.argv, '-a=_capture=true'], this.config)

    return result

  }

}
