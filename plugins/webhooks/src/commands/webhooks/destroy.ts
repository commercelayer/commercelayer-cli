import Command from '../../base'
import { clColor } from '@commercelayer/cli-core'


export default class WebhooksDestroy extends Command {

	static description = 'destroy an existing webhook'

	static aliases = ['webhooks:delete', 'wh:delete', 'wh:destroy' ]

	static examples = [
		'$ commercelayer webhooks:destroy <webhook-id>>',
		'$ cl wh:destroy <webhook-id>>',
	]

	static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

		const { args, flags } = await this.parse(WebhooksDestroy)

		const id = args.id

		const cl = this.commercelayerInit(flags)

		cl.webhooks.delete(id)
			.then(() => this.log(`\n${clColor.msg.success.greenBright('Successfully')} destroyed webhook with id ${clColor.api.id(id)}\n`))
			.catch(error => this.handleError(error, flags, id))

	}

}
