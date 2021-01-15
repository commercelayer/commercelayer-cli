import { prompt } from 'inquirer'
import _ from 'lodash'
import validator from 'validator'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import newApplication from './new'
import applicationsList from './list'

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

const newApplicationQuestions = params.map(({ slug, label, tip, required }) => {
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
newApplicationQuestions.push(setAsDefault)

const applications = async () => {
  const root = path.join(process.cwd(), '.commercelayer')
  const configPath = path.join(root, 'config')
  const applicationsPath = path.join(configPath, 'applications')
  const defaultPath = path.join(applicationsPath, 'default')
  const { application } = await prompt([
    {
      name: 'application',
      type: 'list',
      message: `Choose an option:`,
      choices: listOfOptions,
    },
  ])
  if (application === 'new')
    await newApplication(newApplicationQuestions, {
      configPath,
      root,
      defaultPath,
      applicationsPath,
    })
  if (application === 'list') applicationsList(applicationsPath)
}

export default applications
