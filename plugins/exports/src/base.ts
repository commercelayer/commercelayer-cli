import { clColor, clToken, clUpdate, clFilter, clOutput, clUtil, clApi } from '@commercelayer/cli-core'
import type { ApiMode, KeyValRel, KeyValString } from '@commercelayer/cli-core'
import { Command, Flags, Args, ux } from '@oclif/core'
import { existsSync, readFileSync } from 'fs'
import axios from 'axios'
import { type InputType, gunzipSync } from 'zlib'
import commercelayer, { type CommerceLayerClient, CommerceLayerStatic, type Export } from '@commercelayer/sdk'
import { writeFile } from 'fs/promises'
import type { CommandError } from '@oclif/core/lib/interfaces'
import notifier from 'node-notifier'


const pkg: clUpdate.Package = require('../package.json')


export const encoding = 'utf-8'


export const notify = (message: string): void => {
  notifier.notify({
    title: 'Commerce Layer CLI',
    message,
    wait: true,
  })
}


export const computeDelay = (): number => {

  /*
  const delayBurst = clConfig.api.requests_max_secs_burst / clConfig.api.requests_max_num_burst
  const delayAvg = clConfig.api.requests_max_secs_avg / clConfig.api.requests_max_num_avg

  const delay = Math.ceil(Math.max(delayBurst, delayAvg) * 1000)

  return delay
  */

  return clApi.requestRateLimitDelay()

}


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
    }),
  }


  protected environment: ApiMode = 'test'
  protected cl!: CommerceLayerClient



  // INIT (override)
  async init(): Promise<any> {
    // Check for plugin updates only if in visible mode
    if (!this.argv.includes('--blind') && !this.argv.includes('--silent') && !this.argv.includes('--quiet')) clUpdate.checkUpdate(pkg)
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
    const accessToken: string = flags.accessToken

    const userAgent = clUtil.userAgent(this.config)

    this.environment = clToken.getTokenEnvironment(accessToken)

    this.cl = commercelayer({
      organization,
      domain,
      accessToken,
      userAgent
    })

    return this.cl

  }


  protected exportStatus(status?: string): string {
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
        } else this.error(clOutput.formatError(error))
    } else throw error
  }

}



export abstract class ExportCommand extends BaseCommand {

  static baseFlags = {
    ...BaseCommand.baseFlags
  }

  protected async getExportedFile(attachmentUrl?: string | null, flags?: any): Promise<string> {

    if (!attachmentUrl) return ''

    let output: string
    if (attachmentUrl.toLowerCase().startsWith('http')) {
      const expFile = await axios.get(attachmentUrl, { responseType: 'arraybuffer' })
      output = expFile ? gunzipSync(expFile.data as InputType).toString() : ''
    }
    else output = readFileSync(attachmentUrl, { encoding })
     
    if (output && ((flags?.format === 'json') && !flags?.csv) && flags.prettify) output = JSON.stringify(JSON.parse(output), null, 4)

    return output

  }


  protected async saveOutput(exp: Export | string, flags: any): Promise<string | undefined> {

    try {

      const filePath = this.getOutputFilePath(flags)

      const url = (typeof exp === 'string') ? exp : exp.attachment_url
      const fileExport = await this.getExportedFile(url, flags)

      return writeFile(filePath, fileExport)
        .then(() => {
          if (existsSync(filePath) && !flags.quiet) this.log(`Exported file saved to ${clColor.style.path(filePath)}\n`)
          return filePath
        })
        .catch(() => this.error(`Unable to save export file ${clColor.style.path(filePath)}`,
          { suggestions: ['Please check you have the right file system permissions'] }
        ))

    } catch (error: any) {
      if (error.code === 'ENOENT') this.warn(`Path not found ${clColor.msg.error(error.path)}: execute command with flag ${clColor.cli.flag('-X')} to force path creation`)
      else throw error
    } finally {
      if (!flags.quiet) this.log()
    }

  }


  protected getOutputFilePath(flags: any): string {
    let filePath = (flags.save || flags['save-path']) as string
    if (!filePath) this.warn('Undefined output save path')
    filePath = clUtil.specialFolder(filePath, flags['save-path'] as boolean)
    const format = this.getFileFormat(flags)
    if (!filePath.endsWith(format)) filePath += `.${format}`
    return filePath
  }


  protected async checkAccessToken(jwtData: any, flags: any): Promise<any> {

    const securityInterval = 2

    if (((jwtData.exp - securityInterval) * 1000) <= Date.now()) {

      await ux.wait((securityInterval + 1) * 1000)

      const organization = flags.organization
      const domain = flags.domain

      const token = await clToken.getAccessToken({
        clientId: flags.clientId || '',
        clientSecret: flags.clientSecret || '',
        slug: organization,
        domain
      }).catch(error => {
        this.error('Unable to refresh access token: ' + String(error.message))
      })

      const accessToken = token?.accessToken || ''

      this.cl.config({ organization, domain, accessToken })
      jwtData = clToken.decodeAccessToken(accessToken) as any

    }

    return jwtData

  }



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


  protected getFileFormat(flags: any): ExportFormat {
    return flags.csv ? 'csv' : flags.format
  }


  protected handleExportError(error: any, resDesc: string): void {
    const err = error.first()
    const errMeta = err?.meta
    if (errMeta.error === 'less_than_or_equal_to') this.error(`Too many ${resDesc} to export: ${clColor.msg.error(errMeta.value)}`, {
      suggestions: [`The maximum number of exportable records is ${clColor.yellowBright(errMeta?.count)}, add more filters and re-run the command`]
    })
    else if (errMeta.error === 'greater_than') {
      this.log(clColor.italic(`\nNo ${resDesc} found\n`))
      this.exit()
    } else this.error(`${error.statusText}: ${err.title}`)
  }

}



export { Flags, Args, ux as cliux }

export type ExportFormat = 'json' | 'csv'
