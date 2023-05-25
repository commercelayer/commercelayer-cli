/* eslint-disable no-await-in-loop */
import Command, { Flags } from '../../base'
import { type BusinessModel, getResource, modelIndex, type ResourceData, type SeederResource, readResourceData } from '../../data'
import Listr from 'listr'
import { attributeType, relationshipType } from '../../schema'
import { CommerceLayerStatic } from '@commercelayer/sdk'
import { clColor, clSymbol } from '@commercelayer/cli-core'



export const checkResourceType = (type: string): boolean => {
  if (!CommerceLayerStatic.resources().includes(type)) throw new Error(`Invalid resource type: ${clColor.msg.error(type)}`)
  return true
}



export default class SeederCheck extends Command {

  static description = 'execute a check on seeder data'

  static examples = [
    '$ commercelayer seeder:check -u <seedUrl>',
    '$ cl seeder:check -b single_sku',
  ]

  static flags = {
    relationships: Flags.boolean({
      char: 'r',
      description: 'check resource relationships',
    }),
  }


  async run(): Promise<any> {

    const { flags } = await this.parse(SeederCheck)

    const businessModel = flags.businessModel
    const name = this.modelNameCheck(flags)

    this.log()

    try {

      // Initialize OpenAPI schema
      await this.readOpenAPISchema()

      // Read business model data
      const model = await this.readBusinessModelData(flags.url, name)

      // Create tasks
      const tasks = new Listr(model.map(res => {
        return {
          title: `Check ${clColor.cli.value(res.resourceType)}`,
          task: async (_ctx: any, task: Listr.ListrTaskWrapper<any>) => {
            const origTitle = task.title
            const n = await this.checkResources(res, flags, task, model).catch(this.handleCommonError)
            task.title = `${origTitle}: [${n}]`
          },
        }
      }), { concurrent: true, exitOnError: false })

      this.log(`Checking business model ${clColor.yellowBright(businessModel)} data...\n`)

      // Execute tasks
      await tasks.run()
        .then(() => { this.log(`\n${clColor.msg.success.bold('SUCCESS')} - Data check completed! ${clSymbol.symbols.check.bkgGreen}`) })
        .catch(() => { this.log(`\n${clColor.msg.error.bold('ERROR')} - Data check completed with errors`) })
        .finally(() => { this.log() })

    } catch (error: any) {
      this.error(error.message)
    }

  }



  private async checkResource(type: string, res: ResourceData, model: BusinessModel, flags: any): Promise<void> {

    const resType = res.type || type
    checkResourceType(resType)

    const invalidFields: string[] = []

    for (const field in res) {

      if (['key', 'type'].includes(field)) continue

      const attr = attributeType(resType, field)
      if (attr) continue

      const val = res[field] as string
      const rel = relationshipType(resType, field, val)
      if (rel) {
        if (Array.isArray(val)) throw new Error(`Relationship ${resType}.${field} cannot be an array`)
        else if (flags.relationships) {
          const relRes = await getResource(flags.url, rel, val)
          if (!relRes) throw new Error(`Resource of type ${clColor.api.resource(rel)} and reference ${clColor.api.resource(val)} not found`)
          if (modelIndex(model, resType, res.reference) < modelIndex(model, rel, val)) throw new Error(`Resource ${rel}.${val} must be created before resource ${type}.${res.reference}`)
        }
      } else invalidFields.push(field)

    }

    if (invalidFields.length > 0) throw new Error(`Invalid fields: ${invalidFields}`)

  }


  private async checkResources(res: SeederResource, flags: any, task: Listr.ListrTaskWrapper, model: BusinessModel): Promise<number> {

    checkResourceType(res.resourceType)

    // Read resource type data
    const resourceData = await readResourceData(flags.url, res.resourceType).catch(() => {
      throw new Error(`Error reading ${clColor.msg.error(res.resourceType)} data file`)
    })

    // Build reference keys list
    const referenceKeys = res.importAll ? Object.values(resourceData).map(v => v.reference) : res.referenceKeys
    if (!Array.isArray(referenceKeys)) throw new Error(`Attribute ${clColor.msg.error('referenceKeys')} of ${clColor.api.resource(res.resourceType)} must be an array`)


    for (const r of referenceKeys) {

      task.title = task.title.substring(0, task.title.indexOf(res.resourceType)) + clColor.italic(res.resourceType) + ': ' + r

      // Read resource data
      const resource = resourceData[r]
      if (!resource) throw new Error(`Resource not found in ${res.resourceType} file: ${clColor.msg.error(r)}`)

      await this.checkResource(res.resourceType, resource, model, flags)

    }

    return referenceKeys.length

  }

}

