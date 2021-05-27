/* eslint-disable no-await-in-loop */
/* eslint-disable max-depth */
/* eslint-disable complexity */
import Command, { flags } from '../../base'
import { baseURL } from '../../common'
import cl, { CLayer } from '@commercelayer/js-sdk'
import chalk from 'chalk'
import { denormalize } from '../../jsonapi'
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


export default class ResourcesAll extends Command {

  static description = 'fetch all resources'

  static aliases = ['all', 'ra', 'res:all']

  static hidden = true

  static examples = [
    '$ commercelayer resources:all customers -f id,email -i customer_group -s updated_at',
    '$ cl res:all -i customer_group -f customer_groups/name -w customer_group_name_eq="GROUP NAME"',
    '$ cl all -s -created_at --raw',
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
    print: flags.boolean({
      char: 'P',
      description: 'print results on the console',
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
      exclusive: ['include'],
      dependsOn: ['fields'],
    }),
  }

  static args = [
    ...Command.args,
  ]



  async checkAccessToken(jwtData: any, flags: any, baseUrl: string): Promise<any> {

    if (((jwtData.exp - securityInterval) * 1000) <= Date.now()) {

      await cliux.wait((securityInterval + 1) * 1000)

      const token = await getIntegrationToken({
        clientId: flags.clientId || '',
        clientSecret: flags.clientSecret || '',
        endpoint: baseUrl,
      })?.catch(error => {
        this.error('Unable to refresh access token: ' + error.message)
      })

      const accessToken = token?.accessToken || ''
      cl.init({ accessToken, endpoint: baseUrl })
      jwtData = jwt.decode(accessToken) as any

    }

    return jwtData

  }


  async run() {

    const { args, flags } = this.parse(ResourcesAll)

    if (!flags.save && !flags['save-path']) this.error('Undefined output file path')

    const resource = this.checkResource(args.resource)

    const baseUrl = baseURL(flags.organization, flags.domain)
    const accessToken = flags.accessToken
    let notification = flags.notify

    // Include flags
    const include: string[] = this.includeValuesArray(flags.include)
    // Fields flags
    const fields = this.mapToSdkParam(this.fieldsValuesMap(flags.fields))
    // Where flags
    const wheres = this.mapToSdkParam(this.whereValuesMap(flags.where))
    // Order flags
    const order = this.mapToSdkParam(this.orderingValuesMap(flags.sort))


    try {

      const resObj: any = (cl as CLayer)[resource.sdk as keyof CLayer]
      let req = resObj

      if (include && (include.length > 0)) req = req.includes(...include)
      if (fields && (fields.length > 0)) req = req.select(...fields)
      if (wheres && (wheres.length > 0)) req = req.where(...wheres)
      if (order && (order.length > 0)) req = req.order(...order)
      else req = req.order({ created_at: 'asc' })  // query order issue
      req = req.perPage(maxPageItems)

      const resources: any = []

      let page = 0
      let pages = -1

      const itemsDesc = resource.api.replace(/_/g, ' ')

      const progressBar = cliux.progress({
        format: `Fetching ${itemsDesc} ... | ${chalk.greenBright('{bar}')} | ${chalk.yellowBright('{percentage}%')} | {value}/{total} | {duration_formatted} | {eta_formatted}`,
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
      })


      cl.init({ accessToken, endpoint: baseUrl })
      let jwtData = jwt.decode(accessToken) as any

      do {

        page++

        /* Insert a delay after the first call:
         * 0ms    for  pages <= 50
         * 200ms  for pages within range 51 : 599
         * 500ms  for pages >= 600
        */
        if ((page > 1) && (pages > 50)) await cliux.wait((pages < 600) ? 200 : 500)

        jwtData = await this.checkAccessToken(jwtData, flags, baseUrl)

        const res = await req.page(page).all({ rawResponse: true })
        pages = res.meta.page_count // pages count can change during extraction
        const recordCount = res.meta.record_count

        if (recordCount > 0) {

          if (page === 1) {
            if (recordCount > maxItemsWarning) {
              this.warn(`You have requested to export more than ${maxItemsWarning} ${itemsDesc} (${recordCount})\nThe process could be ${chalk.underline('very')} slow, we suggest you to add more filters to your request to reduce the number of output ${itemsDesc}`)
              if (!await cliux.confirm(`>> Do you want to continue anyway? ${chalk.dim('[Yy/Nn]')}`)) return
              notification = true
            }
            this.log()
            progressBar.start(recordCount, 0)
          } else progressBar.setTotal(recordCount)

          resources.push(...(flags.raw ? res.data : denormalize(res)))
          progressBar.increment(res.data.length)

        }

      }
      while ((pages === -1) || (page < pages))

      progressBar.stop()

      const out = resources


      // Print and save output
      if (out.length > 0) {
        if (flags.print) this.printOutput(out, flags)
        this.log(`\nFetched ${chalk.yellowBright(out.length)} ${itemsDesc}`)
        if (flags.save || flags['save-path']) this.saveOutput(out, flags)
      } else this.log(chalk.italic('\nNo records found\n'))


      // Notification
      if (notification) notify(`Export of ${resources.length} ${itemsDesc} is finished!`)


      return out

    } catch (error) {
      this.printError(error)
      this.log()
    } finally {
      resetConsole()
    }

  }

}


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


// Enable terminal cursor and line wrap in case of process interrupted
process.on('SIGINT', () => {
  resetConsole()
  // eslint-disable-next-line no-process-exit
  process.exit()
})
