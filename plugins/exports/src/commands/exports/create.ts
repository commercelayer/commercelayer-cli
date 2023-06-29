
import { ExportCommand, Flags, cliux, computeDelay, notify } from '../../base'
import { clToken, clColor, clConfig } from '@commercelayer/cli-core'
import type { ExportCreate } from '@commercelayer/sdk'
import open from 'open'



export default class ExportsCreate extends ExportCommand {

  static description = 'create a new export'

  static aliases = ['exp:create']

  static examples = [
    '$ commercelayer exports:create -t orders -X <output-file-path>',
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
      exclusive: ['format', 'prettify']
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



  async run(): Promise<any> {

    const { flags } = await this.parse(ExportsCreate)

    const accessToken = flags.accessToken
    this.checkApplication(accessToken, ['integration', 'cli'])

    const outputPath = flags.save || flags['save-path']
    if (!outputPath) this.error('Undefined output file path')

    const format = this.getFileFormat(flags)
    if (flags.prettify && (format === 'csv')) this.error(`Flag ${clColor.cli.flag('Prettify')} can only be used with ${clColor.cli.value('JSON')} format`)

    const resType = flags.type
    if (!clConfig.exports.types.includes(resType)) this.error(`Unsupported resource type: ${clColor.style.error(resType)}`)
    const resDesc = resType.replace(/_/g, ' ')

    const notification = flags.notify || false
    const blindMode = flags.blind || false

    // Include flags
    const include: string[] = this.includeFlag(flags.include)
    // Where flags
    const wheres = this.whereFlag(flags.where)

    const expCreate: ExportCreate = {
      resource_type: resType,
      format,
      dry_data: flags['dry-data']
    }

    if (include && (include.length > 0)) expCreate.includes = include
    if (wheres && (Object.keys(wheres).length > 0)) expCreate.filters = wheres


    try {

      this.commercelayerInit(flags)

      let exp = await this.cl.exports.create(expCreate)

      if (!exp.records_count) {
        this.log(clColor.italic('\nNo records found\n'))
        this.exit()
      } else this.log(`Started export ${clColor.style.id(exp.id)}`)

      let jwtData = clToken.decodeAccessToken(accessToken) as any

      const delay = computeDelay()

      if (!blindMode) cliux.action.start(`Exporting ${resDesc}`, this.exportStatus(exp.status?.replace(/_/g, ' ') || 'waiting'))
      while (!['completed', 'interrupted'].includes(exp.status || '')) {
        jwtData = await this.checkAccessToken(jwtData, flags)
        exp = await this.cl.exports.retrieve(exp.id)
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
      if (this.cl.isApiError(error) && (error.status === 422)) this.handleExportError(error, resDesc)
      else this.handleError(error)
    }

  }

}
