import type { CommerceLayerClient } from '@commercelayer/sdk'
import Command, { BaseCommand } from '../../base'
import { clApi, clColor, clText } from '@commercelayer/cli-core'



export default class ResourcesLast extends BaseCommand {

  static description = 'show the last id of a resource type'

  static aliases = ['last', 'res:last']

  static examples = [
    '$ commercelayer resources:last customers',
    '$ commercelayer last customer',
    '$ cl res:last customers'
  ]

  static flags = {
    ...BaseCommand.flags
  }

  static args = {
    ...Command.args
  }


  async run(): Promise<any> {

    const { args, flags } = await this.parse(ResourcesLast)

    const resource = this.checkResource(args.resource, { singular: true })


    try {

      const last = this.lastResources(flags.organization)[resource.api]

      let id = clColor.dim('none')
      let label = ''

      if (last) { // Retrieve last resource

        id = clColor.yellowBright(last)

        const cl = this.initCommerceLayer(flags)
        const resSdk: any = cl[resource.api as keyof CommerceLayerClient]

        const res = await resSdk.retrieve(last).catch(() => { /* do nothing */ })

        if (res) {
          const fields = ['reference', 'name', 'code', 'number', 'email', 'label', 'description']
          for (const f of fields) {
            if (f in res) {
              const v = res[f]
              const value = v?.includes(' ') ? `'${v}'` : v
              if (value) {
                label = `${clText.capitalize(clApi.humanizeResource(resource.name))} ${f}: ${clColor.cli.value(value)}`
                break
              }
            }
          }
        }

      }

      this.log(`\n${clColor.api.resource(resource.api)} last ID: ${id}\n`)
      if (label) this.log(`[ ${label} ]\n`)

    } catch (error: any) {
      this.printError(error, flags, args)
    }

  }

}
