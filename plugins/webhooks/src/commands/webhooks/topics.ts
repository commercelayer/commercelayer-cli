import { clConfig } from '@commercelayer/cli-core'
import { Command } from '@oclif/core'
import open from 'open'


export default class WebhooksTopics extends Command {

  static description = 'show online documentation for supported events'

  static aliases = ['wh:topics']

  static examples = [
		'$ commercelayer webhooks:topics',
		'$ cl wh:topics',
	]


  async run(): Promise<any> {

    await open(clConfig.doc.webhooks_events)

  }

}
