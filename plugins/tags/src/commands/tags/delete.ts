
import Command, { Flags } from '../../base'
import { clColor, clApi, clUtil } from '@commercelayer/cli-core'



export default class TagsDelete extends Command {

  static description = 'delete one or more existing tags'

  static examples = [
    '$ commercelayer tags:delete -n <tag-names>',
    '$ cl tags:delete -n flag1 flag2 flag3'
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

    const { flags } = await this.parse(TagsDelete)

    // const accessToken = flags.accessToken
    // this.checkApplication(accessToken, ['integration', 'cli'])

    const tags = this.filterFlagName(flags.name)

    try {

      this.commercelayerInit(flags)

      const delay = clApi.requestRateLimitDelay({
        totalRequests: tags.length,
        resourceType: 'tags',
        method: 'delete'
      })

      const delTags: string[] = []

      for (const tag of tags) {
        const delTag = await this.checkTag(tag, false)
        if (delTag) {
          await this.cl.tags.delete(delTag.id)
            .then(t => {
              this.log(`Deleted tag ${clColor.cli.value(delTag.name)} with id ${clColor.api.id(delTag.id)}`)
              delTags.push(delTag.name)
              return t
            })
            .catch(err => {
              this.warn(`Error deleting tag ${clColor.msg.error(tag)}: ${err.message}`)
            })
        }
        await clUtil.sleep(delay)
      }


      if (delTags.length > 0)
        this.log(`\n${clColor.style.success('Successfully')} deleted tag${(delTags.length > 1) ? 's' : ''}: ${delTags.join(', ')}\n`)

      return delTags

    } catch (error: any) {
      this.handleError(error)
    }

  }

}
