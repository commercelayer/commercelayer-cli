/* eslint-disable new-cap */
import Command, { Args } from '../../base'
import ListCommand from './list'
import DetailsCommand from './details'


export default class TagsIndex extends Command {

	static description = 'list all the created tags or show details of a single tag'

	static flags = {
		...ListCommand.flags,
	}

	static args = {
		id: Args.string({ name: 'id', description: 'unique id of the tag to be retrieved', required: false, hidden: false }),
	}


	async run(): Promise<any> {

		const { args } = await this.parse(TagsIndex)

		const result = args.id ? DetailsCommand.run(this.argv, this.config) : ListCommand.run(this.argv, this.config)

		return result

	}

}
