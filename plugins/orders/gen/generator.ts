/* eslint-disable no-console */
import { validActions } from '../src/commands/orders/actions'
import fs from 'fs'
import Manifest from '@oclif/dev-cli/lib/commands/manifest'
import path from 'path'

const Inflector = require('inflector-js')


const COMMANDS_DIR = 'src/commands/orders'
const TEMPLATES_DIR = 'gen/templates'
const SPECS_DIR = 'test/commands/orders'


const clean = () => {

  // Clean commands dir
  const files = fs.readdirSync(COMMANDS_DIR)
  files.forEach(f => {
    if (!['index.ts', 'actions.ts', 'noc.ts'].includes(f)) fs.unlinkSync(`${COMMANDS_DIR}/${f}`)
  })
  console.log('Deleted command files')

  // Clean specs dir
  const specs = fs.readdirSync(SPECS_DIR)
  specs.forEach(f => {
    if (!['index.test.ts', 'actions.test.ts', 'noc.test.ts'].includes(f)) fs.unlinkSync(`${SPECS_DIR}/${f}`)
  })
  console.log('Deleted spec files')

}


const generate = () => {

  console.log('Cleaning folders ...')
  clean()

  const actionTpl = fs.readFileSync(path.join(TEMPLATES_DIR, 'action.tpl'), { encoding: 'utf-8' })
  const specTpl = fs.readFileSync(path.join(TEMPLATES_DIR, 'spec.tpl'), { encoding: 'utf-8' })

  Object.keys(validActions).forEach(action => {

    let command = actionTpl.replace(/##__ACTION_ID__##/g, action)
    const name = Inflector.camelize(action)
    command = command.replace(/##__ACTION_NAME__##/g, name)

    const fileName = Inflector.dasherize(action) + '.ts'
    fs.writeFileSync(path.join(COMMANDS_DIR, fileName), command)
    console.log(`Created command: ${action} [${fileName}]`)


    const spec = specTpl.replace(/##__ACTION_ID__##/g, action)
    const specName = fileName.replace(/.ts/g, '.test.ts')
    fs.writeFileSync(path.join(SPECS_DIR, specName), spec)
    console.log(`Created spec: ${action} [${specName}]`)

  })

  Manifest.run().then(() => console.log('Generated commands manifest'))
    .then(() => console.log('Order commands generation completed.'))

}


generate()
