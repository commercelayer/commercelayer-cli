import { Hook } from '@oclif/core'
import { existsSync, mkdirSync, readdirSync, writeFileSync, appendFileSync, unlinkSync } from 'fs'
import { join } from 'path'
import { kebabCase } from 'lodash'
import { configParam, ConfigParams } from '../../config'


const hook: Hook<'postrun'> = async function (opts) {

  // Do not save fake commands output
  if (opts.Command.id && (opts.Command.id.toLowerCase().endsWith('noc'))) return
  if (opts.Command.name && (opts.Command.name.toLowerCase().endsWith('noc'))) return

  // Save last results
  if (opts.result) {

    const saveDir = join(opts.config.dataDir, 'results')
    if (!existsSync(saveDir)) mkdirSync(saveDir, { recursive: true })

    const filePath = join(saveDir, kebabCase(opts.Command.name) + '.last.json')

    try {
      const data = JSON.stringify(opts.result, null, 4)
      writeFileSync(filePath, data)
    } catch (error) {
      this.warn(`Error saving ouput for command ${opts.Command.name}`)
    }

  }


  // Save last command
  if (opts.argv && (opts.argv.length > 0)) {

    const commDir = join(opts.config.dataDir, 'commands')
    if (!existsSync(commDir)) mkdirSync(commDir, { recursive: true })

    const tstamp = new Date().toISOString()
    const date = tstamp.substring(0, tstamp.indexOf('T'))

    const filePath = join(commDir, date + '_command.list')
    const data = ['>', opts.Command.id, ...opts.argv]

    appendFileSync(filePath, `${data.join(' ')}\n`)

    deleteOldFiles(commDir)

  }

}

export default hook



const deleteOldFiles = (dir: string) => {

  const files = readdirSync(dir).filter((f: string) => {

    const today = new Date()
    const fday = new Date(f.substr(0, 10))
    const diffday = Math.floor((today.getTime() - fday.getTime()) / 1000 / 60 / 60 / 24)

    return (diffday > Number(configParam(ConfigParams.commandRetention)))

  })

  if (files && (files.length > 0)) files.forEach(f => unlinkSync(join(dir, f)))

}
