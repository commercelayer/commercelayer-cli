import Command from '../../base'
import exec from '../../exec'
import { triggers } from '../../triggers/returns'


const TRIGGER = 'ship'


export default class ReturnShip extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

    const { args, flags } = await this.parse(ReturnShip)

		const res = await exec('returns', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('return', TRIGGER, res.id)

    return res

	}

}
