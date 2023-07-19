/* eslint-disable no-await-in-loop */
/* eslint-disable max-depth */
/* eslint-disable complexity */
import Command, { Flags, cliux } from '../../base'
import { clApi, clToken, clColor, clUtil, clCommand } from '@commercelayer/cli-core'
import { getAccessToken } from '@commercelayer/cli-core/lib/cjs/token'
import commercelayer, { type CommerceLayerClient, type QueryParamsList } from '@commercelayer/sdk'
import notifier from 'node-notifier'


// const maxPagesWarning = 1000
const maxItemsWarning = 20000
const maxPageItems = 25
const securityInterval = 2
const requestTimeout = { min: 1000, max: 15000 }


const notify = (message: string): void => {
  notifier.notify({
    title: 'Commerce Layer CLI',
    message,
    wait: true,
  })
}

/* eslint-disable no-console,@typescript-eslint/no-empty-function */
const blindProgressBar = {
  start() {},
  stop() {},
  setTotal() {},
  increment() {},
}
/* eslint-enable no-console,@typescript-eslint/no-empty-function */



export default class ResourcesAll extends Command {

  static description = 'fetch all resources'

  static aliases = ['all', 'ra', 'res:all']

  static examples = [
    '$ commercelayer resources:all customers -f id,email,customer_group -i customer_group -s updated_at',
    '$ cl res:all customers -i customer_group -f customer_group -f customer_groups/name -w customer_group_name_eq="GROUP NAME"',
    '$ cl all customers -s -created_at --json',
  ]

