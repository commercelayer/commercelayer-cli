import commercelayer, { type CommerceLayerClient, CommerceLayerStatic } from '@commercelayer/sdk'
import { Command, Args, Flags } from '@oclif/core'
import { clColor, clConfig, clOutput, clToken, clUpdate, clUtil } from '@commercelayer/cli-core'
import type { CommandError } from '@oclif/core/lib/interfaces'
import { type MetricsFilter, type MetricsQueryBreakdown, operators, resources } from './common'
import * as cliux from '@commercelayer/cli-ux'



const pkg: clUpdate.Package = require('../package.json')


const REQUIRED_APP_KIND = clConfig.metrics.applications


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
      char: 'a',
      description: 'custom access token to use instead of the one used for login',
      hidden: true,
      required: true,
      env: 'CL_CLI_ACCESS_TOKEN',
      dependsOn: ['organization']
    })
  }


  // INIT (override)
  async init(): Promise<any> {
    clUpdate.checkUpdate(pkg)
    return await super.init()
  }


  async catch(error: any): Promise<any> {
    return await this.handleError(error)
  }


  protected async handleError(error: any, flags?: any): Promise<any> {
    if (CommerceLayerStatic.isApiError(error)) {
      if (error.status === 401) {
        const err = error.first()
        this.error(clColor.msg.error(`${err.title}:  ${err.detail}`),
          { suggestions: ['Execute login to get access to the organization\'s resources'] }
        )
      } else this.error(clOutput.formatError(error, flags))
    } else return await super.catch(error as CommandError)
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


  protected checkAcessTokenData(accessToken: string, flags?: any): boolean {

    const info = clToken.decodeAccessToken(accessToken)

    if (info === null) this.error('Invalid access token provided')
    else
      if (!REQUIRED_APP_KIND.includes(info.application.kind)) // Application
        this.error(`Invalid application kind: ${clColor.msg.error(info.application.kind)}. Only these access tokens can be used: [${REQUIRED_APP_KIND.join(', ')}]`)
      else
        if (info.organization?.slug !== flags.organization) // Organization
          this.error(`The access token provided belongs to a wrong organization: ${clColor.msg.error(info.organization?.slug)} instead of ${clColor.style.organization(flags.organization)}`)

    return true

  }


  protected multivalFlag(flag?: string[]): string[] {

    const values: string[] = []

    if (flag) {
      const flagValues = flag.map(f => f.split(',').map(t => t.trim()))
      flagValues.forEach(a => values.push(...a))
    }

    return values

  }


  protected async printResponse(response: Response): Promise<void> {
    if (cliux.action.running) cliux.action.stop(response.ok ? clColor.msg.success('Done') : clColor.msg.error('Error'))
    const jsonRes = await response.json()
    this.log()
    if (response.ok) this.log(clOutput.formatOutput(jsonRes.data))
    else this.log(clOutput.formatError(jsonRes))
    this.log()
  }

}


export abstract class BaseResourceCommand extends BaseCommand {

  static baseFlags = {
    ...BaseCommand.baseFlags,
    filter: Flags.string({
      char: 'F',
      description: 'the filter to apply to the query in JSON format (enclosed in single quotes)'
    })
  }


  static args = {
    resource: Args.string({ resource: 'the resource name', options: resources, required: true })
  }


  protected filterFlag(flag?: string): MetricsFilter | undefined {

    let filter: MetricsFilter | undefined

    if (flag) {
      try {
        filter = JSON.parse(flag)
      } catch (error) {
        this.error(`Invalid ${clColor.cli.flag('filter')} format. Please provide a valid JSON string`)
      }
    }

    return filter

  }

}


export abstract class BaseBreakdownCommand extends BaseResourceCommand {

  static baseFlags = {
    ...BaseResourceCommand.baseFlags,
    by: Flags.string({
      char: 'b',
      description: 'the field you want the results of the query aggragated by',
      required: true
    }),
    field: Flags.string({
      char: 'f',
      description: 'the field you want the metrics or statistics computed on',
      required: true
    }),
    operator: Flags.string({
      char: 'O',
      aliases: ['op'],
      summary: 'the computing operator',
      description: 'the list of valid operators depends on the value of the field key',
      options: operators,
      required: true,
    }),
    breakdown: Flags.string({
      char: 'B',
      summary: 'the optional nested breakdown',
      description: 'a JSON object (enclosed in single quotes) containing the nested breakdown',
    })
  }

  static args = {
    ...BaseResourceCommand.args
  }



  protected breakdownFlag(flag?: string): MetricsQueryBreakdown | undefined {

    let breakdown: MetricsQueryBreakdown | undefined

    if (flag) {
      try {
        breakdown = JSON.parse(flag)
      } catch (error) {
        this.error(`Invalid ${clColor.msg.error('breakdown')} format. Please provide a valid JSON string`)
      }
    }

    return breakdown

  }


  protected printBreakdown(by: string, data: any, level: number = 0): void {

    const tab = '  '.repeat(level)

    this.log(`${tab}${clColor.cyanBright(by)}: [`)

    const items = data[by] || []

    for (const item of (items as any[])) {
      this.log(`${tab}  ${item.label}: ${clColor.yellow(item.value)}`)
      const extraFields = Object.keys(item).filter((field: any) => !['label', 'value', 'date'].includes(field))
      const nestedBreakdown = (extraFields.length > 0) ? extraFields[0] : undefined
      if (nestedBreakdown) this.printBreakdown(nestedBreakdown, item, level + 1)
    }

    this.log(`${tab}]`)

  }

}


export { Args, Flags }
