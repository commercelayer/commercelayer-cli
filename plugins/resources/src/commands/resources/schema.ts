import { Command } from '@oclif/core'
import { CommerceLayerStatic } from '@commercelayer/sdk'
import { clColor } from '@commercelayer/cli-core'


export default class ResourcesSchema extends Command {

  static description = 'show the current CommerceLayer OpenAPI schema version currently used by the plugin'

  static aliases = ['res:schema', 'rs', 'schema']

  static examples = [
    'commercelayer <%= command.id %>',
  ]

  static flags = {}

  static args = []


  public async run(): Promise<void> {
    this.log(`\nCurrent schema version: ${clColor.greenBright(CommerceLayerStatic.schemaVersion)}\n`)
  }

}
