import { type ApiMode, CLCommand, clColor, clToken } from '@commercelayer/cli-core'
import * as cliux from '@commercelayer/cli-ux'
import commercelayer, { type CommerceLayerClient, CommerceLayerStatic } from '@commercelayer/sdk'
import type { Interfaces } from '@oclif/core'
import { Args, Flags } from '@oclif/core'

type CommandError = Interfaces.CommandError


export default abstract class extends CLCommand {

  static enableJsonFlag = false


  protected environment: ApiMode = 'test'


  protected handleError(error: CommandError, flags?: any, id?: string): never {
    if (CommerceLayerStatic.isApiError(error)) this.handleApiError(error, { resource: 'import', id, flags })
    else throw error
  }


  protected importStatus(status?: string): string {
    if (!status) return ''
    switch (status.toLowerCase()) {
      case 'completed': return clColor.msg.success(status)
      case 'interrupted': return clColor.msg.error(status)
      // case 'pending':
      // case 'in_progress':
      default: return status
    }
  }


  protected commercelayerInit(flags: any): CommerceLayerClient {
    this.environment = clToken.getTokenEnvironment(flags.accessToken as string)
    return commercelayer(this.clientOptions(flags))
  }

}


export { Args, cliux, Flags }
