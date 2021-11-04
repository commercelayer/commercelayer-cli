import { Command } from '@oclif/command'
import { findResource } from '../../util/resources'
import axios from 'axios'
import cliux from 'cli-ux'
import chalk from 'chalk'


export default class ResourcesDoc extends Command {

  static description = 'open the default browser and show the online documentation for the resource'

  static aliases = ['res:doc']

  static examples = [
    '$ commercelayer rdoc customers',
    '$ cl res:doc cusatomers',
  ]

  static flags = {
    // help: flags.help({char: 'h'}),
  }

  static args = [
    { name: 'resource', required: true, description: 'the resource for which you want to access the online documentation' },
  ]


  async run() {

    const { args } = this.parse(ResourcesDoc)

    const resource = args.resource

    const res = findResource(resource, { singular: true })

    if (res) {
      const resourceUrl = `https://docs.commercelayer.io/api/resources/${res?.api}`
      axios.get(resourceUrl).then(() =>  cliux.open(resourceUrl)).catch(() => this.warn(`No online documentation available for the resource ${chalk.italic.redBright(resource)}`))
    } else this.warn(`Invalid resource ${chalk.italic.redBright(resource)}`)

  }

}
