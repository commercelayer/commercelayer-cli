import { Command, Flags } from '@oclif/core'
import { clColor, clConfig, clOutput, clToken } from '@commercelayer/cli-core'
import type { OwnerType, KeyValString } from '@commercelayer/cli-core'
import { createAssertion, jwtDecode } from '@commercelayer/js-auth'


export default class TokenAssertion extends Command {

  static override description = 'generate an assertion to be used with the jwt bearer flow'

  static override examples = [
    'cl token:assertion -t <Customer|User> -o <ownerId>',
    'cl token:assertion -co <ownerId> -j',
    'cl token:assertion -to <ownerId> -C key1=value1 -C key2=value2 key3=value3',
  ]


  static override flags = {
    ownerId: Flags.string({
      char: 'o',
      description: 'the owner id',
      required: true
    }),
    type: Flags.string({
      char: 't',
      description: 'the type of the owner',
      options: clConfig.api.token_owner_types,
      exactlyOne: ['type', 'customer', 'user']
    }),
    customer: Flags.boolean({
      char: 'c',
      description: "owner of type 'Customer'",
      exclusive: ['user']
    }),
    user: Flags.boolean({
      char: 'u',
      description: "owner of type 'User'",
      exclusive: ['customer'],
    }),
    custom: Flags.string({
      char: 'C',
      description: 'custom claim attribute [key=value]',
      multiple: true
    }),
    json: Flags.boolean({
      char: 'j',
      description: 'print assertion in json format'
    })
  }



  public async run(): Promise<void> {

    const { flags } = await this.parse(TokenAssertion)

    // Owner id
    const ownerId = flags.ownerId

    // Owner type
    let ownerType: OwnerType
    if (flags.customer || (flags.type === 'Customer')) ownerType = 'Customer'
    else if (flags.user || (flags.type === 'User')) ownerType = 'User'
    else this.error('Owner type not defined')

    // Custom claim
    const customClaim = this.customFlag(flags.custom)

    const payload = clToken.buildAssertionPayload(ownerType, ownerId, customClaim)

    const assertion = await createAssertion({ payload })

    if (flags.json) this.log(`\n${clOutput.printJSON(jwtDecode(assertion), { tabSize: 2 })}\n`)

    console.log()
    console.log(clColor.style.title('-= Assertion =-'))
    console.log()
    console.log(assertion)
    console.log()

  }


  private customFlag(flag: string[] | undefined): KeyValString {

    const param: KeyValString = {}

    if (flag && (flag.length > 0)) {
      flag.forEach(f => {

        const eqi = f.indexOf('=')
        if (eqi < 1) this.error(`Invalid custom claim attribute ${clColor.msg.error(f)}`, {
          suggestions: [`Custom claim attributes flags must be defined using the format ${clColor.cli.value('name=value')}`],
        })

        const name = f.slice(0, eqi)
        const value = f.slice(eqi + 1)

        if (param[name]) this.warn(`Custom claim attribute ${clColor.msg.warning(name)} has already been defined`)

        param[name] = value

      })
    }

    return param

  }

}
