/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Performance, stdout } from "@oclif/core"
import { CLIError } from "@oclif/core/lib/errors"
import { loadHelpClass, normalizeArgv } from "@oclif/core/lib/help"
import type { HelpOptions, LoadOptions } from "@oclif/core/lib/interfaces"
import { helpAddition, versionAddition } from "@oclif/core/lib/main"
import { fileURLToPath } from "url"
import { format, inspect } from "util"
import { PatchedConfig } from "./config"



const log = (message = '', ...args: any[]): void => {
	message = typeof message === 'string' ? message : inspect(message)
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	stdout.write(format(message, ...args) + '\n')
  }



export async function run(argv?: string[], options?: LoadOptions): Promise<unknown> {
  const marker = Performance.mark('main.run')

  const initMarker = Performance.mark('main.run#init')

  const collectPerf = async (): Promise<void> => {
    marker?.stop()
    initMarker?.stop()
    await Performance.collect()
    Performance.debug()
  }

  argv = argv ?? process.argv.slice(2)
  // Handle the case when a file URL string or URL is passed in such as 'import.meta.url'; covert to file path.
  if (options && ((typeof options === 'string' && options.startsWith('file://')) || options instanceof URL)) {
    options = fileURLToPath(options)
  }

  const config = await PatchedConfig.load(options ?? require.main?.filename ?? __dirname)

  let [id, ...argvSlice] = normalizeArgv(config, argv)

  // run init hook
  const initHook = await config.runHook('init', {id, argv: argvSlice})
  if (initHook.failures[0]) throw new CLIError(initHook.failures[0].error)

  // display version if applicable
  if (versionAddition(argv, config)) {
    log(config.userAgent)
    await collectPerf()
    return
  }

  // display help version if applicable
  if (helpAddition(argv, config)) {
    const Help = await loadHelpClass(config)
    const help = new Help(config, config.pjson.helpOptions as Partial<HelpOptions>)
    await help.showHelp(argv)
    await collectPerf()
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

  initMarker?.stop()

  // If the the default command is '.' (signifying that the CLI is a single command CLI) and '.' is provided
  // as an argument, we need to add back the '.' to argv since it was stripped out earlier as part of the
  // command id.
  if (config.pjson.oclif.default === '.' && id === '.' && argv[0] === '.') argvSlice = ['.', ...argvSlice]

  try {
    return await config.runCommand(id, argvSlice, cmd)
  } finally {
    await collectPerf()
  }
}
