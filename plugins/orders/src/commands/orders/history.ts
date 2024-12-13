import { clColor, clConfig, clOutput } from '@commercelayer/cli-core'
import Command, { Flags } from '../../base'
import { commercelayerInit } from '../../init'
import type { QueryPageSize, QuerySort, Version } from '@commercelayer/sdk'
import inquirer from 'inquirer'
import * as cliux from '@commercelayer/cli-ux'
import { checkOrder } from '../../exec'


const VERSIONS_TO_SHOW = clConfig.api.page_max_size as QueryPageSize


type VersionChoice = {
  value: string,
  name: string,
  short?: string
}



export default class OrdersIndex extends Command {

  static description = 'show history of specific order'

  static flags = {
    status: Flags.boolean({
      char: 'S',
      description: 'show only status changes'
    })
  }

  static args = {
    ...Command.args
  }



  async run(): Promise<any> {

    const { args, flags } = await this.parse(OrdersIndex)

    const id = args.id

    const cl = commercelayerInit(flags, this.config)

    console.log()
    cliux.action.start(`Fetching latest ${VERSIONS_TO_SHOW} versions of order ${clColor.yellowBright(id)}`)

    await checkOrder(cl, id)

    const filters = { resource_type_eq: 'orders', resource_id_eq: id }
    const pageSize = VERSIONS_TO_SHOW
    const sort: QuerySort<Version> = ['-updated_at']
    const versions = await cl.versions.list({ filters, pageSize, sort })
    // If the versions page is full and the user wants to show only status changes, retrieve page 2 too
    if (flags.status && (versions.length === VERSIONS_TO_SHOW)) {
      const page2 = await cl.versions.list({ filters, pageSize, sort, pageNumber: 2 })
      versions.push(...page2)
    }
    cliux.action.stop()

    if (versions.length === 0) {
      this.log(clColor.dim.italic('\nNo versions found\n'))
      this.exit()
    }

    do {

      console.log()
      const versionId = await this.showHistory(id, versions, flags.status)

      const version = versions.find(v => v.id === versionId)

      console.clear()
      console.log()
      console.log(clOutput.printObject(version))

      console.log()
      const k = await cliux.anykey(`Press any key to return to versions history or ${clColor.yellowBright('q')} to exit`)
      if (k !== 'q') console.clear()

    } while (true)

  }


  private timestamp(version: Version): string {
    return version.updated_at.substring(0, 19).replace('T', ' ')
  }


  private author(version: Version): string {
    let author: string = ''
    const who = version.who
    if (who && (Object.keys(who).length > 0)) {
      if (who.worker) author = `Worker: ${who.worker.type}`
      else
      if (who.owner) author = `User: ${who.owner.email}`
      else
      if (who.application) author = `Application: ${who.application.kind}`
    }
    return author
  }


  private fields(version: Version): string[] {
    return version.changes ? Object.keys(version.changes) : []
  }


  private changeChoice(version: Version): VersionChoice {
    const timestamp = this.timestamp(version)
    const fields = this.fields(version)
    const author = this.author(version)
    return {
      value: version.id,
      name: `${timestamp}  ${fields.join(', ')}${author? `  ${clColor.dim(`[${author}]`)}` : ''}`,
      short: timestamp
    }
  }


  private changeChoiceStatus(version: Version): VersionChoice {
    const timestamp = this.timestamp(version)
    const statusFields = this.fields(version).filter(k => k.endsWith('status'))
    const status = []
    if (statusFields.length > 0) {
      for (const sf of statusFields) {
        const change = version.changes? version.changes[sf] : []
        if (change.length === 2) status.push(`${sf}: ${clColor.italic(change[0])} \u2500\u2500\u25b6 ${clColor.italic(change[1])}`)
      }
    }
    const author = this.author(version)
    return {
      value: version.id,
      name: `${timestamp}  ${status.join(', ')}${author? `  ${clColor.dim(`[${author}]`)}` : ''}`,
      short: timestamp
    }
  }


  private async showHistory(orderId: string, versions: Version[], status?: boolean): Promise<string> {
    let filteredVersions = versions.filter(v => (v.changes && (Object.keys(v.changes).length > 0)))
    if (status) {
      filteredVersions = filteredVersions.filter(v => Object.keys(v.changes || {}).some(k => k.endsWith('status')))
      filteredVersions.splice(VERSIONS_TO_SHOW)
    }
    const answers = await inquirer.prompt([{
      type: 'list',
      name: 'version',
      message: `Versions history for order ${clColor.yellowBright(orderId)}${status? ` (${clColor.cyanBright('status only')})` : ''}:`,
      choices: filteredVersions.map(v => status? this.changeChoiceStatus(v) : this.changeChoice(v)),
      loop: false,
      pageSize: VERSIONS_TO_SHOW
    }])
    return answers.version
  }

}
