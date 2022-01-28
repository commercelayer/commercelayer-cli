import Command from '../../base'
import exec from '../../exec'
import inquirer from 'inquirer'
import chalk from 'chalk'
import { triggers } from '../../triggers/in_stock_subscriptions'


const promptAction = async (id: string) => {
  const answers = await inquirer.prompt([{
    type: 'list',
    name: 'trigger',
    message: `Select an action to execute on in stock subscription ${chalk.yellowBright(id)}:`,
    choices: Object.keys(triggers).sort().map(a => {
      return { name: a, value: a }
    }),
    loop: false,
    pageSize: 10,
  }])
  return answers.trigger
}


export default class InStockSubscriptionIndex extends Command {

  static description = 'execute an action on a resource of type in_stock_subscriptions'

  static flags = {
    ...Command.flags,
  }

  static args = [
    ...Command.args,
  ]

  async run() {

    const { args, flags } = await this.parse(InStockSubscriptionIndex)

    const id = args.id

    const action = await promptAction(id)

    const fields = [] as string[]

    const res = await exec('in_stock_subscriptions', id, action, flags, fields)

    this.log()
    this.printOutput(res, flags)

    this.successMessage('in stock subscription', action, res.id)

    return res

  }


}
