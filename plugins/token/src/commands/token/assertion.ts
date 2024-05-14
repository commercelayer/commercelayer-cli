import { Args, Command, Flags } from '@oclif/core'
import { clOutput } from '@commercelayer/cli-core'


export default class TokenAssertion extends Command {

  static override description = 'generate an assertion to be used with the jwt bearer flow'

  static override examples = [
    'cl token:assertion <customerId> -f <firstName> -l <lastName>'
  ]

  static hidden = true

  static override flags = {
    firstName: Flags.string({
      char: 'f',
      description: 'the customer first name',
      required: true
    }),
    lastName: Flags.string({
      char: 'l',
      description: 'the customer last name',
      required: true
    }),
    json: Flags.boolean({
      char: 'j',
      description: 'print assertion in json format'
    })
  }

  static args = {
    customerId: Args.string({ name: 'customerId', description: 'the customwer id', required: true })
  }


  public async run(): Promise<void> {

    const { args, flags } = await this.parse(TokenAssertion)

    const assertion = this.buildAssertion(args.customerId, flags.firstName, flags.lastName)

    let out: string
    if (flags.json) out = clOutput.printJSON(assertion, { tabSize: 2 })
    else out = clOutput.printObject(assertion)

    this.log()
    this.log(out)
    this.log()

  }


  private buildAssertion(customerId: string, firstName: string, lastName: string): any {
    return {
      'https://commercelayer.io/claims': {
        owner: {
          type: 'Customer',
          id: customerId
        },
        custom_claim: {
          customer: {
            first_name: firstName,
            last_name: lastName
          }
        }
      }
    }
  }

}
