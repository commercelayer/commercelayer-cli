/* eslint-disable new-cap */
import Command from '../../base'
import ListCommand from './list'
import DetailsCommand from './details'


export default class WebhooksIndex extends Command {

	static description = 'list all the registered webhooks'

	static flags = {
		...Command.flags,
		...ListCommand.flags,
	}

	static args = [ ]

	async run() {

		const { args } = this.parse(WebhooksIndex)

		const command = args.id ? DetailsCommand : ListCommand
		const result = command.run(this.argv, this.config)

		return result

	}

}
