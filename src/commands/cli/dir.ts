import { clColor } from '@commercelayer/cli-core'
import { Command } from '@oclif/core'
import { inspect } from 'util'


export default class CliDir extends Command {

  static override description = 'show working directories used by the cli'

  static aliases = ['dir', 'paths', 'cli:paths']

  static override examples = [
    'cl cli:dir'
  ]

  public async run(): Promise<void> {

    const cacheDir = this.config.cacheDir
    const dataDir = this.config.dataDir
    const configDir = this.config.configDir

    this.log()
    this.log(clColor.cyanBright('Commerce Layer CLI directories'))
    this.log()

    this.log(`🔧 Configuration: ${clColor.dim(configDir)}`)
    this.log(`📦 Data: ${clColor.dim(dataDir)}`)
    this.log(`⚡ Cache: ${clColor.dim(cacheDir)}`)

    this.log()
    this.log(`CLI directory name: ${clColor.dim(this.config.dirname)}`)

    this.log()

  }

}
