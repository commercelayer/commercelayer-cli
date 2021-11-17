import Command from '../../base'
import exec from '../../exec'
import inquirer from 'inquirer'
import chalk from 'chalk'
import { triggers } from '../../triggers/##__RESOURCE_TYPE__##'


const promptAction = async (id: string) => {
  const answers = await inquirer.prompt([{
    type: 'list',
    name: 'trigger',
    message: `Select an action to execute on ##__RESOURCE_NAME__## ${chalk.yellowBright(id)}:`,
    choices: Object.keys(triggers).sort().map(a => {
      return { name: a, value: a }
    }),
    loop: false,
    pageSize: 10,
  }])
  return answers.trigger
}


export default class ##__RESOURCE_CLASS__##Index extends Command {

  static description = 'execute an action on a resource of type ##__RESOURCE_TYPE__##'

  static flags = {
    ...Command.flags,
  }

  static args = [
    ...Command.args,
  ]

  async run() {

    const { args, flags } = this.parse(##__RESOURCE_CLASS__##Index)

    const id = args.id

    const action = await promptAction(id)

    const fields = [] as string[]

    const res = await exec('##__RESOURCE_TYPE__##', id, action, flags, fields)

    this.log()
    this.printOutput(res, flags)

    this.successMessage(action, res.id)

    return res

  }


}
