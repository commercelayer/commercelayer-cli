import Command from '../../base'
import chalk from 'chalk'
import CommerceLayer from '@commercelayer/sdk'


export default class WebhooksReset extends Command {

  static description = 'reset the circuit breaker associated to the webhook'

  static flags = {
		...Command.flags,
  }

	static args = [
		{ name: 'id', description: 'unique id of the webhook', required: true, hidden: false },
	]


  async run() {

    const { args, flags } = this.parse(WebhooksReset)

    const organization = flags.organization
    const accessToken = flags.accessToken
    const id = args.id

    // eslint-disable-next-line new-cap
    const cl = CommerceLayer({
      organization,
      accessToken,
    })

    cl.webhooks.update({ id, _reset_circuit: true })
      .then(() => this.log(`\nThe circuit breaker associated to the webhook ${chalk.bold(id)} has been ${chalk.greenBright('successfully')} resetted\n`))
      .catch(error => this.printError(error))

  }

}
