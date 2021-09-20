import { Command } from '@oclif/command'
import UpdateCommand from '../resources/update'
import BaseCommand from '../../base'
import chalk from 'chalk'
import { validActions } from './actions'



export default class OrderIndex extends Command {

  static description = 'execute an action on the order (place, approve, capture ...'

  static hidden = false

  static flags = {
    ...BaseCommand.flags,
  }

  static args = [
    { name: 'action', description: 'the action to execute on the order', required: true },
    { name: 'id', description: 'the id of the order', required: false },
  ]


  async run() {

    const { args } = this.parse(OrderIndex)

    const action = args.action


    if (!Object.keys(validActions).includes(action)) this.error(`Invalid action ${chalk.redBright(action)}`, {
      suggestions: [`Execute ${chalk.italic('order:actions')} to get a list of all the available actions you can execute on an order`],
    })


    const result = UpdateCommand.run(['orders', ...this.argv.filter(a => (a !== action)), '-a', `_${action}=true`], this.config)

    return result

  }

}



