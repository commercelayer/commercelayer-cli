import Command from '../../base'
import chalk from 'chalk'
import CommerceLayer from '@commercelayer/sdk'


export default class WebhooksDetails extends Command {

  static description = 'show the details of a webhook'

  static aliases = ['webhook', 'wh:details']

  static flags = {
		...Command.flags,
	}

	static args = [
		{ name: 'id', description: 'unique id of the webhook', required: true, hidden: false },
	]

  async run() {

    const { args, flags } = this.parse(WebhooksDetails)

    const organization = flags.organization
    const accessToken = flags.accessToken
    const id = args.id

    // eslint-disable-next-line new-cap
    const cl = CommerceLayer({
      organization,
      accessToken,
    })


    try {

      const webhook = await cl.webhooks.retrieve(id)

      if (webhook) console.log(webhook)

      return webhook

    } catch (error) {
      this.printError(error)
    }
  
  }

}
