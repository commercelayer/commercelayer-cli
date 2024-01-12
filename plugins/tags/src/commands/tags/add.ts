import type { TaggableResource } from '@commercelayer/sdk/lib/cjs/api'
import BaseCommand, { Flags } from '../../base'
import type { CommerceLayerClient, Tag } from '@commercelayer/sdk'
import { clApi, clColor, clText } from '@commercelayer/cli-core'



export default class TagsAdd extends BaseCommand {

  static description = 'add one or more tags to a set of resources'

  static aliases = ['tag']

  static examples = [
    '$ commercelayer tags:add -t <resource-type> -n <tag-names> -i <resources-id>',
    '$ cl tag -t customers -i aBcDeFghIL mnOPqRstUV -n groupA'
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
    create: Flags.string({
      char: 'C',
      description: 'create tags if don\'t exist'
    }),
    verbose: Flags.boolean({
      char: 'v',
      description: 'show details of the tag process'
    })
  }


  public async run(): Promise<void> {

    const { flags } = await this.parse(TagsAdd)

    const resType = flags.type
    this.checkResourceType(resType)

    const nameOrIds = this.filterFlagMulti(flags.name)
    const resources = this.filterFlagMulti(flags.id)

    this.commercelayerInit(flags)

    const tags: Tag[] = []
    for (const tn of nameOrIds) {
      let tag = await this.checkTag(tn, false)
      if (!tag) {
        tag = await this.cl.tags.create({ name: tn })
          .then(t => {
            if (flags.verbose) this.log(`Created tag ${clColor.cli.value(t.name)} with id ${clColor.api.id(t.id)}`)
            return t
          })
          .catch(err => {
            if (flags.verbose) this.warn(`Error creating tag ${clColor.msg.error(tag)}: ${err.message}`)
            return undefined
          })
      }
      if (tag) tags.push(tag)
    }

    if (tags.length === 0) {
      this.log('No new tags to add')
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

      if (resource) { // Found resource to tag

        // Merge tags
        const tagIds = resource.tags? resource.tags.map(t => t.id) : []
        for (const tag of tags) {
          if (!tagIds.includes(tag.id)) {
            tagIds.push(tag.id)
            if (flags.verbose) this.log(`Added tag ${clColor.cli.value(tag.name)} to the ${humanizedAndSingularizedResource} with ID ${clColor.style.id(resource.id)}`)
          }
          else if (flags.verbose) this.log(`${clText.capitalize(humanizedAndSingularizedResource)} ${clColor.style.id(resource.id)} already tagged with tag ${clColor.cli.value(tag.name)}`)
        }
        const newTags = tagIds.map(t => this.cl.tags.relationship(t))

        // Update resource tags
        const updRes = await client.update({ id: resource.id, tags: newTags }).catch((err: unknown) => {
          if (this.cl.isApiError(err)) {
            this.warn(`Unable to update tags of ${humanizedAndSingularizedResource} with ID ${clColor.msg.error(resource.id)}`)
          }
        })

        if (updRes) updatedResources.push(updRes.id)

      }

    }

    if (updatedResources.length > 0) {
      this.log()
      const baseMsg = `${clColor.msg.success('Successfully')} tagged with [${tags.map(t => clColor.cli.value(t.name)).join(', ')}] the `
      if (updatedResources.length === 1)
        this.log(`${baseMsg}${humanizedAndSingularizedResource} with ID ${clColor.style.id(updatedResources[0])}`)
      else
        this.log(`${baseMsg}${clApi.humanizeResource(resType)} with IDs: ${updatedResources.map(t => clColor.style.id(t)).join(', ')}`)
      this.log()
    }
  
  }

}
