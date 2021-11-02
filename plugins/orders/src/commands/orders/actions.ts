import { Command } from '@oclif/command'
import cliux from 'cli-ux'
import chalk from 'chalk'
import { triggers } from '../../triggers'

export default class OrdersActions extends Command {

  static description = 'show a list of all actions that can be executed on an order'

  static hidden: true


  async run() {

    const actionsArray = Object.values(triggers).map(t => {
      return { action: t.action, description: t.description }
    })

    this.log()
    cliux.table(actionsArray, {
        action: { header: 'ACTION', minWidth: 35, get: row => chalk.blueBright(row.action) },
        description: { header: 'DESCRIPTION', get: row => row.description },
      }, {
        printLine: this.log,
      })
    this.log()

  }
}
