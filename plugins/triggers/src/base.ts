import { CommerceLayerStatic } from '@commercelayer/sdk'
import { Command, Flags } from '@oclif/core'
import { clColor, clOutput, clUpdate } from '@commercelayer/cli-core'


const pkg = require('../package.json')


export default abstract class extends Command {

  static flags = {
    organization: Flags.string({
      char: 'o',
      description: 'the slug of your organization',
      required: true,
      env: 'CL_CLI_ORGANIZATION',
    }),
    domain: Flags.string({
      char: 'd',
      required: false,
      hidden: true,
      dependsOn: ['organization'],
      env: 'CL_CLI_DOMAIN',
    }),
    accessToken: Flags.string({
      hidden: true,
      required: true,
      env: 'CL_CLI_ACCESS_TOKEN',
    }),
    print: Flags.boolean({
      char: 'p',
      description: 'print out the modified resource',
    }),
    json: Flags.boolean({
      char: 'j',
      description: 'print result in JSON format',
      dependsOn: ['print'],
    }),
    unformatted: Flags.boolean({
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
    this.handleError(error, undefined, this.argv[0])
  }


  protected handleError(error: any, flags?: any, id?: string): void {
    if (CommerceLayerStatic.isApiError(error)) {
      const res = error.code?.startsWith('RES_') ? error.code.replace('RES_', '') : ''
      if (error.status === 401) {
        const err = error.first()
        this.error(clColor.msg.error(`${err.title}:  ${err.detail}`),
          { suggestions: [`Execute login with sufficient privileges to get access to the organization's resources${res ? ` of type ${clColor.api.resource(res)}` : ''}`] }
        )
      } else
      if (error.status === 404) {
        this.error(`Unable to find the resource of type ${clColor.api.resource(res)}${id ? ` and id ${clColor.msg.error(id)}` : ''}`)
			} else this.error(clOutput.formatError(error, flags))
    } else throw error
  }


  protected printOutput(res: any, flags: any): void {
    this.log(clOutput.formatOutput(res, flags))
  }


  protected successMessage(resource: string, action: string, id: string) {
    this.log(`\nAction ${clColor.api.trigger(action)} executed without errors on ${resource.replace(/_/g, ' ')} ${clColor.api.id(id)}\n`)
  }

}



export { Flags }