  static flags = {
    ...clCommand.commandFlags<typeof Command.flags>(Command.flags, ['headers', 'headers-only']),
    where: Flags.string({
      char: 'w',
      multiple: true,
      description: 'comma separated list of query filters',
    }),
    sort: Flags.string({
      char: 's',
      description: 'defines results ordering',
      multiple: true,
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
    clientId: Flags.string({
      char: 'i',
      description: 'organization client_id',
      hidden: true,
      required: false,
      env: 'CL_CLI_CLIENT_ID',
    }),
    clientSecret: Flags.string({
      char: 's',
      description: 'organization client_secret',
      hidden: true,
      required: false,
      env: 'CL_CLI_CLIENT_SECRET',
    }),
    csv: Flags.boolean({
      char: 'C',
      description: 'export fields in csv format',
      exclusive: ['raw', 'json'],
      dependsOn: ['fields'],
    }),
    delimiter: Flags.string({
      char: 'D',
      // eslint-disable-next-line quotes
      description: `the delimiter character to use in the CSV output file (one of ',', ';', '|', TAB)`,
      options: [',', ';', '|', 'TAB'],
      dependsOn: ['csv'],
    }),
    header: Flags.string({
      char: 'H',
      description: 'rename column headers defining a comma-separated list of values field:"renamed title"',
      dependsOn: ['csv'],
      multiple: true,
    }),
    blind: Flags.boolean({
      char: 'b',
      description: 'execute in blind mode without prompt and progress bar',
    }),
    extract: Flags.string({
      char: 'e',
      description: 'extract subfields from object attributes',
      multiple: true,
      exclusive: ['raw'],
    }),
    timeout: Flags.integer({
      char: 'T',
      description: `set request timeout in milliseconds [${requestTimeout.min} - ${requestTimeout.max}]`,
      hidden: true,
    }),
  }



  async checkAccessToken(jwtData: any, flags: any, client: CommerceLayerClient): Promise<any> {

    if (((jwtData.exp - securityInterval) * 1000) <= Date.now()) {

      await cliux.wait((securityInterval + 1) * 1000)

      const organization = flags.organization
      const domain = flags.domain

      const token = await getAccessToken({
        clientId: flags.clientId || '',
        clientSecret: flags.clientSecret || '',
        slug: organization,
        domain
      })?.catch((error: any) => {
        this.error('Unable to refresh access token: ' + String(error.message))
      })

      const accessToken = token?.accessToken || ''

      client.config({ organization, domain, accessToken })
      jwtData = clToken.decodeAccessToken(accessToken) as any

    }

    return jwtData

  }


  async run(): Promise<any> {

    const { args, flags } = await this.parse(ResourcesAll)

    const accessToken = flags.accessToken
    this.checkApplication(accessToken, ['integration', 'cli'])

    if (!flags.save && !flags['save-path']) this.error('Undefined output file path')

    const resource = this.checkResource(args.resource)

    const organization = flags.organization
    const domain = flags.domain
    let notification = flags.notify
    const blindMode = flags.blind || false

    // Include flags
    const include: string[] = this.includeFlag(flags.include)
    // Fields flags
    const fields = this.fieldsFlag(flags.fields, resource.api)
    // Where flags
    const wheres = this.whereFlag(flags.where)
    // Sort flags
    const sort = this.sortFlag(flags.sort)

    const timeout = flags.timeout || 5000
    if (timeout && ((timeout < requestTimeout.min) || (timeout > requestTimeout.max)))
      this.error(`Invalid timeout: ${clColor.style.error(String(timeout))}. Timeout value must be in range [${requestTimeout.min} - ${requestTimeout.max}]`)


    try {

      const cl = commercelayer({ organization, domain, accessToken, timeout })
      let jwtData = clToken.decodeAccessToken(accessToken)

      const resSdk: any = cl[resource.api as keyof CommerceLayerClient]
      const params: QueryParamsList = {}

      if (include && (include.length > 0)) params.include = include
      if (fields && (Object.keys(fields).length > 0)) params.fields = fields
      if (wheres && (Object.keys(wheres).length > 0)) params.filters = wheres
      if (sort && (Object.keys(sort).length > 0)) params.sort = sort
      else params.sort = { created_at: 'asc' }  // query order issue
      params.pageSize = maxPageItems

      const resources: any = []

      let page = 0
      let pages = -1

      const itemsDesc = resource.api.replace(/_/g, ' ')

      const progressBar = blindMode ? blindProgressBar : cliux.progress({
        format: `Fetching ${itemsDesc} ... | ${clColor.greenBright('{bar}')} | ${clColor.yellowBright('{percentage}%')} | {value}/{total} | {duration_formatted} | {eta_formatted}`,
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
      })


      const delay = clApi.requestRateLimitDelay({
        environment: clApi.execMode(!jwtData.test),
        resourceType: resource.api,
      })


      do {

        page++

        if ((page > 1) && (pages > 50)) await cliux.wait(delay)

        jwtData = await this.checkAccessToken(jwtData, flags, cl)

        params.pageNumber = page

        const res = await resSdk.list(params)
        pages = res.meta.pageCount // pages count can change during extraction
        const recordCount = res.meta.recordCount

        if (recordCount > 0) {

          if (page === 1) {
            if ((recordCount > maxItemsWarning) && !blindMode) {
              this.warn(`You have requested to export more than ${maxItemsWarning} ${itemsDesc} (${recordCount})\nThe process could be ${clColor.underline('very')} slow, we suggest you to add more filters to your request to reduce the number of output ${itemsDesc}`)
              if (!await cliux.confirm(`>> Do you want to continue anyway? ${clColor.dim('[Yy/Nn]')}`)) return
              notification = true
            }
            this.log()
            progressBar.start(recordCount, 0)
            if (blindMode) this.log(`Export of ${recordCount} ${itemsDesc} started`)
          } else progressBar.setTotal(recordCount)

          if (flags.extract) {
            const ext = this.extractFlag(flags.extract)
            res.forEach((r: any) => { this.extractObjectFields(ext, r) })
          }

          resources.push(...res)
          progressBar.increment(res.length)

        }

      }
      while ((pages === -1) || (page < pages))

      progressBar.stop()

      const out = resources
      if (out.meta) delete out.meta


      // Print and save output
      if (out.length > 0) {
        this.log(`\nFetched ${clColor.yellowBright(out.length)} ${itemsDesc}`)
        if (flags.save || flags['save-path']) this.saveOutput(out, flags)
      } else this.log(clColor.italic('\nNo records found\n'))


      // Notification
      const finishMessage = `Export of ${resources.length} ${itemsDesc} is finished!`
      if (blindMode) this.log(finishMessage)
      else
      if (notification) notify(finishMessage)



      return out

    } catch (error) {
      this.printError(error)
      this.log()
    } finally {
      clUtil.resetConsole()
    }

  }

}


// Enable terminal cursor and line wrap in case of process interrupted
process.on('SIGINT', () => {
  clUtil.resetConsole()
  // eslint-disable-next-line no-process-exit
  process.exit()
})
