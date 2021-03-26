import {Command} from '@oclif/command'
import fs from 'fs'
import path from 'path'
import { AppInfo } from '../../config'
import cliux from 'cli-ux'
import chalk from 'chalk'

export default class ApplicationsAvailable extends Command {
  static description = 'show a list of all (logged in) available CLI applications '

  static aliases = ['applications']

  static flags = { }

  static args = [ ]

  async run() {

    const configFiles = fs.readdirSync(this.config.configDir).filter(f => f.endsWith('.config.json'))

    const configData: AppInfo[] = configFiles.map(cf => {
      const appConfig = fs.readFileSync(path.join(this.config.configDir, cf), { encoding: 'utf-8' })
      return JSON.parse(appConfig)
    })

    this.log()
    cliux.table(configData,
      {
        key: { header: 'APPLICATION (KEY)', minWidth: 20, get: row =>  chalk.blueBright(row.key) },
        name: { header: '  NAME  ', get: row => `  ${row.name}  ` },
        baseUrl: { header: 'BASE URL', get: row => `${row.baseUrl ? `${row.baseUrl}  ` : ''}` },
        mode: { header: 'MODE', get: row => `${(row.mode === 'live') ? chalk.green(row.mode) : chalk.yellow(row.mode)}` },
      },
      {
        printLine: this.log,
    })
    this.log()

  }

}
