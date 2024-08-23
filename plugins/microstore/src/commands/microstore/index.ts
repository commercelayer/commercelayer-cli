import Command, { Flags } from '../../base'
import { buildMicrostoreUrl, openMicrostoreUrl } from '../../url'
import { clColor } from '@commercelayer/cli-core'


export default class MicrostoreIndex extends Command {

  static description = 'create Microstore URLs'

  static examples = [
    '$ commercelayer microstore -S <sku-list-id>',
    '$ cl microstore -S <sku-list-id> --all --cart',
    '$ cl microstore -S <sku-list-id> --cart --inline --open'
  ]

  static flags = {
    ...Command.flags,
    skuListId: Flags.string({
      char: 'S',
      description: 'the sku list id',
      required: true,
      multiple: false
    }),
    all: Flags.boolean({
      char: 'A',
      description: `activate the ${clColor.italic('Buy All')} button `
    }),
    cart: Flags.boolean({
      char: 'C',
      description: `activate the ${clColor.italic('Cart')} application`
    }),
    inline: Flags.boolean({
      char: 'I',
      description: `disable redirect to ${clColor.italic('Cart')} application`,
      dependsOn: ['cart']
    })
  }


  async run(): Promise<any> {

    const { flags } = await this.parse(MicrostoreIndex)

    const organization = flags.organization
    const domain = flags.domain
    const staging = flags.staging
    const accessToken = flags.accessToken
    const skuListId = flags.skuListId

    this.checkAcessTokenData(accessToken, flags)


    const cl = this.commercelayerInit(flags)

    // Check SKU list existence
    const skuList = await cl.sku_lists.retrieve(skuListId)
    if (!skuList) this.error(`Inexistent sku list: ${clColor.msg.error(String(skuListId))}`)

    /*
    if (flags.link) {

      const now = new Date()
      const expires = new Date(now.setDate(now.getDate() + 30)).toISOString()

      const link: LinkCreate = {
        client_id: this.checkRequiredAttribute(flags, 'client_id'),
        scope: this.checkRequiredAttribute(flags, 'scope'),
        name: `${flags.name || skuList.name} link`,
        starts_at: now.toISOString(),
        expires_at: this.checkRequiredAttribute(flags, 'expires', expires),
        item: cl.sku_lists.relationship(skuList)
      }

      const newLink = await cl.links.create(link)

      this.log(`\n${clColor.style.success('Successfully')} created new link with id ${clColor.style.id(newLink.id)} for the sku list ${clColor.cli.value(skuList.name)}\n`)

      const url = newLink.url
      if (!url) this.error('Link created but no URL provided')

      this.log(`\nLink URL for sku list ${clColor.api.id(skuListId)}:\n`)
      this.log(clColor.cyanBright(url))
      this.log()

      if (flags.open) await openMicrostoreUrl(url)

    } else {
    */
    const microstoreUrl = buildMicrostoreUrl(organization, skuListId, accessToken, {
      all: flags.all,
      cart: flags.cart,
      inline: flags.inline,
      domain,
      staging
    })

    this.log(`\nMicrostore URL for sku list ${clColor.api.id(skuListId)}:\n`)
    this.log(clColor.cyanBright(microstoreUrl))
    this.log()

    if (flags.open) await openMicrostoreUrl(microstoreUrl)

    // }

  }

}
