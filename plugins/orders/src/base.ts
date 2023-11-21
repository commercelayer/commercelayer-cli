import { CommerceLayerStatic, type Order } from '@commercelayer/sdk'
import { Command, Flags, Args } from '@oclif/core'
import { clColor, clOutput, clUpdate } from '@commercelayer/cli-core'
import type { CommandError } from '@oclif/core/lib/interfaces'
import type { ActionType } from './triggers'
import exec from './exec'


const pkg = require('../package.json')


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
      description: 'print out the modified order',
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
    id: Args.string({ name: 'id', description: 'the unique id of the order', required: true }),
  }


  // INIT (override)
  async init(): Promise<any> {
    clUpdate.checkUpdate(pkg)
    return await super.init()
  }


  async catch(error: any): Promise<any> {
    this.handleError(error)
  }


  protected handleError(error: CommandError, flags?: any): void {
    if (error.message?.match(/Missing \d required args?:\nid/))
      this.error(`Missing the required unique ${clColor.style.error('id')} of the order`)
    else
      if (CommerceLayerStatic.isApiError(error)) {
        if (error.status === 401) {
          const err = error.first()
          this.error(clColor.msg.error(`${err.title}:  ${err.detail}`),
            { suggestions: ['Execute login to get access to the organization\'s orders'] },
          )
        } else
          if (error.status === 404) {
            const id = (error as any).id || ''
            this.error(`Unable to find order${id ? ` with id ${clColor.msg.error(id)}` : ''}`)
          } else this.error(clOutput.formatError(error, flags))
      } else throw error
  }


  protected printOutput(order: Order, flags: any): void {
    this.log(clOutput.formatOutput(order, flags))
  }


  protected successMessage(action: string, id: string): void {
    this.log(`\nAction ${clColor.api.trigger(action)} executed without errors on order ${clColor.api.id(id)}\n`)
  }

  protected async executeAction(id: string, action: ActionType, flags: any, fields?: string[]): Promise<Order> {
    return await exec(id, action, flags, fields, this.config)
  }

}



export { Flags }
