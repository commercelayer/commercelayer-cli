import Command, { flags } from '@oclif/command'

export default abstract class extends Command {
	static flags = {
		help: flags.help({ char: 'h' }),
		organization: flags.string({
			char: 'o',
			description: 'organization slug',
			required: true,
		}),
		mode: flags.string({
			char: 'm',
			description: 'execution mode',
			options: ['test', 'live'],
			default: 'test',
		}),
	}

}

export { flags }
