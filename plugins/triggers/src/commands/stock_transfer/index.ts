import Command from '../../base'
import exec from '../../exec'
import inquirer from 'inquirer'
import { clColor } from '@commercelayer/cli-core'
import { triggers } from '../../triggers/stock_transfers'


const promptAction = async (id: string): Promise<any> => {
  const answers = await inquirer.prompt([{
    type: 'list',
    name: 'trigger',
    message: `Select an action to execute on stock transfer ${clColor.api.id(id)}:`,
    choices: Object.keys(triggers).sort().map(a => {
      return { name: a, value: a }
    }),
    loop: false,
    pageSize: 10,
  }])
  return answers.trigger
}


export default class StockTransferIndex extends Command {

  static description = 'execute an action on a resource of type stock_transfers'

  static flags = {
    ...Command.flags,
  }

  static args = [
    ...Command.args,
  ]

  async run(): Promise<any> {

    const { args, flags } = await this.parse(StockTransferIndex)

    const id = args.id

    const action = await promptAction(id)

    const fields = [] as string[]

    const res = await exec('stock_transfers', id, action, flags, fields)

    this.log()
    this.printOutput(res, flags)

    this.successMessage('stock transfer', action, res.id)

    return res

  }


}
