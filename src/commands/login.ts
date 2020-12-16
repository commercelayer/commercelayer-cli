import { getIntegrationToken } from '@commercelayer/js-auth'
import fs from 'fs'
import { prompt } from 'inquirer'
import path from 'path'
import chalk from 'chalk'
import _ from 'lodash'
import validator from 'validator'

type Login = {
  clientId: string
  clientSecret: string
  endpoint: string
  interactive?: boolean
  scope?: string
}

export default async (env: Login) => {
  let { endpoint, clientId, clientSecret, scope, interactive } = env
  const root = path.join(process.cwd(), '.commercelayer')
  const config = path.join(process.cwd(), '.commercelayer', 'config')
  const destination = path.join(
    process.cwd(),
    '.commercelayer',
    'config',
    'application.json'
  )
  // if (!endpoint) {
  //   throw new Error('endpoint is required')
  // }
  const applicationConfig: any = {
    endpoint,
    clientId,
    clientSecret,
    scope,
  }
  for (const key in applicationConfig) {
    if (!applicationConfig[key]) {
      const promptInput = await prompt([
        {
          name: key,
          type: 'input',
          message: `Insert your ${key}:`,
          validate: (value: string) => {
            if (_.isEmpty(value) && key !== 'scope') return `${key} is required`
            if (
              key === 'endpoint' &&
              !validator.isURL(value, { protocols: ['https'] })
            )
              return `${key} must be a valid HTTPS URL`
            return true
          },
        },
      ])
      if (promptInput[key]) {
        applicationConfig[key] = promptInput[key]
      } else if (key !== 'scope') {
        console.log(chalk.red(`${key} is required`))
        process.exit(1)
      }
    }
  }
  const content = JSON.stringify(applicationConfig)
  if (!fs.existsSync(root)) {
    fs.mkdirSync(root)
  }
  if (!fs.existsSync(config)) {
    fs.mkdirSync(config)
  }
  fs.writeFileSync(destination, content)
  // TODO: Add authentication and save the access token
  try {
    const auth = await getIntegrationToken(applicationConfig)
    if (auth?.accessToken) {
      console.log('accessToken', auth.accessToken)
      const destination = path.join(
        process.cwd(),
        '.commercelayer',
        'accessToken.json'
      )
      fs.writeFileSync(destination, JSON.stringify({ token: auth.accessToken }))
    }
  } catch (error) {
    console.error(chalk.red(error))
  }
}
