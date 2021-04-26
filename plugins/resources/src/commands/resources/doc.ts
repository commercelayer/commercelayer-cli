import { Command } from '@oclif/command'
import { findResource } from './available'
import axios from 'axios'
import open from 'open'
import chalk from 'chalk'


export default class ResourcesDoc extends Command {

  static description = 'Shows the online documentation of the resource in the browser'

  static aliases = ['res:doc', 'rdoc']

  static examples = [
    '$ commercelayer rdoc customers',
    '$ cl res:doc cusatomers',
  ]

  static flags = { }

  static args = [{ name: 'resource', required: true, description: 'the resource for wich you want to access the online documentation' }]

  async run() {

    const { args } = this.parse(ResourcesDoc)

    const resource = args.resource

    const res = findResource(resource, { singular: true })

    if (res) {
      const resourceUrl = `https://docs.commercelayer.io/api/resources/${res?.api}`
      axios.get(resourceUrl).then(() =>  open(resourceUrl)).catch(() => this.warn(`No online documentation available for the resource ${chalk.italic.red(resource)}`))
    } else this.warn(`Invalid resource ${chalk.italic.red(resource)}`)

  }

}
