import Command from '../../base'
import commercelayer, { CommerceLayerClient } from '@commercelayer/sdk'
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

    const resource = this.checkResource(res, { singular: true })

    const organization = flags.organization
    const domain = flags.domain
    const accessToken = flags.accessToken


    const cl = commercelayer({ organization, domain, accessToken })

    try {

      const resSdk: any = cl[resource.api as keyof CommerceLayerClient]
      this.checkOperation(resSdk, 'delete')

      await resSdk.delete(id)

      this.log(`\n${chalk.greenBright('Successfully')} deleted resource of type ${chalk.bold(resource.api as string)} with id ${chalk.bold(id)}\n`)

    } catch (error) {
      this.printError(error)
    }

  }

}
