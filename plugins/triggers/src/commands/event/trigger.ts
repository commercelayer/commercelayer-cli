import Command from '../../base'
import { triggers } from '../../triggers/events'
import { type Event } from '@commercelayer/sdk'


const TRIGGER = 'trigger'


export default class EventTrigger extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(EventTrigger)

		const res = await this.executeAction<Event>('events', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('event', TRIGGER, res.id)

    return res

	}

}
