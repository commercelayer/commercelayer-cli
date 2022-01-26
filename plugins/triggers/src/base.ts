import { CommerceLayerStatic } from '@commercelayer/sdk'
import Command, { flags } from '@oclif/command'
import chalk from 'chalk'
import { clOutput, clUpdate } from '@commercelayer/cli-core'


const pkg = require('../package.json')


export default abstract class extends Command {

  static flags = {
    organization: flags.string({
      char: 'o',
      description: 'the slug of your organization',
      required: true,
      env: 'CL_CLI_ORGANIZATION',
    }),
    domain: flags.string({
      char: 'd',
      required: false,
      hidden: true,
      dependsOn: ['organization'],
      env: 'CL_CLI_DOMAIN',
    }),
    accessToken: flags.string({
      hidden: true,
      required: true,
      env: 'CL_CLI_ACCESS_TOKEN',
    }),
    print: flags.boolean({
      char: 'p',
      description: 'print out the modified resource',
    }),
    json: flags.boolean({
      char: 'j',
      description: 'print result in JSON format',
      dependsOn: ['print'],
    }),
    unformatted: flags.boolean({
      char: 'u',
      description: 'print JSON output without indentation',
      dependsOn: ['json'],
    }),
  }


  static args = [
    { name: 'id', description: 'the unique id of the resource', required: true },
  ]


  // INIT (override)
  async init() {
    clUpdate.checkUpdate(pkg)
    return super.init()
  }


  async catch(error: any) {
    this.handleError(error)
  }


  protected handleError(error: any, flags?: any): void {
    if (CommerceLayerStatic.isApiError(error)) {
      if (error.status === 401) {
        const err = error.first()
        const res = error.code?.startsWith('RES_') ? error.code.replace('RES_', '') : ''
        this.error(chalk.bgRed(`${err.title}:  ${err.detail}`),
          { suggestions: [`Execute login with sufficient privileges to get access to the organization's resources${res ? ` of type ${chalk.bold(res)}` : ''}`] }
        )
      } else this.error(clOutput.formatError(error, flags))
    } else throw error
  }


  protected printOutput(res: any, flags: any): void {
    this.log(clOutput.formatOutput(res, flags))
  }


  protected successMessage(resource: string, action: string, id: string) {
    this.log(`\nAction ${chalk.italic.cyanBright(action)} executed without errors on ${resource.replace(/_/g, ' ')} ${chalk.yellowBright(id)}\n`)
  }

}



export { flags }
