import { clColor, clToken, clUpdate, clOutput, clConfig } from '@commercelayer/cli-core'
import { Command, Flags, Args, ux } from '@oclif/core'
import commercelayer, { type CommerceLayerClient, CommerceLayerStatic, type Tag } from '@commercelayer/sdk'

import type { CommandError } from '@oclif/core/lib/interfaces'



const pkg = require('../package.json')



export default abstract class BaseCommand extends Command {

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
    })
  }


  protected cl!: CommerceLayerClient



  // INIT (override)
  async init(): Promise<any> {

    // Check for plugin updates only if in visible mode
    if (!this.argv.includes('--blind') && !this.argv.includes('--silent') && !this.argv.includes('--quiet')) clUpdate.checkUpdate(pkg)

    // Application check
    const atFlag = this.argv.find(a => a.startsWith('--accessToken='))
    if (atFlag) {
      const accessToken = atFlag?.substring(atFlag.indexOf('=') + 1)
      this.checkApplication(accessToken, ['integration'/* , 'cli' */])
    }

    return await super.init()

  }


  async catch(error: CommandError): Promise<any> {
    if (error.message?.includes('quit')) this.exit()
    else return super.catch(error)
  }



  protected checkApplication(accessToken: string, kinds: string[]): boolean {

    const info = clToken.decodeAccessToken(accessToken)

    if (info === null) this.error('Invalid access token provided')
    else
      if (!kinds.includes(info.application.kind))
        this.error(`Invalid application kind: ${clColor.msg.error(info.application.kind)}. Application kind must be one of the following: ${clColor.cyanBright(kinds.join(', '))}`)

    return true

  }


  protected commercelayerInit(flags: any): CommerceLayerClient {

    const organization = flags.organization
    const domain = flags.domain
    const accessToken = flags.accessToken

    this.cl = commercelayer({
      organization,
      domain,
      accessToken,
    })

    return this.cl

  }



  protected handleError(error: CommandError, flags?: any, id?: string): void {
    if (CommerceLayerStatic.isApiError(error)) {
      if (error.status === 401) {
        const err = error.first()
        this.error(clColor.msg.error(`${err.title}:  ${err.detail}`),
          { suggestions: ['Execute login to get access to the organization\'s tags'] },
        )
      } else
        if (error.status === 404) {
          this.error(`Unable to find tag${id ? ` with ID or name ${clColor.msg.error(id)}` : ''}`)
        } else this.error(clOutput.formatError(error))
    } else throw error
  }


  protected checkName(name?: string, blocking?: boolean): string | undefined {
    const ok = name && clConfig.tags.tag_name_pattern.test(name)
    if (!ok) (blocking ? this.error : this.warn)(`Invalid tag name: ${clColor.msg.error(name)}`)
    return name
  }


  protected filterFlagName(flag: string[]): string[] {
    return this.filterFlagMulti(flag, this.checkName)
  }


  protected filterFlagMulti(flag: string[], filter?: (s: string) => boolean | string | undefined): string[] {
    if (!flag || (flag.length === 0)) return flag
    const merged = flag.join(',').split(',').filter(t => ((t !== undefined) && (t !== '')))
    return filter? merged.filter(filter) : merged
  }


  protected async checkTag(idOrName: string, blocking?: boolean): Promise<Tag | undefined> {

    let tag: Tag | undefined

    try {
      tag = await this.cl.tags.retrieve(idOrName)
    } catch (err) {
      if (this.cl.isApiError(err) && (err.status === 404)) tag = undefined
      else throw err
    }

    if (!tag) tag = (await this.cl.tags.list({ filters: { name_eq: idOrName } })).first()

    if (!tag) {
      console.log(`${blocking ? '\n' : ''}Unable to find tag with this ID or name: ${clColor.msg.error(idOrName)}${blocking ? '\n' : ''}`)
      if (blocking) this.exit()
    }

    return tag

  }


  protected checkResourceType(type: string): boolean {
    if (!CommerceLayerStatic.resources().includes(type)) this.error(`Invalid resource type: ${clColor.msg.error(type)}`)
    return true
  }

}



export abstract class BaseIdCommand extends BaseCommand {

  static args = {
    id_name: Args.string({ name: 'id_name', description: 'unique id or name of the tag', required: true, hidden: false }),
  }

}



export { Flags, Args, ux as cliux }
