import { prompt } from 'inquirer'
import _ from 'lodash'
import { emojify } from 'node-emoji'
import validator from 'validator'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

const listOfOptions = [
  { name: emojify(':new: Add application'), value: 'new' },
  { name: emojify(':pencil: Edit an application'), value: 'edit' },
  { name: emojify(':notebook: List all applications'), value: 'list' },
]

const params = [
  'organizationSlug',
  'endpoint',
  'clientId',
  'clientSecret',
  'scope',
]

const questions = params.map((name) => {
  const message =
    name !== 'scope'
      ? `Insert your ${chalk.bold.underline(name)} ${chalk.gray.italic(
          '(required)'
        )}:`
      : `Insert your ${chalk.bold.underline(name)}:`
  return {
    name,
    type: 'input',
    message,
    validate: (value: string) => {
      if (_.isEmpty(value) && name !== 'scope')
        return chalk.red(
          emojify(`:x: The field ${chalk.bold.underline(name)} is required.`)
        )
      if (
        name === 'endpoint' &&
        !validator.isURL(value, { protocols: ['https'] })
      )
        return chalk.red(
          emojify(
            `:x: The field ${chalk.bold.underline(
              name
            )} must be a valid HTTPS URL.`
          )
        )
      if (name === 'organizationSlug' && !validator.isSlug(value))
        return chalk.red(
          emojify(
            `:x: The field ${chalk.bold.underline(
              name
            )} must be a valid slug. ${chalk.gray.italic(
              `(ex: the-blue-brand)`
            )}`
          )
        )
      return true
    },
  }
})

const applications = async () => {
  const root = path.join(process.cwd(), '.commercelayer')
  const config = path.join(root, 'config')
  const applicationsPath = path.join(config, 'applications')
  const { application } = await prompt([
    {
      name: 'application',
      type: 'list',
      message: emojify(`Choose an option :arrow_down: :`),
      choices: listOfOptions,
    },
  ])
  if (application === 'new') {
    const {
      organizationSlug,
      endpoint,
      clientId,
      clientSecret,
      scope,
    } = await prompt(questions)
    const appConfig = {
      organizationSlug,
      endpoint,
      clientId,
      clientSecret,
      scope,
    }
    const content = JSON.stringify(appConfig)
    if (!fs.existsSync(root)) {
      fs.mkdirSync(root)
    }
    if (!fs.existsSync(config)) {
      fs.mkdirSync(config)
    }
    if (!fs.existsSync(applicationsPath)) {
      fs.mkdirSync(applicationsPath)
    }
    const organizationPath = path.join(
      applicationsPath,
      organizationSlug.trim().replace(' ', '-').replace('_', '-')
    )
    if (!fs.existsSync(organizationPath)) {
      fs.mkdirSync(organizationPath)
    } else {
      const { rewrite } = await prompt([
        {
          name: 'rewrite',
          type: 'confirm',
          message: chalk.yellow(
            `Your organization ${chalk.bold.underline(
              organizationSlug
            )} already exists. Would you want to rewrite the configuration?`
          ),
        },
      ])
      if (!rewrite) process.exit(1)
    }
    const appConfigPath = path.join(organizationPath, 'config.json')
    fs.writeFileSync(appConfigPath, content)
    console.log(
      chalk.green(
        emojify(':white_check_mark: Application successfully created.')
      )
    )
  }
}

export default applications
