
import type { CommandError } from '@oclif/core/lib/interfaces'
import Command, { Flags } from '../../base'
import { clColor, clApi, clUtil } from '@commercelayer/cli-core'



export default class TagsCreate extends Command {

  static description = 'create one or more new tags'

  static examples = [
    '$ commercelayer tags:create -n <tag-names>',
    '$ cl tags:create -n flag1 flag2 flag3'
  ]

  static flags = {
    name: Flags.string({
      char: 'n',
      description: 'the tag name',
      multiple: true,
      required: true
    })
  }


  async run(): Promise<any> {

    const { flags } = await this.parse(TagsCreate)

    //  const accessToken = flags.accessToken
    // this.checkApplication(accessToken, ['integration', 'cli'])

    const tags = this.filterFlagName(flags.name)

    try {

      this.commercelayerInit(flags)

      const delay = clApi.requestRateLimitDelay({
        totalRequests: tags.length,
        resourceType: 'tags',
      })

      const newTags: string[] = []

      for (const tag of tags) {
        await this.cl.tags.create({ name: tag })
          .then(t => {
            this.log(`Created tag ${clColor.cli.value(t.name)} with id ${clColor.api.id(t.id)}`)
            newTags.push(t.name)
            return t
          })
          .catch(err => {
            this.warn(`Error creating tag ${clColor.msg.error(tag)}: ${err.message}`)
          })
        await clUtil.sleep(delay)
      }


      if (newTags.length > 0)
        this.log(`\n${clColor.style.success('Successfully')} created new tag${(newTags.length > 1) ? 's' : ''}: ${newTags.join(', ')}\n`)

      return newTags

    } catch (error) {
      this.handleError(error as CommandError)
    }

  }

}
