import { Command, CliUx, Flags } from '@oclif/core'
import { findResource } from '../../util/resources'
import axios from 'axios'
import { clColor } from '@commercelayer/cli-core'


export default class ResourcesDoc extends Command {

  static description = 'open the default browser and show the online documentation for the resource'

  static aliases = ['res:doc', 'doc']

  static examples = [
    '$ commercelayer resources:doc customers',
    '$ cl res:doc customers',
    '$ cl doc customers -p create',
  ]

  static flags = {
    page: Flags.string({
      char: 'p',
      description: 'the doc page you want to access',
      options: ['object', 'create', 'retrieve', 'list', 'update', 'delete'],
      required: false,
    }),
  }

  static args = [
    { name: 'resource', required: true, description: 'the resource for which you want to access the online documentation' },
  ]


  async run() {

    const { args, flags } = await this.parse(ResourcesDoc)

    const resource = args.resource
    const page = flags.page

    const res = findResource(resource, { singular: true })

    if (res) {
      const resourceUrl = `https://docs.commercelayer.io/developers/v/api-reference/${res?.api}${page ? `/${page}` : ''}`
      axios.get(resourceUrl).then(() => CliUx.ux.open(resourceUrl))
        .catch(() => this.warn(`No online documentation available for the resource ${clColor.msg.warning(resource)}${page ? ` (page ${clColor.cli.value(page)})` : ''}`))
    } else this.warn(`Invalid resource ${clColor.style.error(resource)}`)

  }

}
