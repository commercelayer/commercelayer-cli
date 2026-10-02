import { CLCommand, clColor, clFilter, type KeyValRel, type KeyValString } from '@commercelayer/cli-core'
import * as cliux from '@commercelayer/cli-ux'
import commercelayer, { type CommerceLayerClient, CommerceLayerStatic } from '@commercelayer/sdk'
import type { Interfaces } from '@oclif/core'
import { Args, Flags } from '@oclif/core'

type CommandError = Interfaces.CommandError


export default abstract class extends CLCommand {

  // oclif collects the static properties of a command up to the first class
  // without any (cacheCommand): without its own, the manifest would miss them
  static baseFlags = {
    ...CLCommand.baseFlags
  }


  // -- CUSTOM METHODS -- //


  protected includeFlag(flag: string[] | undefined, relationships?: KeyValRel, force?: boolean): string[] {

    const values: string[] = []

    if (flag) {
      const flagValues = flag.map(f => f.split(',').map(t => t.trim()))
      flagValues.forEach(a => { values.push(...a) })
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


  protected commercelayerInit(flags: any): CommerceLayerClient {
    return commercelayer(this.clientOptions(flags))
  }


  protected cleanupStatus(status?: string): string {
    if (!status) return ''
    switch (status.toLowerCase()) {
      case 'completed': return clColor.msg.success(status)
      case 'interrupted': return clColor.msg.error(status)
      // case 'pending':
      // case 'in_progress':
      default: return status
    }
  }


  protected handleError(error: CommandError, flags?: any, id?: string): void {
    if (CommerceLayerStatic.isApiError(error)) this.handleApiError(error, { resource: 'cleanup', id, flags })
    else throw error
  }

}


export { Args, cliux, Flags }
