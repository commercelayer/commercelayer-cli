/* eslint-disable no-await-in-loop */
import Command from '../../base'
import { ResourceData, SeederResource } from '../../data'
import chalk from 'chalk'
import Listr from 'listr'
import { readResourceData } from '../../data'
import { attributeType, relationshipType } from '../../schema'
import { CommerceLayerStatic } from '@commercelayer/sdk'



export const checkResourceType = (type: string): boolean => {
  if (!CommerceLayerStatic.resources().includes(type)) throw new Error(`Invalid resource type: ${chalk.redBright(type)}`)
  return true
}



export default class SeederCheck extends Command {

  static description = 'execute a check on seeder data'

  static examples = [
    '$ commercelayer seeder:check -u <seedUrl>',
    '$ cl seeder:check -b multi_market',
  ]

  static flags = {
    ...Command.flags,
  }


  async run() {

    const { flags } = this.parse(SeederCheck)

    const organization = flags.organization
    const businessModel = flags.businessModel

    this.log()

    // Initialize OpenAPI schema
    await this.readOpenAPISchema()

    // Read business model data
    const model = await this.readBusinessModelData(flags.url, businessModel)

    // Create tasks
    const tasks = new Listr(model.map(res => {
      return {
        title: `Check ${chalk.italic(res.resourceType)}`,
        task: async (_ctx: any, task: Listr.ListrTaskWrapper<any>) => {
          const origTitle = task.title
          const n = await this.checkResources(res, flags, task)
          task.title = `${origTitle}: [${n}]`
        },
      }
    }), { concurrent: true, exitOnError: false })

    this.log(`Checking data for organization ${chalk.yellowBright(organization)} using business model ${chalk.yellowBright(businessModel)}...\n`)

    // Execute tasks
    tasks.run()
      .then(() => this.log(`\n${chalk.bold.greenBright('SUCCESS')} - Data check completed! \u2705`))
      .catch(() => this.log(`\n${chalk.bold.redBright('ERROR')} - Data check completed with errors`))
      .finally(() => this.log())

  }


  private async checkResource(type: string, res: ResourceData) {

    const resType = res.type || type
    checkResourceType(resType)


    const invalidFields: string[] = []

    for (const field in res) {

      if (['key', 'type'].includes(field)) continue

      const attr = attributeType(type, field)
      if (attr) continue

      const rel = relationshipType(type, field)
      if (rel) {
        if (Array.isArray(res[field])) throw new Error(`Relationship ${type}.${field} cannot be an array`)
      } else invalidFields.push(field)

    }

    if (invalidFields.length > 0) throw new Error(`Invalid fields: ${invalidFields}`)

  }


  private async checkResources(res: SeederResource, flags: any, task: Listr.ListrTaskWrapper): Promise<number> {

    checkResourceType(res.resourceType)

    // Read resource type data
    const resourceData = await readResourceData(flags.url, res.resourceType).catch(() => {
      throw new Error(`Error reading ${chalk.redBright(res.resourceType)} data file`)
    })

    // Build reference keys list
    const referenceKeys = res.importAll ? Object.values(resourceData).map(v => v.reference) : res.referenceKeys
    if (!Array.isArray(referenceKeys)) throw new Error(`Attribute ${chalk.redBright('referenceKeys')} of ${chalk.yellowBright(res.resourceType)} must be an array`)


    for (const r of referenceKeys) {

      task.title = task.title.substring(0, task.title.indexOf(res.resourceType)) + chalk.italic(res.resourceType) + ': ' + r

      // Read resource data
      const resource = resourceData[r]
      if (!resource) throw new Error(`Resource not found in ${res.resourceType} file: ${chalk.redBright(r)}`)


     await this.checkResource(res.resourceType, resource)

    }

    return referenceKeys.length

  }

}

