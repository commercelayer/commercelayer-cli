import { clColor, clToken, clUpdate, clFilter, type KeyValRel, type KeyValString, clOutput, clUtil } from '@commercelayer/cli-core'
import { Command, Flags, Args, ux } from '@oclif/core'
import commercelayer, { type CommerceLayerClient, CommerceLayerStatic } from '@commercelayer/sdk'
import type { CommandError } from '@oclif/core/lib/interfaces'


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
  }



  // INIT (override)
  async init(): Promise<any> {
    // Check for plugin updates only if in visible mode
    if (!this.argv.includes('--blind') && !this.argv.includes('--silent') && !this.argv.includes('--quiet')) clUpdate.checkUpdate(pkg)
    return await super.init()
  }




  // -- CUSTOM METHODS -- //


  protected includeFlag(flag: string[] | undefined, relationships?: KeyValRel, force?: boolean): string[] {

    const values: string[] = []

    if (flag) {
      const flagValues = flag.map(f => f.split(',').map(t => t.trim()))
      flagValues.forEach(a => values.push(...a))
      if (values.some(f => f.split('.').length > 3) && !force) this.error('Can be only included resources within the 3rd level of depth')
    }

    if (relationships) {
      Object.keys(relationships).forEach(r => {
        if (!values.includes(r)) values.push(r)
      })
    }

    return values

  }


  protected whereFlag(flag: string[] | undefined): KeyValString {

    const wheres: KeyValString = {}

    if (flag && (flag.length > 0)) {
      flag.forEach(f => {

        const wt = f.split('=')
        if (wt.length < 2) this.error(`Filter flag must be in the form ${clColor.style.attribute('predicate=value')}`)
        const w = wt[0]
        if (!clFilter.available(w)) this.error(`Invalid query filter: ${clColor.style.error(w)}`, {
          suggestions: [`Execute command ${clColor.style.command('resources:filters')} to get a full list of all available filter predicates`],
          ref: 'https://docs.commercelayer.io/api/filtering-data#list-of-predicates',
        })

        const v = wt[1]

        wheres[w] = v

      })
    }

    return wheres

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

    const userAgent = clUtil.userAgent(this.config)

    return commercelayer({
      organization,
      domain,
      accessToken,
      userAgent
    })

  }


  protected cleanupStatus(status?: string): string {
    if (!status) return ''
    switch (status.toLowerCase()) {
      case 'completed': return clColor.msg.success(status)
      case 'interrupted': return clColor.msg.error(status)
      case 'pending':
      case 'in_progress':
      default: return status
    }
  }


  protected handleError(error: CommandError, flags?: any, id?: string): void {
    if (CommerceLayerStatic.isApiError(error)) {
      if (error.status === 401) {
        const err = error.first()
        this.error(clColor.msg.error(`${err.title}:  ${err.detail}`),
          { suggestions: ['Execute login to get access to the organization\'s exports'] },
        )
      } else
      if (error.status === 404) {
        this.error(`Unable to find export${id ? ` with id ${clColor.msg.error(id)}` : ''}`)
      } else this.error(clOutput.formatOutput(error, flags))
    } else throw error
  }

}



export { Flags, Args, ux as cliux }
