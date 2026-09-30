import { clColor } from '@commercelayer/cli-core'
import inquirer from 'inquirer'
import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/checkout_com_gateways'


const promptAction = async (id: string): Promise<string> => {
  const answers = await inquirer.prompt([{
    type: 'list',
    name: 'trigger',
    message: `Select an action to execute on checkout com gateway ${clColor.api.id(id)}:`,
    choices: Object.keys(triggers).sort().map(a => {
      return { name: a, value: a }
    }),
    loop: false,
    pageSize: 10,
  }])
  return answers.trigger
}


export default class CheckoutComGatewayIndex extends Command {

  static description = 'execute an action on a resource of type checkout_com_gateways'

  static flags = {

  }

  static args = {
    ...Command.args,
  }

  async run(): Promise<any> {

    const { args, flags } = await this.parse(CheckoutComGatewayIndex)

    const id = args.id

    const action = await promptAction(id)

    const fields = [] as string[]

    const res = await exec('checkout_com_gateways', id, action, flags, fields)

    this.log()
    this.printOutput(res, flags)

    this.successMessage('checkout com gateway', action, res.id)

    return res

  }


}
