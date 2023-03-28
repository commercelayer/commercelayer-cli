import { Command } from '@oclif/core'
import ExportsCreate from './create'

export default class ExportsAll extends Command {

  static hidden = true

  static description = 'export all the records'

  static aliases = ['exp:all']

  static examples = [
    '$ commercelayer exports:all -t cusorderstomers -X <output-file-path>',
    '$ cl exp:all -t customers -i customer_subscriptions -w email_end=@test.org',
  ]

  static flags = {
    ...ExportsCreate.flags
  }


  public async run(): Promise<void> {

  }

}
