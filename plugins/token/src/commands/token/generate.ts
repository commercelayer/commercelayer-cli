import Command, { Flags } from '../../base'
import { clOutput, clConfig, clToken, type AccessTokenInfo, clColor } from '@commercelayer/cli-core'
import inquirer from 'inquirer'
import { testAccessToken, decodeAccessToken } from '../../token'
import { checkMandatory, checkList, checkValidity } from '../../check'


export default class TokenGenerate extends Command {

  static description = 'start a wizard to generate a custom access token'

  static examples = [
    '$ commercelayer token:generate',
    '$ cl token:generate',
  ]

  static flags = {
    domain: Flags.string({
      char: 'd',
      required: false,
      hidden: true,
      env: 'CL_CLI_DOMAIN',
    }),
    print: Flags.boolean({
      char: 'p',
      description: 'print users answers',
      hidden: true,
    }),
    info: Flags.boolean({
      char: 'i',
      description: 'print generated token info',
    }),
    check: Flags.boolean({
      char: 'c',
      description: 'check generated access token',
    }),
  }

  static args = {}



  async run(): Promise<any> {

    const answers = await inquirer.prompt(this.tokenQuestions(), this.defaultAnswers())
      .then(answers => {
        // answers.domain = domain
        return answers
      })
      .catch(error => {
        const errorMessage = error.isTtyError ? 'The token generation wizard cannot be rendered in the current environment' : error.message
        this.error(errorMessage)
      })


    const { flags } = await this.parse(TokenGenerate)


    if (flags.print) {
      this.log()
      this.log(clOutput.printObject(answers))
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

    const generated = clToken.generateAccessToken(payload, sharedSecret, minutes)


    if (generated) {

      if (flags.check && !await testAccessToken(generated, flags)) this.error('Unable to generate a valid access token with the provided input data')

      const accessToken = generated.accessToken
      const decodedAccessToken = decodeAccessToken(accessToken)

      this.log(`\nAccess token for ${clColor.api.kind(decodedAccessToken.application.kind)} application of organization ${clColor.api.slug(decodedAccessToken.organization.slug)}:`)
      this.printAccessToken(accessToken)

      if (flags.info) {
        const tokenInfo = this.printAccessTokenInfo(decodedAccessToken)
        return `${accessToken}\n${tokenInfo}`
      }
      return accessToken

    }

  }


  private tokenQuestions(): inquirer.QuestionCollection<inquirer.Answers> {
    return [
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
        choices: clConfig.application.kinds,
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
        // choices: ['customers', 'users']
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
    ]
  }


  private defaultAnswers(): Partial<inquirer.Answers> {
    return {
      applicationPublic: true,
      geocoderId: null,
    }
  }

}
