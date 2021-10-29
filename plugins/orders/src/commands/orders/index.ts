import Command from '../../base'
import exec from '../../exec'
import inquirer from 'inquirer'
import { validActions } from './actions'
import chalk from 'chalk'


export default class OrdersIndex extends Command {

  static description = 'execute an action on an order'

  static flags = {
    ...Command.flags,
  }

  static args = [
    ...Command.args,
  ]

  async run() {

    const { args, flags } = this.parse(OrdersIndex)

    const id = args.id

    const trigger = await promptAction(id)

    const fields = [] as string[] // ['id', 'status', 'payment_status', 'fulfillment_status', 'customer_email']

    const res = await exec(id, trigger, flags, fields)

    this.log()
    this.printOutput(res, flags)

    this.successMessage(trigger, res.id)

    return res

  }


}


const promptAction = (id: string) => {
  return inquirer.prompt([{
    type: 'list',
    name: 'trigger',
    message: `Select an action to execute on order ${chalk.yellowBright(id)}:`,
    choices: Object.keys(validActions).sort().map(a => {
      return { name: a, value: a }
    }),
  }]).then(answers => answers.trigger)
}
