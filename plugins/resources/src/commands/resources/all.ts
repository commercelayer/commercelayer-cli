/* eslint-disable complexity */
import Command, { flags } from '../../base'
import { baseURL } from '../../common'
import cl, { CLayer } from '@commercelayer/js-sdk'
import chalk from 'chalk'
import { denormalize } from '../../jsonapi'
import cliux from 'cli-ux'


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
  }

  static args = [
    ...Command.args,
  ]


  async run() {

    const { args, flags } = this.parse(ResourcesAll)

    if (!flags.save && !flags['save-path']) this.error('Undefined output file path')

    const resource = this.checkResource(args.resource)

    const baseUrl = baseURL(flags.organization, flags.domain)
    const accessToken = flags.accessToken

    // Include flags
    const include: string[] = this.includeValuesArray(flags.include)
    // Fields flags
    const fields = this.mapToSdkParam(this.fieldsValuesMap(flags.fields))
    // Where flags
    const wheres = this.mapToSdkParam(this.whereValuesMap(flags.where))
    // Order flags
    const order = this.mapToSdkParam(this.orderingValuesMap(flags.sort))


    cl.init({ accessToken, endpoint: baseUrl })

    try {

      const resObj: any = (cl as CLayer)[resource.sdk as keyof CLayer]
      let req = resObj

      if (include && (include.length > 0)) req = req.includes(...include)
      if (fields && (fields.length > 0)) req = req.select(...fields)
      if (wheres && (wheres.length > 0)) req = req.where(...wheres)
      if (order && (order.length > 0)) req = req.order(...order)
      req = req.perPage(25)

      const resources: any = []

      let page = 0
      let pages = -1

      const itemsDesc = resource.api.replace(/_/g, ' ')

      const progressBar = cliux.progress({
        format: `Fetching all ${itemsDesc} ... | ${chalk.greenBright('{bar}')} | ${chalk.yellowBright('{percentage}%')} | {value}/{total} | {duration_formatted} | {eta_formatted}`,
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true,
      })

      do {

        /*
        if (page === 0) {
          // eslint-disable-next-line no-await-in-loop
          const res = await req.page(++page).all({ rawResponse: true })
          pages = res.meta.page_count
          pagesLeft = pages - 1
          resources.push(...res.data)
          progressBar.start(res.meta.record_count, res.data.length)
        }

        const calls: Promise<any>[] = []
        for (let p = 0; p < Math.min(10, pagesLeft); p++) {
          calls[p] = req.page(++page).all({ rawResponse: true }).then((res: { data: any; meta: any }) => {
            resources.push(...res.data)
            progressBar.increment(res.data.length)
          })
        }
        pagesLeft -= calls.length
        Promise.all(calls)

        // eslint-disable-next-line no-await-in-loop
        await cliux.wait((pages < 600) ? 2000 : 5000)
        */

        page++

        /* Insert a delay after the first call:
         * 0ms    for  pages <= 50
         * 200ms  for pages within range 51 : 599
         * 500ms  for pages >= 600
        */
        // eslint-disable-next-line no-await-in-loop
        if ((page > 1) && (pages > 50)) await cliux.wait((pages < 600) ? 200 : 500)

        // eslint-disable-next-line no-await-in-loop
        const res = await req.page(page).all({ rawResponse: true })
        pages = res.meta.page_count // pages count can change during extraction

        if (page === 1) {
          this.log()
          progressBar.start(res.meta.record_count, 0)
        } else progressBar.setTotal(res.meta.record_count)

        resources.push(...(flags.raw ? res.data : denormalize(res)))
        progressBar.increment(res.data.length)

      }
      while ((pages === -1) || (page < pages))

      progressBar.stop()

      const out = resources// .map(r => `${r.id};${r.customer_email};${r.metadata.first_name || ''};${r.metadata.last_name || ''};${r.metadata.country_code || ''};${r.metadata.language_code || ''}`)

      if (out.length > 0) {
        if (flags.print) this.printOutput(out, flags)
        this.log(`\nFetched ${chalk.yellowBright(out.length)} ${itemsDesc}\n`)
        if (flags.save || flags['save-path']) this.saveOutput(out, flags)
      } else this.log(chalk.italic('\nNo records found\n'))


      return out

    } catch (error) {
      this.printError(error)
    }

  }

}
