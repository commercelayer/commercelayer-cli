import Command from '../../base'
import { triggers } from '../../triggers/links'
import { type Link } from '@commercelayer/sdk'


const TRIGGER = 'enable'


export default class LinkEnable extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(LinkEnable)

		const res = await this.executeAction<Link>('links', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('link', TRIGGER, res.id)

    return res

	}

}
