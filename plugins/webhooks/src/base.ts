
import { Command, Flags, Args } from '@oclif/core'
import commercelayer, { type CommerceLayerClient, CommerceLayerStatic } from '@commercelayer/sdk'
import { clOutput, clUpdate, clColor, clUtil } from '@commercelayer/cli-core'
import type { CommandError } from '@oclif/core/lib/interfaces'
import * as cliux from '@commercelayer/cli-ux'


const pkg: clUpdate.Package = require('../package.json')


export abstract class BaseCommand extends Command {

  static baseFlags = {
    organization: Flags.string({
      char: 'o',
      description: 'the slug of your organization',
      required: true,
      env: 'CL_CLI_ORGANIZATION',
      hidden: true
    }),
    domain: Flags.string({
      char: 'd',
      required: false,
      hidden: true,
      dependsOn: ['organization'],
      env: 'CL_CLI_DOMAIN'
    }),
    accessToken: Flags.string({
      hidden: true,
      required: true,
      env: 'CL_CLI_ACCESS_TOKEN'
    })
  }



  // INIT (override)
  async init(): Promise<any> {
    clUpdate.checkUpdate(pkg)
    return await super.init()
  }


  async catch(error: any): Promise<any> {
    this.handleError(error as CommandError)
  }


  protected handleError(error: CommandError, flags?: any, id?: string): void {
      if (CommerceLayerStatic.isApiError(error)) {
        if (error.status === 401) {
          const err = error.first()
          this.error(clColor.bg.red(`${err.title}:  ${err.detail}`),
            { suggestions: ['Execute login to get access to the organization\'s webhooks'] },
          )
        } else
          if (error.status === 404) {
            this.error(`Unable to find webhook${id ? ` with id ${clColor.msg.error(id)}` : ''}`)
          } else this.error(clOutput.formatError(error, flags))
      } else throw error
  }


  protected commercelayerInit(flags: any): CommerceLayerClient {

    const organization = flags.organization
    const domain = flags.domain
    const accessToken = flags.accessToken

    const userAgent = clUtil.userAgent(this.config)

    return commercelayer({
      organization,
      domain,
      accessToken,
      userAgent
    })

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



export { Flags, Args, cliux }
