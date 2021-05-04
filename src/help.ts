/* eslint-disable no-console */
import Help from '@oclif/plugin-help'
import Config, { Command/* , Topic */ } from '@oclif/config'
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
	showCommandHelp(command: Command): void {
		const name = command.id
        const depth = name.split(':').length
        const subTopics = this.sortedTopics.filter(t => t.name.startsWith(name + ':') && t.name.split(':').length === depth + 1)
        const subCommands = this.sortedCommands.filter(c => c.id.startsWith(name + ':') && c.id.split(':').length === depth + 1)
        const title = command.description && this.render(command.description).split('\n')[0]
        if (title)
            console.log(title[0].toUpperCase() + title.substring(1) + '\n')
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
	protected formatTopics(topics: Config.Topic[]): string {
		const fixTopics = topics.map(t => {
			t.description = _.capitalize(t.description)
			return t
		})
		return super.formatTopics(fixTopics)
	}


	// the formatting for a list of commands
	formatCommands(commands: Config.Command[]): string {
		return super.formatCommands(commands).split('\n').map(c => {
			let noSpaceCount = 0
			return c.split(' ').map(t => ((t.trim() !== '') && (++noSpaceCount === 2)) ? _.capitalize(t) : t).join(' ')
		}).join('\n')
	}

/*
	// the formatting for an individual command
	formatCommand(command: Config.Command): string {
		return super.formatCommand(command)
	}
*/

}
