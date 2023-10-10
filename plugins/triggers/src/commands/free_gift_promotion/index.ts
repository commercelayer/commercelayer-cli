import Command from '../../base'
import exec from '../../exec'
import inquirer from 'inquirer'
import { clColor } from '@commercelayer/cli-core'
import { triggers } from '../../triggers/free_gift_promotions'


const promptAction = async (id: string): Promise<any> => {
  const answers = await inquirer.prompt([{
    type: 'list',
    name: 'trigger',
    message: `Select an action to execute on free gift promotion ${clColor.api.id(id)}:`,
    choices: Object.keys(triggers).sort().map(a => {
      return { name: a, value: a }
    }),
    loop: false,
    pageSize: 10,
  }])
  return answers.trigger
}


export default class FreeGiftPromotionIndex extends Command {

  static description = 'execute an action on a resource of type free_gift_promotions'

  static flags = {

  }

  static args = {
    ...Command.args,
  }

  async run(): Promise<any> {

    const { args, flags } = await this.parse(FreeGiftPromotionIndex)

    const id = args.id

    const action = await promptAction(id)

    const fields = [] as string[]

    const res = await exec('free_gift_promotions', id, action, flags, fields)

    this.log()
    this.printOutput(res, flags)

    this.successMessage('free gift promotion', action, res.id)

    return res

  }


}
