/* eslint-disable new-cap */
import Command from '../../base'
import ListCommand from './list'
import DetailsCommand from './details'


export default class ImportsIndex extends Command {

	static description = 'list all the created imports'

	static flags = {
		...Command.flags,
		...ListCommand.flags,
	}

	static args = [ ]

	async run() {

		const { args } = this.parse(ImportsIndex)

		const command = args.id ? DetailsCommand : ListCommand
		const result = command.run(this.argv, this.config)

		return result

	}

}
