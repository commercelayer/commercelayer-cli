import Command, { flags } from '../../base'
import { output, command, AccessTokenInfo } from '@commercelayer/cli-core'
import inquirer from 'inquirer'
import chalk from 'chalk'
import { token, config } from '@commercelayer/cli-core'
import { VALIDITY_MIN, VALIDITY_MAX } from '../../token'



const checkMandatory = (input: any) => {
  return (input !== '') || 'The value is mandatory'
}

const checkList = (input: any) => {
  return !input || new RegExp(/^([a-z]+)(,\s*[a-z]+)*$/i).test(input) || 'The value must be a comma separated list of strings'
}

const checkValidity = (mins: string | number) => {
  const n = Number(mins)
  if (!Number.isFinite(n) || (n < 0)) return 'The value must be a positive integer'
  return ((n >= VALIDITY_MIN) && (n <= VALIDITY_MAX)) || `Token expiration time must be between ${chalk.yellowBright(VALIDITY_MIN)} and ${chalk.yellowBright(VALIDITY_MAX)} minutes`
}



export default class TokenGenerate extends Command {

  static description = 'start a wizard to generate a custom access token'

  static examples = [
    '$ commercelayer token:generate',
    '$ cl token:generate',
  ]

  static flags = {
    ...command.commandFlags<typeof Command.flags>(Command.flags, ['organization', 'domain', 'accessToken']),
    domain: flags.string({
      char: 'd',
      required: false,
      hidden: true,
      env: 'CL_CLI_DOMAIN',
    }),
    print: flags.boolean({
      char: 'p',
      description: 'print users answers',
      hidden: true,
    }),
    info: flags.boolean({
      char: 'i',
      description: 'print generated token info',
    }),
    /*
    check: flags.boolean({
      char: 'c',
      description: 'check generated access token',
    }),
    */
  }

  static args = []


  async run() {

    const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'organizationId',
          message: 'Organization ID:',
          validate: checkMandatory,
        },
        {
          type: 'input',
          name: 'organizationSlug',
          message: 'Organization slug:',
          validate: checkMandatory,
        },
        {
          type: 'input',
          name: 'applicationId',
          message: 'Application ID:',
          validate: checkMandatory,
        },
        {
          type: 'list',
          name: 'applicationKind',
          message: 'Application kind:',
          choices: config.application.kinds,
          validate: checkMandatory,
        },
        {
          type: 'confirm',
          name: 'applicationPublic',
          message: 'Public application:',
          default: true,
          askAnswered: false,
          validate: checkMandatory,
        },
        {
          type: 'input',
          name: 'sharedSecret',
          message: 'Shared secret:',
          validate: checkMandatory,
        },
        {
          type: 'input',
          name: 'ownerId',
          message: 'Owner ID:',
        },
        {
          type: 'list',
          name: 'ownerType',
          message: 'Owner type:',
          choices: ['Customer', 'User'],
          when: input => input.ownerId,
          validate: checkMandatory,
        },
        {
          type: 'input',
          name: 'marketIds',
          message: 'Market IDs:',
          validate: checkList,
        },
        {
          type: 'confirm',
          name: 'allowsExternalPrices',
          message: 'Allows external prices:',
          default: false,
          when: input => input.marketIds,
        },
        {
          type: 'input',
          name: 'geocoderId',
          message: 'Geocoder ID:',
          default: null,
          askAnswered: false,
          when: input => input.marketIds,
        },
        {
          type: 'input',
          name: 'priceListId',
          message: 'Price list ID:',
          validate: checkMandatory,
          when: input => input.marketIds,
        },
        {
          type: 'input',
          name: 'stockLocationIds',
          message: 'Stock location IDs:',
          validate: checkList,
          when: input => input.marketIds,
        },
        {
          type: 'list',
          name: 'mode',
          message: 'Environment type:',
          choices: ['test', 'live'],
          default: 'test',
        },
        {
          type: 'input',
          name: 'validity',
          message: 'Token validity minutes:',
          validate: checkValidity,
        },
      ], {
        applicationPublic: true,
        geocoderId: null,
      })
      .then(answers => {
        // answers.domain = domain
        return answers
      })
      .catch(error => {
        const errorMessage = error.isTtyError ? 'The token generation wizard cannot be rendered in the current environment' : error.message
        this.error(errorMessage)
      })


      const { flags } = this.parse(TokenGenerate)


      if (flags.print) {
        this.log()
        this.log(output.printObject(answers))
        this.log()
      }


      const payload: AccessTokenInfo = {
        organization: {
          id: answers.organizationId,
          slug: answers.organizationSlug,
        },
        application: {
          id: answers.applicationId,
          kind: answers.applicationKind,
          public: answers.applicationPublic,
        },
        test: (answers.mode === 'test'),
      }


      if (answers.marketIds !== '') {

        const id = String(answers.marketIds).split(',').map(i => i.trim())
        const slid = answers.stockLocationIds ? String(answers.stockLocationIds).split(',').map(i => i.trim()) : undefined

        payload.market = {
          id,
          stock_location_ids: slid,
          price_list_id: answers.priceListId,
          geocoder_id: answers.geocoderId,
          allows_external_prices: answers.allowsExternalPrices,
        }

      }


      if (answers.ownerId !== '') {
        payload.owner = {
          id: answers.ownerId,
          type: answers.ownerType,
        }
      }


      const sharedSecret = answers.sharedSecret
      const minutes = answers.validity

      const generated = token.generateAccessToken(payload, sharedSecret, minutes)

      if (generated) {
        const accessToken = generated.accessToken
        this.printAccessToken(accessToken)
        if (flags.info) this.printAccessTokenInfo(token.decodeAccessToken(accessToken))
      }

  }

}
