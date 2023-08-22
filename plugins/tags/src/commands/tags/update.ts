
import { BaseIdCommand, Flags } from '../../base'
import { clColor } from '@commercelayer/cli-core'



export default class TagsUpdate extends BaseIdCommand {

  static description = 'update an existing tag'

  static examples = [
    '$ commercelayer tags:update <tag-id> -n <tag-name>'
  ]

  static flags = {
    name: Flags.string({
      char: 'n',
      description: 'the new tag name',
      multiple: false,
      required: true
    })
  }


  async run(): Promise<any> {

    const { args, flags } = await this.parse(TagsUpdate)

    // const accessToken = flags.accessToken
    // this.checkApplication(accessToken, ['integration', 'cli'])

    const idName = args.id_name
    
    const tagName = this.checkName(flags.name, true)

    try {

      this.commercelayerInit(flags)
      
      const tag = await this.checkTag(idName, true)
      if (!tag) this.exit()

      const updTag = await this.cl.tags.update({ id: tag.id, name: tagName })

      this.log(`\n${clColor.style.success('Successfully')} updated name of tag with ID ${clColor.style.id(updTag.id)}: ${clColor.dim(tag.name)} --> ${clColor.greenBright(updTag.name)}\n`)

      return updTag

    } catch (error: any) {
      this.handleError(error)
    }

  }

}
