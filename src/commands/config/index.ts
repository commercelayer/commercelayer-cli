import { prompt } from 'inquirer'
import _ from 'lodash'
import applications from './applications'

const listOfOptions = [
  { name: 'Applications', value: 'applications' },
  { name: 'Defaults', value: 'defaults' },
]

const config = async () => {
  const { option } = await prompt([
    {
      name: 'option',
      type: 'list',
      message: `Choose an option:`,
      choices: listOfOptions,
    },
  ])
  if (option === 'applications') {
    await applications()
  }
}

export default config
