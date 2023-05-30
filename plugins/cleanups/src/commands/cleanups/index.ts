import Command, { Args } from '../../base'
import ListCommand from './list'
import DetailsCommand from './details'


export default class CleanupsIndex extends Command {

	static description = 'list all the created cleanups or show details of a single cleanup'

	static flags = {
		...ListCommand.flags,
	}

	static args = {
		id: Args.string({ name: 'id', description: 'unique id of the cleanup to be retrieved', required: false, hidden: false }),
	}


	async run(): Promise<any> {

		const { args } = await this.parse(CleanupsIndex)

		const result = args.id ? DetailsCommand.run(this.argv, this.config) : ListCommand.run(this.argv, this.config)

		return result

	}

}
