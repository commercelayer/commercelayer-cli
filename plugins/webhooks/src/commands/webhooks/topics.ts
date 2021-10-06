import { Command } from '@oclif/command'
import cliux from 'cli-ux'


export default class WebhooksTopics extends Command {

  static description = 'show online documentation for supported events'


  async run() {

    await cliux.open('https://docs.commercelayer.io/api/real-time-webhooks#supported-events')

  }

}
