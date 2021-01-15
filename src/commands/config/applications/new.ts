import { GeneralQuestions } from '#typings'
import fs from 'fs'
import path from 'path'
import { prompt } from 'inquirer'
import chalk from 'chalk'

type Config = {
  root: string
  defaultPath: string
  applicationsPath: string
  configPath: string
}

type NewApplication = (
  questions: GeneralQuestions,
  config: Config
) => Promise<void>

const newApplication: NewApplication = async (questions, config) => {
  const {
    organizationSlug,
    clientId,
    clientSecret,
    scope,
    setAsDefault,
  } = await prompt(questions)
  const { root, configPath, applicationsPath, defaultPath } = config
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
  if (!fs.existsSync(configPath)) {
    fs.mkdirSync(configPath)
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

export default newApplication
