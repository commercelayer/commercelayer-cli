import { Command } from '@oclif/core'
import { CommerceLayerStatic } from '@commercelayer/sdk'
import { clColor } from '@commercelayer/cli-core'


export default class ResourcesSchema extends Command {

  static description = 'show the current CommerceLayer OpenAPI schema version used by the plugin'

  static aliases = ['schema', 'res:schema', 'rs']

  static examples = [
    'commercelayer schema',
    'cl res:schema'
  ]



  public async run(): Promise<void> {
    this.log(`\nCurrent schema version: ${clColor.greenBright(CommerceLayerStatic.schemaVersion)}\n`)
  }

}
