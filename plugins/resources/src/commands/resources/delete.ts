import Command from '../../base'
import { baseURL } from '../../common'
import cl, { CLayer } from '@commercelayer/js-sdk'
import chalk from 'chalk'

export default class ResourcesDelete extends Command {

  static description = 'delete an existing resource'

  static aliases = ['delete', 'rd', 'res:delete']

  static examples = [
    '$ commercelayer resources:delete customers/<customerId>',
    '$ cl delete customers <customerId>',
  ]

  static flags = {
    ...Command.flags,
  }

  static args = [
    ...Command.args,
    { name: 'id', description: 'id of the resource to retrieve', required: false },
  ]

  async run() {

    const { args, flags } = this.parse(ResourcesDelete)

    const { res, id } = this.checkResourceId(args.resource, args.id)

    const resource = this.checkResource(res, {singular: true })

    const baseUrl = baseURL(flags.organization, flags.domain)
    const accessToken = flags.accessToken


    cl.init({ accessToken, endpoint: baseUrl })

    try {

      const resSdk: any = (cl as CLayer)[resource.sdk as keyof CLayer]

      const res = await resSdk.find(id).then((r: any) => {
        return r.destroy()
      })

      // this.printOutput(res, flags)
      // if (res.valid())
      this.log(`\n${chalk.greenBright('Successfully')} deleted resource of type ${chalk.bold(resource.api as string)} with id ${chalk.bold(res.id)}\n`)

      // return res

    } catch (error) {
      this.printError(error)
    }

  }

}
