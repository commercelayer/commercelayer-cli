import Command from '../../base'
import exec from '../../exec'
import inquirer from 'inquirer'
import chalk from 'chalk'
import { triggers } from '../../triggers/checkout_com_payments'


const promptAction = async (id: string) => {
  const answers = await inquirer.prompt([{
    type: 'list',
    name: 'trigger',
    message: `Select an action to execute on checkout com payment ${chalk.yellowBright(id)}:`,
    choices: Object.keys(triggers).sort().map(a => {
      return { name: a, value: a }
    }),
    loop: false,
    pageSize: 10,
  }])
  return answers.trigger
}


export default class CheckoutComPaymentIndex extends Command {

  static description = 'execute an action on a resource of type checkout_com_payments'

  static flags = {
    ...Command.flags,
  }

  static args = [
    ...Command.args,
  ]

  async run() {

    const { args, flags } = await this.parse(CheckoutComPaymentIndex)

    const id = args.id

    const action = await promptAction(id)

    const fields = [] as string[]

    const res = await exec('checkout_com_payments', id, action, flags, fields)

    this.log()
    this.printOutput(res, flags)

    this.successMessage('checkout com payment', action, res.id)

    return res

  }


}
