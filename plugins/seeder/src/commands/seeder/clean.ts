/* eslint-disable no-await-in-loop */
import Command, { Flags } from '../../base'
import Listr from 'listr'
import { readResourceData, SeederResource } from '../../data'
import { CommerceLayerClient, CommerceLayerStatic } from '@commercelayer/sdk'
import { checkResourceType } from './check'
import { clColor, clUtil } from '@commercelayer/cli-core'
import { requestsDelay } from '../../common'


export default class SeederClean extends Command {

  static description = 'clean previously imported seeder data'

  static flags = {
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

  static examples = [
    '$ commercelayer seeder:clean -u <seedUrl>',
    '$ cl seeder:clean -b multi_market',
  ]


  async run(): Promise<any> {

    const { flags } = await this.parse(SeederClean)

    const organization = flags.organization
    const businessModel = flags.businessModel
    const name = this.modelNameCheck(flags)

    this.initCommerceLayer(flags)

    this.log()

    try {

      // Read business model data
      const model = await this.readBusinessModelData(flags.url, name)

      // Delete resource in reverse order
      const resources = model.reverse()

      // Create tasks
      const tasks = new Listr(resources.map(res => {
        return {
          title: `Delete ${clColor.italic(res.resourceType)}`,
          task: async (_ctx: any, task: Listr.ListrTaskWrapper<any>) => {
            const origTitle = task.title
            const n = await this.deleteResources(res, flags, task)
            task.title = `${origTitle}: [${n}]`
          },
        }
      }), { concurrent: false, exitOnError: true })

      this.log(`Cleaning data for organization ${clColor.api.organization(organization)} using business model ${clColor.yellowBright(businessModel)}...\n`)

      // Execute tasks
      await tasks.run()
        .then(() => this.log(`\n${clColor.msg.success.bold('SUCCESS')} - Data cleaning completed! \u2705`))
        .catch(() => this.log(`\n${clColor.msg.error.bold('ERROR')} - Data cleaning not completed, correct errors and rerun the ${clColor.cli.command('clean')} command`))
        .finally(() => this.log())

    } catch (error: any) {
      this.error(error.message)
    }

  }


  private async deleteResources(res: SeederResource, flags: any, task: Listr.ListrTaskWrapper): Promise<number> {

    checkResourceType(res.resourceType)


    // Read resource type data
    const resourceData = await readResourceData(flags.url, res.resourceType).catch(() => {
      throw new Error(`Error reading ${clColor.msg.error(res.resourceType)} data file`)
    })

    // Build reference keys list
    const referenceKeys = res.importAll ? Object.values(resourceData).map(v => v.reference) : res.referenceKeys
    if (!Array.isArray(referenceKeys)) throw new Error(`Attribute ${clColor.msg.error('referenceKeys')} of ${clColor.api.resource(res.resourceType)} must be an array`)


    const delay = requestsDelay(referenceKeys.length, res.resourceType)

    for (const ref of referenceKeys) {

      task.title = task.title.substring(0, task.title.indexOf(res.resourceType)) + clColor.italic(res.resourceType) + ': ' + ref

      // Read resource data
      const resource = resourceData[ref]
      const type = resource?.type || res.resourceType

      const remoteRes = await this.findByReference(type, ref)
      if (remoteRes) await this.deleteResource(remoteRes.type, remoteRes.id)

      if (delay > 0) await clUtil.sleep(delay)

    }

    return referenceKeys.length

  }


  private async deleteResource(type: string, id: string): Promise<void> {

    checkResourceType(type)

    const resSdk: any = this.cl[type as keyof CommerceLayerClient]

    await resSdk.delete(id).catch((error: any) => {
      if (CommerceLayerStatic.isApiError(error)) {
        const err = error.first()
        if (err) throw new Error(`${err.code}: ${err.detail}${err.meta?.value ? ` (${err.meta?.value})` : ''}`)
        else throw new Error(`Error deleting resource of type ${type} and id ${id} [${error.code}]`)
      } else throw error
    })

  }

}
