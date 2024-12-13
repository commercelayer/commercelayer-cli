import Command from '../../base'
import exec from '../../exec'
import inquirer from 'inquirer'
import { type ActionType, triggers } from '../../triggers'
import { clColor } from '@commercelayer/cli-core'


export default class OrdersIndex extends Command {

  static description = 'execute an action on an order'

  static flags = {

  }

  static args = {
    ...Command.args
  }

  async run(): Promise<any> {

    const { args, flags } = await this.parse(OrdersIndex)

    const id = args.id

    const action = await promptAction(id)

    const fields = [] as string[] // ['id', 'status', 'payment_status', 'fulfillment_status', 'customer_email']

    const res = await exec(id, action, flags, fields)

    this.log()
    this.printOutput(res, flags)

    this.successMessage(action, res.id)

    return res

  }


}


const promptAction = async (id: string): Promise<ActionType> => {
  const answers = await inquirer.prompt([{
    type: 'list',
    name: 'trigger',
    message: `Select an action to execute on order ${clColor.yellowBright(id)}:`,
    choices: Object.keys(triggers).sort().map(a => {
      return { name: a, value: a }
    }),
    loop: false,
    pageSize: 10,
  }])
  return answers.trigger
}
