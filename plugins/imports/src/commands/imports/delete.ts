import { clColor } from '@commercelayer/cli-core'
import Command from '../../base'
import ImportsDetails from './details'



export default class ImportsDelete extends Command {

	static description = 'delete an existing import'

	static aliases = ['imp:delete']

	static examples = [
		'$ commercelayer imports:delete <import-id>>',
		'$ cl imp:delete <import-id>>',
	]

	static flags = {
		...Command.flags,
	}

	static args = [
		...ImportsDetails.args,
	]


	async run() {

		const { args, flags } = await this.parse(ImportsDelete)

		const id = args.id

		const cl = this.commercelayerInit(flags)


		cl.imports.delete(id)
			.then(() => this.log(`\n${clColor.msg.success('Successfully')} deleted import with id ${clColor.api.id(id)}\n`))
			.catch(error => this.handleError(error, flags))

	}

}
