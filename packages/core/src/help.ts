/* eslint-disable no-console */
import { CommandHelp, Help, Interfaces } from '@oclif/core'
import { capitalize } from './text'


const PRINT_TRACE = false

/*
const indent = (str: string, count = 1): string => {
	return str.replace(/^(?!\s*$)/gm, ' '.repeat(count))
}
*/


// Command formatter class
class CLICommandHelp extends CommandHelp {

	examples(examples: Interfaces.Example[] | undefined | string): string | undefined {
		if (PRINT_TRACE) console.log('---------- command.examples')
		return super.examples(examples)
	}

}



// Global help formatter
export default class CLIBaseHelp extends Help {

	async showHelp(args: string[]) {
		if (PRINT_TRACE) console.log('---------- showHelp')
		return super.showHelp(args)
	}

	// display the root help of a CLI
	async showRootHelp() {
		if (PRINT_TRACE) console.log('---------- showRootHelp')
		return super.showRootHelp()
	}

	// display help for a topic
	async showTopicHelp(topic: Interfaces.Topic) {
		if (PRINT_TRACE) console.log('---------- showTopicHelp')
		return super.showTopicHelp(topic)
	}

	// display help for a command
	async showCommandHelp(command: Interfaces.Command) {
		if (PRINT_TRACE) console.log('---------- showCommandHelp')
		const name = command.id
        const depth = name ? name.split(':').length : 1
        const subTopics = this.sortedTopics.filter(t => t.name.startsWith(name + ':') && t.name.split(':').length === depth + 1)
        const subCommands = this.sortedCommands.filter(c => c.id.startsWith(name + ':') && c.id.split(':').length === depth + 1)
        const title = command.description && this.render(command.description).split('\n')[0]
        if (title) console.log(capitalize(title) + '\n')
        console.log(this.formatCommand(command))
        console.log('')
        if (subTopics.length > 0) {
            console.log(this.formatTopics(subTopics))
            console.log('')
        }
        if (subCommands.length > 0) {
            console.log(this.formatCommands(subCommands))
            console.log('')
        }
	}

	
	// displayed for the root help
	formatRoot(): string {
		if (PRINT_TRACE) console.log('---------- formatRoot')
		return super.formatRoot()
	}


	// the formatting for an individual topic
	formatTopic(topic: Interfaces.Topic): string {
		if (PRINT_TRACE) console.log('---------- formatTopic')
		return super.formatTopic(topic)
	}

	// the formatting for a list of topics
	formatTopics(topics: Interfaces.Topic[]): string {
		if (PRINT_TRACE) console.log('---------- formatTopics')
		const fixTopics = topics.filter(t => !t.hidden).map(t => {
			t.description = capitalize(t.description)
			return t
		})
		return super.formatTopics(fixTopics)
	}


	// the formatting for a list of commands
	formatCommands(commands: Interfaces.Command[]): string {
		if (PRINT_TRACE) console.log('---------- formatCommands')
		return super.formatCommands(commands).split('\n').map((c: string) => {
			let noSpaceCount = 0
			return c.split(' ').map((t: string | undefined) => (((t || '').trim() !== '') && (++noSpaceCount === 2)) ? capitalize(t) : t).join(' ')
		}).join('\n')
	}


	// the formatting for an individual command
	formatCommand(command: Interfaces.Command): string {
		if (PRINT_TRACE) console.log('---------- formatCommand')
		return super.formatCommand(command)
	}


	getCommandHelpClass(command: Interfaces.Command) {
		if (PRINT_TRACE) console.log('---------- getCommandHelpClass')
		return new CLICommandHelp(command, this.config, this.opts)
	}

}
