import { CLCommand, clColor, clOutput } from '@commercelayer/cli-core'
import { CommerceLayerStatic, type Order } from '@commercelayer/sdk'
import type { Interfaces } from '@oclif/core'
import { Args, Flags } from '@oclif/core'
import exec from './exec'
import type { ActionType } from './triggers'

type CommandError = Interfaces.CommandError


export default abstract class extends CLCommand {

  static baseFlags = {
    ...CLCommand.baseFlags,
    print: Flags.boolean({
      char: 'p',
      description: 'print out the modified order'
    }),
    json: Flags.boolean({
      char: 'j',
      description: 'print result in JSON format',
      dependsOn: ['print']
    }),
    unformatted: Flags.boolean({
      char: 'u',
      description: 'print JSON output without indentation',
      dependsOn: ['json']
    })
  }


  static args = {
    id: Args.string({ name: 'id', description: 'the unique id of the order', required: true })
  }


  async catch(error: CommandError): Promise<any> {
    if (error.message?.includes('quit')) this.exit()
    else this.handleError(error as Error)
  }


  protected handleError(error: CommandError, flags?: any): void {
    if (error.message?.match(/Missing \d required args?:\nid/))
      this.error(`Missing the required unique ${clColor.style.error('id')} of the order`)
    else
      if (CommerceLayerStatic.isApiError(error)) this.handleApiError(error, { resource: 'order', id: (error as any).id || '', flags })
      else throw error
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
