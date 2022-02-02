import Command from '../../base'
import { clColor } from '@commercelayer/cli-core'


export default class WebhooksReset extends Command {

  static description = 'reset the circuit breaker associated to the webhook'

  static aliases = ['wh:reset']

  static examples = [
		'$ commercelayer webhooks:reset <webhook-id>',
		'$ cl wh:reset <webhook-id>',
	]

  static flags = {
		...Command.flags,
  }

	static args = [
		{ name: 'id', description: 'unique id of the webhook', required: true, hidden: false },
	]


  async run() {

    const { args, flags } = await this.parse(WebhooksReset)

    const id = args.id

    const cl = this.commercelayerInit(flags)

    cl.webhooks.update({ id, _reset_circuit: true })
      .then(() => this.log(`\nThe circuit breaker associated to the webhook ${clColor.api.id(id)} has been ${clColor.msg.success('successfully')} reset\n`))
      .catch(error => this.handleError(error, flags))

  }

}
