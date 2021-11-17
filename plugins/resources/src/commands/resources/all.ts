/* eslint-disable no-await-in-loop */
/* eslint-disable max-depth */
/* eslint-disable complexity */
import Command, { flags } from '../../base'
import { baseURL } from '../../common'
import commercelayer, { CommerceLayerClient, QueryParamsList } from '@commercelayer/sdk'
import chalk from 'chalk'
import cliux from 'cli-ux'
import notifier from 'node-notifier'
import jwt from 'jsonwebtoken'
import { getIntegrationToken } from '@commercelayer/js-auth'


// const maxPagesWarning = 1000
const maxItemsWarning = 20000
const maxPageItems = 25
const securityInterval = 2


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


const resetConsole = () => {

  // Cursor
  // const showCursor = '\u001B[?25l'  // \x1B[?25l
  const showCursor = '\u001B[?25h' // \x1B[?25h

  // Line wrap
  // const lineWrap = '\u001B[?7l'  // \x1B[?7l
  const lineWrap = '\u001B[?7h' // \x1B[?7h

  // eslint-disable-next-line no-console
  // console.log(`${showCursor}${lineWrap}`)
  process.stdout.write(`${showCursor}${lineWrap}`)

}


export default class ResourcesAll extends Command {

  static description = 'fetch all resources'

  static aliases = ['all', 'ra', 'res:all']

  static hidden = true

  static examples = [
    '$ commercelayer resources:all customers -f id,email -i customer_group -s updated_at',
    '$ cl res:all -i customer_group -f customer_groups/name -w customer_group_name_eq="GROUP NAME"',
    '$ cl all -s -created_at --json',
  ]

  static flags = {
    ...Command.flags,
    include: flags.string({
      char: 'i',
      multiple: true,
      description: 'comma separated resources to include',
    }),
    fields: flags.string({
      char: 'f',
      multiple: true,
      description: 'comma separeted list of fields in the format [resource]=field1,field2...',
    }),
    where: flags.string({
      char: 'w',
      multiple: true,
      description: 'comma separated list of query filters',
    }),
    sort: flags.string({
      char: 's',
      description: 'defines results ordering',
      multiple: true,
    }),
    save: flags.string({
      char: 'x',
      description: 'save command output to file',
      multiple: false,
      exclusive: ['save-path'],
    }),
    'save-path': flags.string({
      char: 'X',
      description: 'save command output to file and create missing path directories',
      multiple: false,
      exclusive: ['save'],
    }),
    notify: flags.boolean({
      char: 'N',
      description: 'force system notification when export has finished',
      hidden: true,
    }),
    clientId: flags.string({
      char: 'i',
      description: 'organization client_id',
      hidden: true,
      required: false,
      env: 'CL_CLI_CLIENT_ID',
    }),
    clientSecret: flags.string({
      char: 's',
      description: 'organization client_secret',
      hidden: true,
      required: false,
      env: 'CL_CLI_CLIENT_SECRET',
    }),
    csv: flags.boolean({
      char: 'C',
      description: 'export fields in csv format',
      exclusive: ['raw', 'json'],
      dependsOn: ['fields'],
    }),
    header: flags.string({
      char: 'H',
      description: 'rename column headers defining a comma-separated list of values field:"renamed title"',
      dependsOn: ['csv'],
      multiple: true,
    }),
    blind: flags.boolean({
      char: 'b',
      description: 'execute in blind mode without prompt and progress bar',
    }),
    extract: flags.string({
      char: 'e',
      description: 'extract subfields from object attributes',
      multiple: true,
      exclusive: ['raw'],
    }),
  }

  static args = [
    ...Command.args,
  ]



  async checkAccessToken(jwtData: any, flags: any, client: CommerceLayerClient): Promise<any> {

    if (((jwtData.exp - securityInterval) * 1000) <= Date.now()) {

      await cliux.wait((securityInterval + 1) * 1000)

      const organization = flags.organization
      const domain = flags.domain

      const token = await getIntegrationToken({
        clientId: flags.clientId || '',
        clientSecret: flags.clientSecret || '',
        endpoint: baseURL(organization, domain),
      })?.catch(error => {
        this.error('Unable to refresh access token: ' + error.message)
      })

      const accessToken = token?.accessToken || ''

      client.config({ organization, domain, accessToken })
      jwtData = jwt.decode(accessToken) as any

    }

    return jwtData

  }


  async run() {

    const { args, flags } = this.parse(ResourcesAll)

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


    try {

      const cl = commercelayer({ organization, domain, accessToken })
      let jwtData = jwt.decode(accessToken) as any

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
        format: `Fetching ${itemsDesc} ... | ${chalk.greenBright('{bar}')} | ${chalk.yellowBright('{percentage}%')} | {value}/{total} | {duration_formatted} | {eta_formatted}`,
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
      })


      do {

        page++

        /* Insert a delay after the first call:
         * 0ms    for  pages <= 50
         * 200ms  for pages within range 51 : 599
         * 500ms  for pages >= 600
        */
        if ((page > 1) && (pages > 50)) await cliux.wait((pages < 600) ? 200 : 500)

        jwtData = await this.checkAccessToken(jwtData, flags, cl)

        params.pageNumber = page

        const res = await resSdk.list(params)
        pages = res.meta.pageCount // pages count can change during extraction
        const recordCount = res.meta.recordCount

        if (recordCount > 0) {

          if (page === 1) {
            if ((recordCount > maxItemsWarning) && !blindMode) {
              this.warn(`You have requested to export more than ${maxItemsWarning} ${itemsDesc} (${recordCount})\nThe process could be ${chalk.underline('very')} slow, we suggest you to add more filters to your request to reduce the number of output ${itemsDesc}`)
              if (!await cliux.confirm(`>> Do you want to continue anyway? ${chalk.dim('[Yy/Nn]')}`)) return
              notification = true
            }
            this.log()
            progressBar.start(recordCount, 0)
            if (blindMode) this.log(`Export of ${recordCount} ${itemsDesc} started`)
          } else progressBar.setTotal(recordCount)

          if (flags.extract) {
            const ext = this.extractFlag(flags.extract)
            res.forEach((r: any) => this.extractObjectFields(ext, r))
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
        this.log(`\nFetched ${chalk.yellowBright(out.length)} ${itemsDesc}`)
        if (flags.save || flags['save-path']) this.saveOutput(out, flags)
      } else this.log(chalk.italic('\nNo records found\n'))


      // Notification
      const finishMessage = `Export of ${resources.length} ${itemsDesc} is finished!`
      if (notification && !blindMode) notify(finishMessage)
      else
      if (blindMode) this.log(finishMessage)


      return out

    } catch (error) {
      this.printError(error)
      this.log()
    } finally {
      resetConsole()
    }

  }

}


// Enable terminal cursor and line wrap in case of process interrupted
process.on('SIGINT', () => {
  resetConsole()
  // eslint-disable-next-line no-process-exit
  process.exit()
})
