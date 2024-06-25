import type { CommandError } from '@oclif/core/lib/interfaces'
import { BaseIdCommand } from '../../base'
import { clColor } from '@commercelayer/cli-core'


export default class WebhooksDestroy extends BaseIdCommand {

	static description = 'destroy an existing webhook'

	static aliases = ['webhooks:delete', 'wh:delete', 'wh:destroy' ]

	static examples = [
		'$ commercelayer webhooks:destroy <webhook-id>>',
		'$ cl wh:destroy <webhook-id>>'
	]


	static args = {
		...BaseIdCommand.args
  }


	async run(): Promise<any> {

		const { args, flags } = await this.parse(WebhooksDestroy)

		const id = args.id

		const cl = this.commercelayerInit(flags)

		cl.webhooks.delete(id)
			.then(() => { this.log(`\n${clColor.msg.success.greenBright('Successfully')} destroyed webhook with id ${clColor.api.id(id)}\n`) })
			.catch(error => { this.handleError(error as CommandError, flags, id) })

	}

}
