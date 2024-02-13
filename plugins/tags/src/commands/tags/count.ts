import { BaseIdCommand, Flags, cliux } from '../../base'
import Table from 'cli-table3'
import type { CommerceLayerClient } from '@commercelayer/sdk'
import { clColor, clConfig } from '@commercelayer/cli-core'
import type { TaggableResource, TaggableResourceType } from '@commercelayer/sdk/lib/cjs/api'
import type { ApiResource } from '@commercelayer/sdk/lib/cjs/resource'
import type { CommandError } from '@oclif/core/lib/interfaces'



export default class TagsCount extends BaseIdCommand {

	static description = 'count resources tagged with a specific tag'

	static examples = [
		'$ commercelayer tags:count',
		'$ cl tags:count -t <resource-type>'
	]

	static flags = {
		type: Flags.string({
			char: 't',
			description: 'the type of the tagged resources',
			required: false,
      exclusive: ['zero']
		}),
    zero: Flags.boolean({
      char: 'z',
      description: 'show also resources without tags',
      required: false
    })
	}


	async run(): Promise<any> {

		const { args, flags } = await this.parse(TagsCount)

		const resType = flags.type
		if (resType) this.checkResourceType(resType)

		this.commercelayerInit(flags)

    const idOrName = args.id_name
		const tag = await this.checkTag(idOrName, true)
		if (!tag) this.exit()


    const resources: TaggableResourceType[] = (resType? [resType] : clConfig.tags.taggable_resources) as TaggableResourceType[]


		try {

      const taggedResources: Record<string, number> = {}

      cliux.action.start('Fetching taggable resources')
			for (const resource of resources) {
        const client: ApiResource<TaggableResource> = this.cl[resource as keyof CommerceLayerClient] as ApiResource<TaggableResource>
        await client.count({ filters: { tags_id_eq: tag.id } })
          .then(c => { taggedResources[resource] = c })
          .catch(() => { taggedResources[resource] = -1 })
      }
      cliux.action.stop()

      const errors = Object.values(taggedResources).includes(-1)

      const table = new Table({
        head: ['Resource type', 'Tag count'],
        // colWidths: [100, 200],
        style: {
          head: ['brightYellow'],
          compact: false,
        },
      })


      let output = ''

      const rows = Object.entries(taggedResources).filter(([key, val]) => ((val !== 0) || flags.zero || resType))
      if (rows.length === 0) {
        output = 'No resources found with this tag'
      }
      else {
        table.push(...rows.map(([key, val]) => [
              // { content: ++index, hAlign: 'right' as HorizontalAlignment },
              key,
              (val < 0)? clColor.msg.error('Error') : (((val === 0) || !flags.zero)? String(val) : clColor.cyanBright(String(val)))
            ])
        )
        output = table.toString()
      }

      this.log()
      this.log(`${clColor.style.title('Tag name:')} ${tag.name}\t\t${clColor.style.title('Tag ID:')} ${tag.id}`)
      this.log()
      this.log(output)
      this.log()

      if (errors) this.warn('Some errors occurred while fetching taggable resources, please try again later\n')

      return output

		} catch (error) {
			this.handleError(error as CommandError, flags)
		}

	}

}
