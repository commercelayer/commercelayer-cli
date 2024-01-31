import type { CommerceLayerProvisioningClient } from '@commercelayer/provisioning-sdk'
import Command, { Args, BaseCommand, Flags } from '../../base'
import { clColor } from '@commercelayer/cli-core'


export default class ProvisioningExec extends BaseCommand {
  
  static description = 'execute an action on a resource'

  static aliases = ['prov:exec', 'pe', 'pexec']

  static examples = [
    '$ commercelayer provisioning:exec organizations <organizationId> transfer_ownership',
    '$ cl prov:exec memberships <membershipId> resend'
  ]


  static flags = {
    attribute: Flags.string({
      char: 'a',
      description: 'define a resource attribute',
      multiple: true,
    })
  }


  static args = {
    ...Command.args,
    id: Args.string({ name: 'id', description: 'id of the resource on which to execute the action', required: false }),
    action: Args.string({ name: 'action', description: 'action to execute on resource', required: false })
  }


  public async run(): Promise<void> {

    const { args, flags } = await this.parse(ProvisioningExec)
    const action = args.action
    if (!action) this.error('Missing action name')

    const { res, id } = this.checkResourceId(args.resource, args.id)

		const resource = this.checkResource(res, { singular: true })

    const clp = this.initCommerceLayer(flags)

    try {

      const resSdk: any = clp[resource.api as keyof CommerceLayerProvisioningClient]
			this.checkOperation(resSdk, action)

      if (resSdk[action].length > 2) {  // Base action command has two arguments: resource id and request options
        const attributes = this.attributeFlag(flags.attribute)
        await resSdk[action](id, attributes)
      } else {
        if (flags.attribute && (flags.attribute.length > 0)) this.warn(`Action ${clColor.cli.arg(action)} does not require argumemts, all the attributes will be ignored.`)
        await resSdk[action](id)
      }

    } catch (error) {
			/*
			if (isRequestInterrupted(error) && reqReader) {
				await this.showLiveDocumentation(reqReader.request, undefined, flags)
				cl.removeInterceptor('request', reqReader.id)
			} else */this.printError(error, flags, args)
		}
    
  }
  
}
