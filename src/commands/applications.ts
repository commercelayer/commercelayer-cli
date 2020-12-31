import { prompt } from 'inquirer'
import _ from 'lodash'
import validator from 'validator'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

const listOfOptions = [
  { name: 'Add application', value: 'new' },
  { name: 'Edit an application', value: 'edit' },
  { name: 'List all applications', value: 'list' },
  { name: 'Remove an application', value: 'remove' },
]

const params = [
  {
    slug: 'organizationSlug',
    label: 'organization slug',
    tip: 'the-blue-brand',
    required: true,
  },
  { slug: 'clientId', label: 'Client ID', required: true },
  { slug: 'clientSecret', label: 'Client Secret', required: true },
  { slug: 'scope', label: 'scope', tip: 'market:19' },
]

const questions = params.map(({ slug, label, tip, required }) => {
  const tipMessage = !tip ? ':' : `: ${chalk.grey.italic(`(${tip})`)}`
  const message = `Insert your ${chalk.bold(label)}${tipMessage}`
  return {
    name: slug,
    type: 'input',
    message,
    validate: (value: string) => {
      if (_.isEmpty(value) && required) return chalk.red(`Can't be blank.`)
      if (slug === 'organizationSlug' && !validator.isSlug(value))
        return chalk.red(`Must be a valid slug.`)
      return true
    },
  }
})

const setAsDefault: any = {
  name: 'setAsDefault',
  type: 'confirm',
  message: 'Do you want to set your organization as default?',
}
questions.push(setAsDefault)

const applications = async () => {
  const root = path.join(process.cwd(), '.commercelayer')
  const config = path.join(root, 'config')
  const applicationsPath = path.join(config, 'applications')
  const defaultPath = path.join(applicationsPath, 'default')
  const { application } = await prompt([
    {
      name: 'application',
      type: 'list',
      message: `Choose an option:`,
      choices: listOfOptions,
    },
  ])
  if (application === 'new') {
    const {
      organizationSlug,
      clientId,
      clientSecret,
      scope,
      setAsDefault,
    } = await prompt(questions)
    const appConfig = {
      organizationSlug,
      endpoint: `https://${organizationSlug}.commercelayer.io`,
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
    if (!fs.existsSync(defaultPath)) {
      fs.mkdirSync(defaultPath)
    }
    if (!fs.existsSync(applicationsPath)) {
      fs.mkdirSync(applicationsPath)
    }
    const organizationPath = path.join(applicationsPath, organizationSlug)
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
    if (setAsDefault) {
      const appConfigPath = path.join(defaultPath, 'config.json')
      fs.writeFileSync(appConfigPath, content)
      console.log(chalk.green('Application is set as default.'))
    }
    const appConfigPath = path.join(organizationPath, 'config.json')
    fs.writeFileSync(appConfigPath, content)
    console.log(chalk.green('Application successfully created.'))
  }
}

export default applications
