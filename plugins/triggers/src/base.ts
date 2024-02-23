import { CommerceLayerStatic } from '@commercelayer/sdk'
import { Command, Flags, Args } from '@oclif/core'
import { clApi, clColor, clOutput, clUpdate } from '@commercelayer/cli-core'
import type { CommandError } from '@oclif/core/lib/interfaces'
import type { Resource } from '@commercelayer/sdk/lib/cjs/resource'
import type { CLIError } from '@oclif/core/lib/errors'
import exec from './exec'


const pkg: clUpdate.Package = require('../package.json')


export default abstract class extends Command {

  static baseFlags = {
    organization: Flags.string({
      char: 'o',
      description: 'the slug of your organization',
      required: true,
      env: 'CL_CLI_ORGANIZATION',
      hidden: true,
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


  static args = {
    id: Args.string({ name: 'id', description: 'the unique id of the resource', required: true }),
  }


  // INIT (override)
  async init(): Promise<any> {
    clUpdate.checkUpdate(pkg)
    return await super.init()
  }


  async catch(error: CLIError): Promise<any> {
    this.handleError(error)
  }


  protected handleError(error: CommandError, flags?: any): void {

    if (error.message?.match(/Missing \d required args?:\nid/)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const resName = clApi.humanizeResource(((error as any).parse.input.context.id).split(':')[0])
      this.error(`Missing the required unique ${clColor.style.error('id')} of the ${clColor.cli.command(resName)}`)
    }
    else
    if (CommerceLayerStatic.isApiError(error)) {

      let res = ''
      let id = ''
      if (error.code?.startsWith('RES_')) {
        const tokens = error.code.replace('RES_', '').split('_')
        if (tokens.length > 0) res = tokens[0]
        if (tokens.length > 1) id = tokens[1]
      }

      if (error.status === 401) {
        const err = error.first()
        this.error(clColor.msg.error(`${err.title}:  ${err.detail}`),
          { suggestions: [`Execute login with sufficient privileges to get access to the organization's resources${res ? ` of type ${clColor.api.resource(res)}` : ''}`] },
        )
      } else
      if (error.status === 404) {
        this.error(`Unable to find the resource of type ${clColor.api.resource(res)}${id ? ` and id ${clColor.msg.error(id)}` : ''}`)
			} else this.error(clOutput.formatError(error, flags))
    } else throw error

  }


  protected printOutput(res: Resource, flags: any): void {
    this.log(clOutput.formatOutput(res, flags))
  }


  protected successMessage(resource: string, action: string, id: string): void {
    this.log(`\nAction ${clColor.api.trigger(action)} executed without errors on ${resource.replace(/_/g, ' ')} ${clColor.api.id(id)}\n`)
  }


  protected async executeAction<R extends Resource>(resourceType: string, id: string, action: string, flags: any, fields?: string[]): Promise<R> {
    return await exec<R>(resourceType, id, action, flags, fields, this.config)
  }

}



export { Flags }
