import { accessTokenFlag, CLCommand, clColor, clConfig, clText } from '@commercelayer/cli-core'
import commercelayer, { type CommerceLayerClient, CommerceLayerStatic, type LinkCreate } from '@commercelayer/sdk'
import type { Interfaces } from '@oclif/core'
import { Args, ux as cliux, Flags } from '@oclif/core'
import { DOC_DATE_TIME_STRING_FORMAT, fillUTCDate } from './util'

type CommandError = Interfaces.CommandError


export abstract class BaseCommand extends CLCommand {

  static baseFlags = {
    ...CLCommand.baseFlags,
    accessToken: accessTokenFlag({
      char: 'a',
      description: 'custom access token to use instead of the one used for login',
      dependsOn: ['organization'],
    })
  }


  protected cl!: CommerceLayerClient


  async catch(error: any): Promise<any> {
    return await this.handleError(error)
  }


  protected async handleError(error: any, flags?: any): Promise<any> {
    if (CommerceLayerStatic.isApiError(error)) this.handleApiError(error, { flags })
    else return await super.catch(error as CommandError)
  }


  protected commercelayerInit(flags: any): CommerceLayerClient {
    this.cl = commercelayer(this.clientOptions(flags))
    return this.cl
  }


  protected checkDateValue(value: string): string {
    try {
      const parsed = Date.parse(value)
      if (Number.isNaN(parsed)) throw new Error('Invalid date', { cause: 'PARSE' })
      const utcDate = fillUTCDate(value)
      return new Date(utcDate).toISOString()
    } catch (err: any) {
      const msg = (err.cause === 'PARSE') ? err.message : 'Error parsing date'
      this.error(`${msg}: ${clColor.msg.error(value)}`, {
        suggestions: [`Dates must be in standard ISO format (${DOC_DATE_TIME_STRING_FORMAT})`]
      })
    }
  }

}


export abstract class BaseEditCommand extends BaseCommand {

  static override baseFlags = {
    ...BaseCommand.baseFlags,
    item_type: Flags.string({
      char: 't',
      charAliases: ['r'],
      description: 'the type of the resource for which the link is created',
      aliases: ['type', 'resource'],
      required: false,
      options: clConfig.links.linkable_resources
    }),
    item_id: Flags.string({
      char: 'i',
      description: 'the id of the resource for which the link is created',
      aliases: ['id'],
      required: false
    }),
    client_id: Flags.string({
      char: 'I',
      description: 'the client_id of the application of kind sales_channel to be used with the link',
      required: false
    }),
    scope: Flags.string({
      description: 'the application scope',
      required: false,
      multiple: true,
      multipleNonGreedy: true,
      hidden: true
    }),
    link_scope: Flags.string({
      char: 'S',
      description: 'the scope of the link',
      required: false,
      multiple: true,
      multipleNonGreedy: true
    }),
    name: Flags.string({
      char: 'n',
      description: 'the name associated to the the link',
      required: false
    }),
    starts: Flags.string({
      char: 's',
      summary: 'the link\'s start date and time',
      description: 'Use the standard ISO format: ' + DOC_DATE_TIME_STRING_FORMAT,
      required: false
    }),
    expires: Flags.string({
      char: 'e',
      summary: 'the link\'s expiration date and time',
      description: 'Use the standard ISO format: ' + DOC_DATE_TIME_STRING_FORMAT,
      required: false
    }),
    link_domain: Flags.string({
      char: 'D',
      description: 'the domain of the link',
      default: clConfig.links.default_domain,
      required: false
    })
  }

  static override args = {
    ...BaseCommand.args
  }


  protected checkRequired<T = string>(flags: any, name: string, label?: string): T {
    const value = flags[name]
    if (!value || (Array.isArray(value) && (value.length === 0))) this.error(`Flag ${clColor.cli.flag(`'${label}'` || clText.capitalize(name))} not defined`)
    return value
  }


  protected checkResource(res: string): string {
    const resource = clText.pluralize(res)
    const found = clConfig.links.linkable_resources.includes(resource)
    if (!found) this.error(`Invalid resource ${clColor.style.error(res)}`,
      { suggestions: [`Execute command ${clColor.style.command('links:resources')} to get a list of all available linkable resources`] }
    )
    return resource
  }


  protected async checkItem(resource: string, resourceId?: string): Promise<LinkCreate['item'] & { code?: string }> {

    let res = resource
    let id: string = resourceId || ''

    const si = res.indexOf('/')
    if (si >= 0) {
      const rt = res.split('/')
      if (id && rt[1]) this.error(`Double definition of resource id: [${res}, ${id}]`,
        { suggestions: [`Define resource id as command argument (${clColor.italic(id)}) or as part of the resource itself (${clColor.italic(res)}) but not both`] }
      )
      else id = rt[1]
      res = rt[0]
    }

    const type = this.checkResource(res) as LinkCreate['item']['type']

    let code = ''
    if (id) {
      if (id.includes('/')) this.error(`Invalid resource id: ${clColor.msg.error(id)}`)
      else {
        const resource = await this.cl[type].retrieve(id).catch(() => {
          this.error(`Non existent or not accessible ${clColor.api.resource(clText.singularize(type))} with id ${clColor.api.id(id)}`)
        })
        if (resource) {
          const res: any = resource
          code = res.code || res.number || res.name || res.id
        }
      }
    }

    return {
      type,
      id,
      code
    }

  }


  protected checkScope(scopeFlags?: string[]): string {

    const scope: string[] = []

    if (scopeFlags) {
      for (const s of scopeFlags) {

        const parts = s.split(':')
        if ((parts.length < 2) || (parts.length > 3)) this.error(`Invalid scope: ${clColor.msg.error(s)}`)

        const scopePrefix = parts[0]
        if (!['market', 'stock_location'].includes(scopePrefix)) this.error(`Invalid scope prefix: ${clColor.msg.error(scopePrefix)}`)

        switch (parts.length) { // market:12345
          case 2: {
            const scopeId = parts[1]
            if (!scopeId || (scopeId.length > 10)) this.error(`Invalid ${scopePrefix} number: ${clColor.msg.error(scopeId)}`)
            break
          }
          case 3: { // market:id:aBcDe
            const scopeField = parts[1]
            if (!['id', 'code'].includes(scopeField)) this.error(`Invalid ${scopePrefix} field: ${clColor.msg.error(scopeField)}`)
            const scopeVal = parts[2]
            if (!scopeVal || ((scopeField === 'id') && (scopeVal.length > 10))) this.error(`Invalid ${scopePrefix} ${scopeField}: ${clColor.msg.error(scopeVal)}`)
            break
          }
        }

        if (scope.includes(s)) this.error(`Duplicate link scope: ${clColor.msg.error(s)}`)

        scope.push(s)

      }
    }

    return scope.join(',')

  }


  protected checkClientId(value?: string, _required: boolean = false): string {
    if (value?.length !== 43) this.error(`Invalid client_id: ${clColor.msg.error(value)}`)
    return value
  }

}


export abstract class BaseIdCommand extends BaseCommand {

  static override baseFlags = {
    ...BaseCommand.baseFlags
  }

  static override args = {
    id: Args.string({ name: 'id', description: 'the id of the link', required: true })
  }

}


export { Args, cliux, Flags }
