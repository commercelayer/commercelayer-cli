import { Command, Flags, Args } from '@oclif/core'
import { findResource } from '../../util/resources'
import axios from 'axios'
import { clColor } from '@commercelayer/cli-core'
import { apiReferenceUrl } from '../../common'
import open from 'open'


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

  static args = {
    resource: Args.string({ name: 'resource', required: true, description: 'the resource for which you want to access the online documentation' }),
  }


  async run(): Promise<void> {

    const { args, flags } = await this.parse(ResourcesDoc)

    const resource = args.resource
    const page = flags.page

    const res = findResource(resource, { singular: true })

    if (res) {
      const resourceUrl = `${apiReferenceUrl}/${res?.api}${page ? `/${page}` : ''}`
      axios.get(resourceUrl)
        .then(async () => { await open(resourceUrl) })
        .catch(() => this.warn(`No online documentation available for the resource ${clColor.msg.warning(resource)}${page ? ` (page ${clColor.cli.value(page)})` : ''}`))
    } else this.warn(`Invalid resource ${clColor.style.error(resource)}`)

  }

}
