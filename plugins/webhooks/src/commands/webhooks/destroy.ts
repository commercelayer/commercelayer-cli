import Command from '../../base'
import chalk from 'chalk'
import CommerceLayer from '@commercelayer/sdk'
import WebhooksDetails from './details'


export default class WebhooksDestroy extends Command {

  static description = 'destroy an existing webhook'

  static aliases = ['webhooks:delete', 'wh:delete', 'wh:destroy']

  static examples = [
		'$ commercelayer webhooks:destroy <webhook-id>>',
		'$ cl wh:destroy <webhook-id>>',
	]

  static flags = {
		...Command.flags,
	}

	static args = [
		...WebhooksDetails.args,
	]


  async run() {

    const { args, flags } = this.parse(WebhooksDestroy)

    const organization = flags.organization
    const accessToken = flags.accessToken
    const id = args.id

    // eslint-disable-next-line new-cap
    const cl = CommerceLayer({
      organization,
      accessToken,
    })


    cl.webhooks.delete(id)
      .then(() => this.log(`\n${chalk.greenBright('Successfully')} destroyed webhook with id ${chalk.bold(id)}\n`))
      .catch(error => this.printError(error))

  }

}
