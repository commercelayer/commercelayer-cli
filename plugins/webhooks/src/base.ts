import { CLCommand, clColor } from '@commercelayer/cli-core'
import * as cliux from '@commercelayer/cli-ux'
import type { ApiVersion } from '@commercelayer/sdk'
import commercelayer, { type CommerceLayerClient, CommerceLayerStatic } from '@commercelayer/sdk'
import type { Interfaces } from '@oclif/core'
import { Args, Flags } from '@oclif/core'

type CommandError = Interfaces.CommandError


export abstract class BaseCommand extends CLCommand {

  // oclif collects the static properties of a command up to the first class
  // without any (cacheCommand): without its own, the manifest would miss them
  static baseFlags = {
    ...CLCommand.baseFlags
  }


  async catch(error: any): Promise<any> {
    this.handleError(error as CommandError)
  }


  protected handleError(error: CommandError, flags?: any, id?: string): void {
    if (CommerceLayerStatic.isApiError(error)) this.handleApiError(error, { resource: 'webhook', id, flags })
    else throw error
  }


  protected commercelayerInit(flags: any): CommerceLayerClient {
    return commercelayer(this.clientOptions<ApiVersion>(flags))
  }

}


export abstract class BaseIdCommand extends BaseCommand {

  static args = {
    id: Args.string({ name: 'id', description: 'unique id of the webhook', required: true, hidden: false }),
  }

  async catch(error: any): Promise<any> {
    if (error.message?.match(/Missing \d required args?:\nid/))
      this.error(`Missing the required unique ${clColor.style.error('id')} of the webhook`)
    else return await super.catch(error)
  }

}


export { Args, cliux, Flags }
