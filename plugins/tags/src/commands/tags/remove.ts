import type { TaggableResource } from '@commercelayer/sdk/lib/cjs/api'
import BaseCommand, { Flags } from '../../base'
import type { CommerceLayerClient, Tag } from '@commercelayer/sdk'
import { clApi, clColor, clText } from '@commercelayer/cli-core'



export default class TagsRemove extends BaseCommand {

  static description = 'remove one or more tags to a set of resources'

  static aliases = ['tag']

  static examples = [
    '$ commercelayer tags:remove -t <resource-type> -n <tag-names> -i <resources-id>',
    '$ cl tags:rm -t customers -i aBcDeFghIL mnOPqRstUV -n groupA'
  ]


  static flags = {
    name: Flags.string({
      char: 'n',
      description: 'the tag name',
      multiple: true,
      required: true
    }),
    type: Flags.string({
      char: 't',
      description: 'the type of the resource to tag',
      required: true
    }),
    id: Flags.string({
      char: 'i',
      description: 'the IDs of th eresources to tag',
      multiple: true,
      required: true
    }),
    verbose: Flags.boolean({
      char: 'v',
      description: 'show details of the tag process'
    })
  }


  public async run(): Promise<void> {

    const { flags } = await this.parse(TagsRemove)

    const resType = flags.type
    this.checkResourceType(resType)

    const nameOrIds = this.filterFlagMulti(flags.name)
    const resources = this.filterFlagMulti(flags.id)

    this.commercelayerInit(flags)

    const tags: Tag[] = []
    for (const tn of nameOrIds) {
      const tag = await this.checkTag(tn, false)
      if (tag) tags.push(tag)
    }

    if (tags.length === 0) {
      this.log('No tags to remove')
      this.exit()
    }


    const client: any = this.cl[resType as keyof CommerceLayerClient]

    const updatedResources = []
    const humanizedAndSingularizedResource = clApi.humanizeResource(clText.singularize(resType))
    for (const res of resources) {

      const resource: TaggableResource = await client.retrieve(res, { include: ['tags'] }).catch((err: unknown) => {
        if (this.cl.isApiError(err) && (err.status === 404)) {
          this.warn(`Resource of type ${clColor.api.resource(resType)} not found: ${clColor.msg.error(res)}`)
        }
      })

      if (resource) { // Found resource to de-tag

        if (!resource.tags || (resource.tags.length === 0)) {
          if (flags.verbose) this.log(`${clText.capitalize(humanizedAndSingularizedResource)} with ID ${clColor.style.id(resource.id)} has no tags`)
          continue
        }

        // Merge tags
        const tagIds = resource.tags.map(t => t.id)
        for (const tag of tags) {
          const oldTagIdx = tagIds.indexOf(tag.id)
          if (oldTagIdx > -1) {
            tagIds.splice(oldTagIdx, 1)
            if (flags.verbose) this.log(`Removed tag ${clColor.cli.value(tag.name)} from the ${humanizedAndSingularizedResource} with ID ${clColor.style.id(resource.id)}`)
          }
          else if (flags.verbose) this.log(`${clText.capitalize(humanizedAndSingularizedResource)} ${clColor.style.id(resource.id)} not tagged with tag ${clColor.cli.value(tag.name)}`)
        }
        const newTags = tagIds.map(t => this.cl.tags.relationship(t))

        // Update resource tags
        const taggedResource = await client.update({ id: resource.id, tags: newTags }).catch((err: unknown) => {
          if (this.cl.isApiError(err)) {
            this.warn(`Unable to update tags of ${humanizedAndSingularizedResource} with ID ${clColor.msg.error(resource.id)}`)
          }
        })

        if (taggedResource) updatedResources.push(taggedResource.id)

      }

    }

    if (updatedResources.length > 0) {
      this.log()
      const baseMsg = `${clColor.msg.success('Successfully')} removed tags [${tags.map(t => clColor.cli.value(t.name)).join(', ')}] from the `
      if (updatedResources.length === 1)
        this.log(`${baseMsg}${humanizedAndSingularizedResource} with ID ${clColor.style.id(updatedResources[0])}`)
      else
        this.log(`${baseMsg}${clApi.humanizeResource(resType)} with IDs: ${updatedResources.map(t => clColor.style.id(t)).join(', ')}`)
      this.log()
    }

  }

}
