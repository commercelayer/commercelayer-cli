import { GeneralQuestions } from '#typings'
import fs from 'fs'
import { prompt } from 'inquirer'
import { join } from 'path'
import chalk from 'chalk'

type ApplicationEdit = (params: {
  defaultPath: string
  path: string
  questions: GeneralQuestions
}) => Promise<void>

const applicationEdit: ApplicationEdit = async ({
  path,
  questions,
  defaultPath,
}) => {
  const directories = fs.readdirSync(path)
  const applicationsList = directories.filter((dir) => dir !== 'default')
  const applicationChoice: GeneralQuestions = [
    {
      type: 'list',
      name: 'application',
      message: 'Select an application from the follow list',
      choices: applicationsList,
    },
  ]
  const { application } = await prompt(applicationChoice)
  const filePath = join(path, application, 'config.json')
  const fileContent = fs.readFileSync(filePath, { encoding: 'utf8' })
  const config = JSON.parse(fileContent)
  const editQuestions = questions.map((q) => {
    q.default = config[q.name]
    return q
  })
  const {
    organizationSlug,
    clientId,
    clientSecret,
    scope,
    setAsDefault,
  } = await prompt(editQuestions)
  const appConfig = {
    organizationSlug,
    endpoint: `https://${organizationSlug}.commercelayer.io`,
    clientId,
    clientSecret,
    scope,
  }
  const content = JSON.stringify(appConfig, null, 4)
  if (setAsDefault) {
    const appConfigPath = join(defaultPath, 'config.json')
    fs.writeFileSync(appConfigPath, content)
    console.log(chalk.green('Application is set as default.'))
  }
  fs.writeFileSync(filePath, content)
  console.log(chalk.green('Application successfully updated.'))
}

export default applicationEdit
