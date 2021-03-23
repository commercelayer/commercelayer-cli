import {Command, flags} from '@oclif/command'
import { baseURL } from '../common'
import seeder from '@commercelayer/commercelayer-seeder'


export default class Seed extends Command {

  static description = 'Commerce Layer seeder'

  static flags = {
    organization: flags.string({
			char: 'o',
			description: 'the slug of your organization',
			required: true,
		}),
    domain: flags.string({
      char: 'd',
      required: false,
      hidden: true,
      dependsOn: ['organization'],
    }),
    businessModel: flags.string({
      char: 'b',
      description: 'the kind of business model you want to import',
      options: ['multi_market', 'custom'],
      default: 'multi_market',
    }),
    maxItems: flags.string({
      char: 'm',
      description: 'the maximum number of SKUs that will be imported',
      default: 'all',
    }),
    resourcesUrl: flags.string({
      char: 'u',
      description: 'the resources URL or local path',
      default: 'https://data.commercelayer.app/seed',
    }),
    accessToken: flags.string({ hidden: true, required: true }),
    infoLog: flags.boolean({ hidden: true }),
  }


  async run() {

    const {args, flags} = this.parse(Seed)

    const businessModel = flags.businessModel as ('multi_market' | 'custom')
    const maxItems = flags.maxItems
    const resourcesUrl = flags.resourcesUrl
    const accessToken = flags.accessToken || ''
    const endpoint = baseURL(flags.organization, flags.domain)
    const infoLog = flags.infoLog

    this.log('args: ' + Object.keys(args).join(','))
    this.log('flags: ' + Object.keys(flags).join(','))

    this.log('businessModel: ' + businessModel)
    this.log('maxItems: ' + maxItems)
    this.log('resourcesUrl: ' + resourcesUrl)
    this.log('endpoint: ' + endpoint)

    this.log('access_token: ' + accessToken)


    await seeder({
      endpoint,
      businessModel,
      infoLog,
      maxItems: maxItems ? Number(maxItems) : undefined,
      accessToken,
    })

  }

}
