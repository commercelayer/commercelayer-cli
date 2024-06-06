import Command from '../../base'
import exec from '../../exec'
import inquirer from 'inquirer'
import { clColor } from '@commercelayer/cli-core'
import { triggers } from '../../triggers/links'


const promptAction = async (id: string): Promise<string> => {
  const answers = await inquirer.prompt([{
    type: 'list',
    name: 'trigger',
    message: `Select an action to execute on link ${clColor.api.id(id)}:`,
    choices: Object.keys(triggers).sort().map(a => {
      return { name: a, value: a }
    }),
    loop: false,
    pageSize: 10,
  }])
  return answers.trigger
}


export default class LinkIndex extends Command {

  static description = 'execute an action on a resource of type links'

  static flags = {

  }

  static args = {
    ...Command.args,
  }

  async run(): Promise<any> {

    const { args, flags } = await this.parse(LinkIndex)

    const id = args.id

    const action = await promptAction(id)

    const fields = [] as string[]

    const res = await exec('links', id, action, flags, fields)

    this.log()
    this.printOutput(res, flags)

    this.successMessage('link', action, res.id)

    return res

  }


}
