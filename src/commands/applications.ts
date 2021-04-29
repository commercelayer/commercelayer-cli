import { Command } from '@oclif/command'
import fs from 'fs'
import path from 'path'
import { AppInfo } from '../config'
import cliux from 'cli-ux'
import chalk from 'chalk'

export default class Applications extends Command {

  static description = 'show a list of all (logged in) available CLI applications'

  static aliases = ['app:list', 'applications:list', 'app:available', 'applications:available']

  static examples = [
    '$ commercelayer applications',
    '$ cl applications',
  ]

  static flags = {}

  static args = []

  async run() {

    let configData: AppInfo[]

    try {

      const configFiles = fs.readdirSync(this.config.configDir).filter(f => f.endsWith('.config.json'))

      configData = configFiles.map(cf => {
        const appConfig = fs.readFileSync(path.join(this.config.configDir, cf), { encoding: 'utf-8' })
        return JSON.parse(appConfig)
      })

    } catch (error) {
      this.error('No CLI applications config files found', { suggestions: ['Execute first login to at least one CLI application'] })
    }

    this.log()
    cliux.table(configData,
      {
        key: { header: 'APPLICATION (KEY)', minWidth: 20, get: row => chalk.blueBright(row.key) },
        // slug: { header: '  SLUG  ', get: row => `  ${row.slug}  ` },
        name: { header: '  NAME  ', get: row => `  ${row.name}  ` },
        baseUrl: { header: 'BASE URL', get: row => `${row.baseUrl ? `${row.baseUrl}  ` : ''}` },
        mode: { header: 'MODE\n', get: row => `${(row.mode === 'live') ? chalk.greenBright(row.mode) : chalk.yellowBright(row.mode)}` },
      },
      {
        printLine: this.log,
      })
    this.log()

  }

}
