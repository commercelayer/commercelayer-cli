import { prompt } from 'inquirer'
import _ from 'lodash'
import { emojify } from 'node-emoji'
import applications from './applications'

const listOfOptions = [
  { name: 'Applications', value: 'applications' },
  { name: 'Defaults', value: 'defaults' },
]

const config = async () => {
  // let { endpoint, clientId, clientSecret, scope, interactive } = env
  // const root = path.join(process.cwd(), '.commercelayer')
  // const config = path.join(process.cwd(), '.commercelayer', 'config')
  // const destination = path.join(
  //   process.cwd(),
  //   '.commercelayer',
  //   'config',
  //   'application.json'
  // )
  const { option } = await prompt([
    {
      name: 'option',
      type: 'list',
      message: emojify(`Choose an option :arrow_down: :`),
      choices: listOfOptions,
    },
  ])
  if (option === 'applications') {
    await applications()
  }
  // if (!endpoint) {
  //   throw new Error('endpoint is required')
  // }
  // const applicationConfig: any = {
  //   endpoint,
  //   clientId,
  //   clientSecret,
  //   scope,
  // }
  // for (const key in applicationConfig) {
  //   if (!applicationConfig[key]) {
  //     const promptInput = await prompt([
  //       {
  //         name: key,
  //         type: 'input',
  //         message: `Insert your ${key}:`,
  //         validate: (value: string) => {
  //           if (_.isEmpty(value) && key !== 'scope') return `${key} is required`
  //           if (
  //             key === 'endpoint' &&
  //             !validator.isURL(value, { protocols: ['https'] })
  //           )
  //             return `${key} must be a valid HTTPS URL`
  //           return true
  //         },
  //       },
  //     ])
  //     if (promptInput[key]) {
  //       applicationConfig[key] = promptInput[key]
  //     } else if (key !== 'scope') {
  //       console.log(chalk.red(`${key} is required`))
  //       process.exit(1)
  //     }
  //   }
  // }
  // const content = JSON.stringify(applicationConfig)
  // if (!fs.existsSync(root)) {
  //   fs.mkdirSync(root)
  // }
  // if (!fs.existsSync(config)) {
  //   fs.mkdirSync(config)
  // }
  // fs.writeFileSync(destination, content)
  // // TODO: Add authentication and save the access token
  // try {
  //   const auth = await getIntegrationToken(applicationConfig)
  //   if (auth?.accessToken) {
  //     console.log('accessToken', auth.accessToken)
  //     const destination = path.join(
  //       process.cwd(),
  //       '.commercelayer',
  //       'accessToken.json'
  //     )
  //     fs.writeFileSync(destination, JSON.stringify({ token: auth.accessToken }))
  //   }
  // } catch (error) {
  //   console.error(chalk.red(error))
  // }
}

export default config
