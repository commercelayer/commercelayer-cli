import Command from '../../base'
import exec from '../../exec'
import inquirer from 'inquirer'
import chalk from 'chalk'
import { triggers } from '../../triggers/bundles'


const promptAction = async (id: string) => {
  const answers = await inquirer.prompt([{
    type: 'list',
    name: 'trigger',
    message: `Select an action to execute on bundle ${chalk.yellowBright(id)}:`,
    choices: Object.keys(triggers).sort().map(a => {
      return { name: a, value: a }
    }),
    loop: false,
    pageSize: 10,
  }])
  return answers.trigger
}


export default class BundleIndex extends Command {

  static description = 'execute an action on a resource of type bundles'

  static flags = {
    ...Command.flags,
  }

  static args = [
    ...Command.args,
  ]

  async run() {

    const { args, flags } = this.parse(BundleIndex)

    const id = args.id

    const action = await promptAction(id)

    const fields = [] as string[]

    const res = await exec('bundles', id, action, flags, fields)

    this.log()
    this.printOutput(res, flags)

    this.successMessage(action, res.id)

    return res

  }


}
