import Command, { Flags } from '../../base'
import { buildMicrostoreUrl, openMicrostoreUrl } from '../../url'
import { clColor } from '@commercelayer/cli-core'


export default class MicrostoreIndex extends Command {

  static description = 'create Microstore URLs'

  static examples = [
    '$ commercelayer microstore -S <sku-list-id>',
    '$ cl microstore -S <sku-list-id> --all --cart',
    '$ cl microstore -S <sku-list-id> --cart --inline --open',
  ]

  static flags = {
    ...Command.flags,
    skuListId: Flags.string({
      char: 'S',
      description: 'the sku list id',
      required: true,
      multiple: false,
    }),
    all: Flags.boolean({
      char: 'A',
      description: `activate the ${clColor.italic('Buy All')} button `,
    }),
    cart: Flags.boolean({
      char: 'C',
      description: `activate the ${clColor.italic('Cart')} application`,
    }),
    inline: Flags.boolean({
      char: 'I',
      description: `disable redirect to ${clColor.italic('Cart')} application`,
      dependsOn: ['cart'],
    }),
  }


  async run() {

    const { flags } = await this.parse(MicrostoreIndex)

    const organization = flags.organization
    const domain = flags.domain
    const accessToken = flags.accessToken
    const skuListId = flags.skuListId

    this.checkApplication(accessToken, 'sales_channel')


    const cl = this.commercelayerInit(flags)

    // Check SKU list existence
    const skuList = await cl.sku_lists.retrieve(skuListId)
    if (!skuList) this.error(`Inexistent sku list: ${clColor.msg.error(String(skuListId))}`)

    const microstoreUrl = buildMicrostoreUrl(organization, domain, skuListId, accessToken, {
      all: flags.all,
      cart: flags.cart,
      inline: flags.inline,
    })

    this.log(`\nMicrostore URL for sku list ${clColor.api.id(skuListId)}:\n`)
    this.log(clColor.cyanBright(microstoreUrl))
    this.log()

    if (flags.open) await openMicrostoreUrl(microstoreUrl)

  }

}
