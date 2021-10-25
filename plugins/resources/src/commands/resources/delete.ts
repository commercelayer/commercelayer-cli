import Command from '../../base'
import commercelayer, { CommerceLayerClient } from '@commercelayer/sdk'
import chalk from 'chalk'
import { addRequestReader, buildCommand, getLanguage, isRequestInterrupted } from '../../lang'

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

    const lang = getLanguage(flags)


    const cl = commercelayer({ organization, domain, accessToken })

    const reqReader = lang ? addRequestReader(cl) : undefined

    try {

      const resSdk: any = cl[resource.api as keyof CommerceLayerClient]
      this.checkOperation(resSdk, 'delete')

      await resSdk.delete(id)

      this.log(`\n${chalk.greenBright('Successfully')} deleted resource of type ${chalk.bold(resource.api as string)} with id ${chalk.bold(id)}\n`)


      if (lang && reqReader) {
				this.printCommand(lang, buildCommand(lang, reqReader.request))
				cl.removeInterceptor('request', reqReader.id)
			}

    } catch (error) {
			if (isRequestInterrupted(error)) {
				if (lang && reqReader) {
					this.printCommand(lang, buildCommand(lang, reqReader.request))
					cl.removeInterceptor('request', reqReader.id)
				}
			} else this.printError(error)
		}

  }

}
