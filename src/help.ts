/* eslint-disable no-console */
import { Help, Interfaces } from '@oclif/core'
import _ from 'lodash'

/*
const indent = (str: string, count = 1): string => {
	return str.replace(/^(?!\s*$)/gm, ' '.repeat(count))
}
*/

export default class MyHelpClass extends Help {

/*
	// acts as a "router"
	// and based on the args it receives
	// calls one of showRootHelp, showTopicHelp,
	// or showCommandHelp
	showHelp(args: string[]): void {
	}
*/
/*
	// display the root help of a CLI
	showRootHelp(): void {
	}
*/
/*
	// display help for a topic
	showTopicHelp(topic: Topic): void {
	}
*/
	// display help for a command
	async showCommandHelp(command: Interfaces.Command): Promise<void> {
		const name = command.id
        const depth = name ? name.split(':').length : 1
        const subTopics = this.sortedTopics.filter(t => t.name.startsWith(name + ':') && t.name.split(':').length === depth + 1)
        const subCommands = this.sortedCommands.filter(c => c.id.startsWith(name + ':') && c.id.split(':').length === depth + 1)
        const title = command.description && this.render(command.description).split('\n')[0]
        if (title) console.log(title[0].toUpperCase() + title.substring(1) + '\n')
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

	// the default implementations of showRootHelp
	// showTopicHelp and showCommandHelp
	// will call various format methods that
	// provide the formatting for their corresponding
	// help sections;
	// these can be overwritten as well
/*
	// the formatting responsible for the header
	// displayed for the root help
	formatRoot(): string {
	}
*/
/*
	// the formatting for an individual topic
	formatTopic(topic: Config.Topic): string {
	}
*/

	// the formatting for a list of topics
	protected formatTopics(topics: Interfaces.Topic[]): string {
		const fixTopics = topics.filter(t => !t.hidden).map(t => {
			t.description = _.capitalize(t.description) + 'xxx'
			return t
		})
		return super.formatTopics(fixTopics)
	}


	// the formatting for a list of commands
	formatCommands(commands: Interfaces.Command[]): string {
		return super.formatCommands(commands).split('\n').map((c: string) => {
			let noSpaceCount = 0
			return c.split(' ').map((t: string | undefined) => (((t || '').trim() !== '') && (++noSpaceCount === 2)) ? _.capitalize(t) : t).join(' ')
		}).join('\n')
	}

/*
	// the formatting for an individual command
	formatCommand(command: Config.Command): string {
		return super.formatCommand(command)
	}
*/

}
