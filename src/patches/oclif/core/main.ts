import { fileURLToPath } from 'url'
import { format, inspect } from 'util'
import * as Interfaces from '@oclif/core/lib/interfaces'
import { URL } from 'url'
import { PatchedConfig } from './config'
import { loadHelpClass, standardizeIDFromArgv } from '@oclif/core/lib/help'
import { helpAddition, versionAddition } from '@oclif/core/lib/main'
import { CLIError } from '@oclif/core/lib/errors'


const log = (message = '', ...args: any[]) => {
  // tslint:disable-next-line strict-type-predicates
  message = typeof message === 'string' ? message : inspect(message)
  process.stdout.write(format(message, ...args) + '\n')
}


// eslint-disable-next-line default-param-last
export async function run(argv = process.argv.slice(2), options?: Interfaces.LoadOptions) {

  // Handle the case when a file URL string or URL is passed in such as 'import.meta.url'; covert to file path.
  if (options && ((typeof options === 'string' && options.startsWith('file://')) || options instanceof URL)) {
    options = fileURLToPath(options)
  }

  // return Main.run(argv, options)
  const config = await PatchedConfig.load(options || (module.parent && module.parent.parent && module.parent.parent.filename) || __dirname) as PatchedConfig

  if (config.topicSeparator !== ':' && !argv[0]?.includes(':')) argv = standardizeIDFromArgv(argv, config)
  let [id, ...argvSlice] = argv

  // run init hook
  const initHook = await config.runHook('init', { id, argv: argvSlice })
  if (initHook.failures[0]) throw new CLIError(initHook.failures[0].error)

  // display version if applicable
  if (versionAddition(argv, config)) {
    log(config.userAgent)
    return
  }

  // display help version if applicable
  if (helpAddition(argv, config)) {
    const Help = await loadHelpClass(config)
    const help = new Help(config, config.pjson.helpOptions)
    await help.showHelp(argv)
    return
  }

  // find & run command
  const cmd = config.findCommand(id)
  if (!cmd) {
    const topic = config.flexibleTaxonomy ? null : config.findTopic(id)
    if (topic) return config.runCommand('help', [id])
    if (config.pjson.oclif.default) {
      id = config.pjson.oclif.default
      argvSlice = argv
    }
  }

  await config.runCommand(id, argvSlice, cmd)

}
