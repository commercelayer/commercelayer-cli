import { clApi, clColor, clConfig, clOutput } from '@commercelayer/cli-core'
import Command, { Args, BaseCommand, cliux } from '../../base'
import type { CommerceLayerClient, QueryPageSize, QueryParamsRetrieve, Version, VersionableResource } from '@commercelayer/sdk'
import inquirer from 'inquirer'


const OPERATION = 'versions'

const VERSIONS_TO_SHOW = clConfig.api.page_max_size as QueryPageSize


type VersionChoice = {
  value: string,
  name: string,
  short?: string
}



export default class ResourcesHistory extends BaseCommand {

  static description = 'show history of a resource'

  static aliases = [OPERATION, 'history', 'rh', 'res:history']

  static examples = [
    '$ commercelayer resources:history customers/<customerId>',
    '$ commercelayer history customers <customerId>',
    '$ cl res:hidtory customers <customerId>',
    '$ clayer rh customers/<customerId>'
  ]

  static flags = {
    ...BaseCommand.flags
  }

  static args = {
    ...Command.args,
    id: Args.string({ name: 'id', description: 'id of the resource to retrieve', required: false })
  }


  async run(): Promise<any> {

    const { args, flags } = await this.parse(ResourcesHistory)

    const resId = this.checkResourceId(args.resource, args.id)
    const resource = this.checkResource(resId.res, { singular: true })

    const cl = this.initCommerceLayer(flags)

    const params: QueryParamsRetrieve<VersionableResource> = {}

    try {

      const resSdk: any = cl[resource.api as keyof CommerceLayerClient]

      this.checkOperation(resSdk, 'versions')

      params.include = ['versions']
      params.fields = { versions: ['id', 'event', 'changes', 'who', 'updated_at'] }

      const res = await resSdk.retrieve(resId.id, params) as VersionableResource

      if (res.versions && (res.versions.length > 0))
      do {

        console.log()
        const versionId = await this.showHistory(res)

        const version = res.versions.find(v => v.id === versionId)

        console.clear()
        console.log()
        console.log(clOutput.printObject(version))

        console.log()
        const k = await cliux.anykey(`Press any key to return to versions history or ${clColor.yellowBright('q')} to exit`)
        if (k !== 'q') console.clear()

      } while (true)
      else this.log(clColor.dim.italic(`\nNo versions found for ${clApi.humanizeResource(res.type, true)} ${clColor.api.id(res.id)}\n`))

    } catch (error: any) {
      this.printError(error, flags, args)
    }

  }


  private async showHistory(res: VersionableResource): Promise<string> {
    const versions: Version[] = (res.versions as Version[]) || []
    const filteredVersions = versions.filter(v => (v.changes && (Object.keys(v.changes).length > 0)))
    const answers = await inquirer.prompt([{
      type: 'list',
      name: 'version',
      message: `Versions history for ${clApi.humanizeResource(res.type, true)} ${clColor.yellowBright(res.id)}:`,
      choices: filteredVersions.map(v => this.changeChoice(v)),
      loop: false,
      pageSize: VERSIONS_TO_SHOW
    }])
    return answers.version
  }


  private changeChoice(version: Version): VersionChoice {
    const timestamp = this.timestamp(version)
    const fields = this.fields(version)
    const author = this.author(version)
    return {
      value: version.id,
      name: `${timestamp}  ${fields.join(', ')}${author? `  ${clColor.dim(`[${author}]`)}` : ''}`,
      short: timestamp
    }
  }


  private timestamp(version: Version): string {
    return version.updated_at.substring(0, 19).replace('T', ' ')
  }


  private author(version: Version): string {
    let author: string = ''
    const who = version.who
    if (who && (Object.keys(who).length > 0)) {
      if (who.worker) author = `Worker: ${who.worker.type}`
      else
      if (who.owner) author = `User: ${who.owner.email}`
      else
      if (who.application) author = `Application: ${who.application.kind}`
    }
    return author
  }


  private fields(version: Version): string[] {
    return version.changes ? Object.keys(version.changes) : []
  }

}
