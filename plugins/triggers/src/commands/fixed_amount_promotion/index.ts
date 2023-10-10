import Command from '../../base'
import exec from '../../exec'
import inquirer from 'inquirer'
import { clColor } from '@commercelayer/cli-core'
import { triggers } from '../../triggers/fixed_amount_promotions'


const promptAction = async (id: string): Promise<any> => {
  const answers = await inquirer.prompt([{
    type: 'list',
    name: 'trigger',
    message: `Select an action to execute on fixed amount promotion ${clColor.api.id(id)}:`,
    choices: Object.keys(triggers).sort().map(a => {
      return { name: a, value: a }
    }),
    loop: false,
    pageSize: 10,
  }])
  return answers.trigger
}


export default class FixedAmountPromotionIndex extends Command {

  static description = 'execute an action on a resource of type fixed_amount_promotions'

  static flags = {

  }

  static args = {
    ...Command.args,
  }

  async run(): Promise<any> {

    const { args, flags } = await this.parse(FixedAmountPromotionIndex)

    const id = args.id

    const action = await promptAction(id)

    const fields = [] as string[]

    const res = await exec('fixed_amount_promotions', id, action, flags, fields)

    this.log()
    this.printOutput(res, flags)

    this.successMessage('fixed amount promotion', action, res.id)

    return res

  }


}
