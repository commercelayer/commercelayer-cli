import { Command, flags } from '@oclif/command'
import { CommerceLayerStatic } from '@commercelayer/sdk'
import { appKey, execMode, maxLength } from '../../common'
import chalk from 'chalk'
import { ConfigParams, AppAuth, createConfigDir, configFileExists, writeConfigFile, writeTokenFile, configParam, AppInfo, readConfigDir } from '../../config'
import { inspect } from 'util'
import { checkScope, getAccessToken, getApplicationInfo } from './login'
import { IConfig } from '@oclif/config'
import inquirer from 'inquirer'


export default class ApplicationsAdd extends Command {

  static description = 'add a new Commerce Layer application to CLI config'

  static aliases = ['app:add']

  static examples = [
    '$ commercelayer applications:add -o <organizationSlug> -i <clientId> -s <clientSecret> -a <applicationAlias>',
  ]

  static flags = {
    organization: flags.string({
      char: 'o',
      description: 'organization slug',
      required: true,
    }),
    clientId: flags.string({
      char: 'i',
      description: 'application client_id',
      required: true,
    }),
    clientSecret: flags.string({
      char: 's',
      description: 'application client_secret',
      required: false,
    }),
    domain: flags.string({
      char: 'd',
      description: 'api domain',
      required: false,
      hidden: true,
      dependsOn: ['organization'],
    }),
    scope: flags.string({
      char: 'S',
      description: 'access token scope (market, stock location)',
      required: false,
      multiple: true,
    }),
    email: flags.string({
      char: 'e',
      description: 'customer email',
      dependsOn: ['password'],
    }),
    password: flags.string({
      char: 'p',
      description: 'customer secret password',
      dependsOn: ['email'],
    }),
    alias: flags.string({
      char: 'a',
      description: 'the alias you want to associate to the application',
      multiple: false,
      required: true,
    }),
  }


  async run() {

    const { flags } = this.parse(ApplicationsAdd)

    if (!flags.clientSecret && !flags.scope)
      this.error(`You must provide one of the arguments ${chalk.italic('clientSecret')} and ${chalk.italic('scope')}`)

    const scope = checkScope(flags.scope)

    const config: AppAuth = {
      clientId: flags.clientId,
      clientSecret: flags.clientSecret,
      slug: flags.organization,
      domain: flags.domain,
      scope,
      email: flags.email,
      password: flags.password,
    }


    try {

      const token = await getAccessToken(config)

      const app = await getApplicationInfo(config, token?.accessToken || '')

      const typeCheck = configParam(ConfigParams.applicationTypeCheck)
      if (typeCheck) {
        if (!typeCheck.includes(app.kind)) this.error(`The credentials provided are associated to an application of type ${chalk.red.italic(app.kind)} while the only allowed types are: ${chalk.green.italic(typeCheck.join(','))}`,
          { suggestions: [`Double check your credentials or access the online dashboard of ${chalk.bold(app.organization)} and create a new valid application `] }
        )
      }
      app.key = appKey(app.slug, flags.domain)
      app.alias = flags.alias || ''

      createConfigDir(this.config)

      if (configFileExists(this.config, app)) {
        this.warn('\nThe application has already been added to the CLI\n')
        return
      }

      writeConfigFile(this.config, app)

      writeTokenFile(this.config, app, token?.data)

      this.log(`\n${chalk.bold.greenBright('Login successful!')} The new abblication has been successfully added to the CLI\n`)

    } catch (error: any) {
      this.log(chalk.bold.redBright('Login failed!'))
      if (CommerceLayerStatic.isApiError(error)) this.error(inspect(error.errors, false, null, true))
      else this.error(error)
    }

  }

}



const promptApplication = async (apps: AppInfo[]) => {

	const appMaxLength = maxLength(apps, 'name') + 2
	const orgMaxLength = maxLength(apps, 'organization')

	const answers = await inquirer.prompt([{
		type: 'list',
		name: 'application',
		message: 'Select an application to switch to:`',
		choices: apps.map(a => {
			return { name: `${a.name.padEnd(appMaxLength, ' ')} [ ${a.organization.padEnd(orgMaxLength, ' ')} | ${a.mode} ]`, value: a }
		}),
		loop: false,
		pageSize: 10,
	}])

	return answers.application

}


const findApplication = async (config: IConfig, flags: any): Promise<AppInfo | undefined> => {

	const organization = flags.organization
	const mode = flags.mode || (flags.live ? execMode(flags.live) : undefined)
	const id = flags.id
	const key = appKey(organization || '', flags.domain)

	let applications = readConfigDir(config, { key, id, mode })

	if (flags.kind) applications = applications.filter(a => a.kind === flags.kind)
	if (flags.alias) applications = applications.filter(a => a.alias === flags.alias)

	let app: AppInfo | undefined

	if (applications.length === 1) app = applications[0]
	else app = await promptApplication(applications)

	return app

}


export { findApplication }
