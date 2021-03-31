import {Hook} from '@oclif/config'
import fs from 'fs'
import path from 'path'
import _ from 'lodash'

const hook: Hook<'postrun'> = async function (opts) {

  // process.stdout.write(`example hook running ${opts.id}\n`)

  if (opts.result) {

    const saveDir = path.join(opts.config.dataDir, 'results')

    if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir, { recursive: true })

    const filePath = path.join(saveDir, _.kebabCase(opts.Command.name) + '.last.json')
    const data = JSON.stringify(opts.result, null, 4)

    fs.writeFileSync(filePath, data)

  }

}

export default hook
