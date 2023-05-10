
import Command, { Flags, cliux } from '../../base'
import { clToken, clColor, clConfig, clOutput, clApi } from '@commercelayer/cli-core'
import type { CommerceLayerClient, ExportCreate } from '@commercelayer/sdk'
import notifier from 'node-notifier'
import open from 'open'


const securityInterval = 2


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



export default class ExportsCreate extends Command {

  static description = 'create a new export'

  static aliases = ['exp:create', 'export']

  static examples = [
    '$ commercelayer exports:create -t cusorderstomers -X <output-file-path>',
    '$ cl exp:create -t customers -i customer_subscriptions -w email_end=@test.org',
  ]

  static flags = {
    type: Flags.string({
      char: 't',
      description: 'the type of resource being exported',
      required: true,
      options: clConfig.exports.types as string[],
      helpValue: clConfig.exports.types.slice(0, 4).join('|') + '|...',
      multiple: false,
    }),
    include: Flags.string({
      char: 'i',
      multiple: true,
      description: 'comma separated resources to include',
    }),
    where: Flags.string({
      char: 'w',
      multiple: true,
      description: 'comma separated list of query filters',
    }),
    'dry-data': Flags.boolean({
      char: 'D',
      description: 'skip redundant attributes',
      default: false
    }),
    format: Flags.string({
      char: 'F',
      description: 'export file format',
      options: ['csv', 'json'],
      default: 'json',
      exclusive: ['csv', 'json']
    }),
    csv: Flags.boolean({
      char: 'C',
      description: 'export data in CSV format',
      exclusive: ['format']
    }),
    save: Flags.string({
      char: 'x',
      description: 'save command output to file',
      multiple: false,
      exclusive: ['save-path'],
    }),
    'save-path': Flags.string({
      char: 'X',
      description: 'save command output to file and create missing path directories',
      multiple: false,
      exclusive: ['save'],
    }),
    notify: Flags.boolean({
      char: 'N',
      description: 'force system notification when export has finished',
      hidden: true,
    }),
    blind: Flags.boolean({
      char: 'b',
      description: 'execute in blind mode without showing the progress monitor',
      exclusive: ['quiet', 'silent'],
    }),
    prettify: Flags.boolean({
      char: 'P',
      description: 'prettify json output format',
      exclusive: ['csv']
    }),
    open: Flags.boolean({
      char: 'O',
      description: 'open automatically the file after a successful export'
    })
  }


  async checkAccessToken(jwtData: any, flags: any, client: CommerceLayerClient): Promise<any> {

    if (((jwtData.exp - securityInterval) * 1000) <= Date.now()) {

      await cliux.wait((securityInterval + 1) * 1000)

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

      client.config({ organization, domain, accessToken })
      jwtData = clToken.decodeAccessToken(accessToken) as any

    }

    return jwtData

  }


  async run(): Promise<any> {

    const { flags } = await this.parse(ExportsCreate)

    const accessToken = flags.accessToken
    this.checkApplication(accessToken, ['integration', 'cli'])

    const outputPath = flags.save || flags['save-path']
    if (!outputPath) this.error('Undefined output file path')

    if (flags.prettify && ((flags.format === 'csv') || flags.csv)) this.error(`Flag ${clColor.cli.flag('Pretty')} can only be used with ${clColor.cli.value('JSON')} format`)

    const resType = flags.type
    if (!clConfig.exports.types.includes(resType)) this.error(`Unsupported resource type: ${clColor.style.error(resType)}`)
    const resDesc = resType.replace(/_/g, ' ')

    const notification = flags.notify || false
    const blindMode = flags.blind || false

    const format = flags.csv ? 'csv' : flags.format

    // Include flags
    const include: string[] = this.includeFlag(flags.include)
    // Where flags
    const wheres = this.whereFlag(flags.where)


    const cl = this.commercelayerInit(flags)

    const expCreate: ExportCreate = {
      resource_type: resType,
      format,
      dry_data: flags['dry-data']
    }

    if (include && (include.length > 0)) expCreate.includes = include
    if (wheres && (Object.keys(wheres).length > 0)) expCreate.filters = wheres


    try {

      let exp = await cl.exports.create(expCreate)

      if (!exp.records_count) {
        this.log(clColor.italic('\nNo records found\n'))
        this.exit()
      } else this.log(`Started export ${clColor.style.id(exp.id)}`)

      let jwtData = clToken.decodeAccessToken(accessToken) as any

      const delay = computeDelay()

      if (!blindMode) cliux.action.start(`Exporting ${resDesc}`, this.exportStatus(exp.status?.replace(/_/g, ' ') || 'waiting'))
      while (!['completed', 'interrupted'].includes(exp.status || '')) {
        jwtData = await this.checkAccessToken(jwtData, flags, cl)
        exp = await cl.exports.retrieve(exp.id)
        cliux.action.status = this.exportStatus(exp.status?.replace(/_/g, ' ') || 'waiting')
        await cliux.wait(delay)
      }
      if (!blindMode) cliux.action.stop(this.exportStatus(exp.status))


      if (exp.status === 'completed') this.log(`\nExported ${clColor.yellowBright(exp.records_count || 0)} ${resDesc}`)
      else this.error(`Export ${exp?.id} ended with errors`)

      const outputFile = await this.saveOutput(exp, flags)

      // Notification
      const finishMessage = `Export of ${exp.records_count} ${resDesc} is finished!`
      if (blindMode) this.log(finishMessage)
      else {
        if (notification) notify(finishMessage)
        if (flags.open && outputFile) await open(outputFile)
      }

    } catch (error: any) {
      if (cl.isApiError(error) && (error.status === 422)) {
        const err = error.first()?.meta
        if (err.error === 'less_than_or_equal_to') this.error(`Too many ${resDesc} to export: ${clColor.msg.error(err.value)}`, {
          suggestions: [`The maximum number of exportable records is ${clColor.yellowBright(err?.count)}, add more filters and re-run the command`]
        })
        else if (err.error === 'greater_than') {
          this.log(clColor.italic(`\nNo ${resDesc} found\n`))
          this.exit()
        }
      }
      this.error(clOutput.formatError(error, flags))
    }

  }

}
