import { Hook } from '@oclif/config'
import fs from 'fs'
import path from 'path'
import _ from 'lodash'
import { configParam, ConfigParams } from '../../config'

const hook: Hook<'postrun'> = async function (opts) {

  // Save last results
  if (opts.result) {

    const saveDir = path.join(opts.config.dataDir, 'results')
    if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir, { recursive: true })

    const filePath = path.join(saveDir, _.kebabCase(opts.Command.name) + '.last.json')

    try {
      const data = JSON.stringify(opts.result, null, 4)
      fs.writeFileSync(filePath, data)
    } catch (error) {
      this.warn(`Error saving ouput for command ${opts.Command.name}`)
    }

  }


  // Save last command
  if (opts.argv) {

    const commDir = path.join(opts.config.dataDir, 'commands')
    if (!fs.existsSync(commDir)) fs.mkdirSync(commDir, { recursive: true })

    const tstamp = new Date().toISOString()
    const date = tstamp.substring(0, tstamp.indexOf('T'))

    const filePath = path.join(commDir, date + '_command.list')
    const data = ['>', opts.Command.id, ...opts.argv]

    fs.appendFileSync(filePath, `${data.join(' ')}\n`)

    deleteOldFiles(commDir)

  }

}

export default hook



const deleteOldFiles = (dir: string) => {

  const files = fs.readdirSync(dir).filter((f: string) => {

    const today = new Date()
    const fday = new Date(f.substr(0, 10))
    const diffday = Math.floor((today.getTime() - fday.getTime()) / 1000 / 60 / 60 / 24)

    return (diffday > Number(configParam(ConfigParams.commandRetention)))

  })

  if (files && (files.length > 0)) files.forEach(f => fs.unlinkSync(path.join(dir, f)))

}
