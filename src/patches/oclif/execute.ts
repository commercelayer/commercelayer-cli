import { run, handle, flush, settings} from '@oclif/core'
import type { LoadOptions } from '@oclif/core/lib/interfaces'


export async function execute(options: {
  args?: string[]
  development?: boolean
  dir: string
  loadOptions?: LoadOptions
}): Promise<unknown> {

  if (options.development) {
    process.env.NODE_ENV = 'development'
    settings.debug = true
  }

  return run(options.args ?? process.argv.slice(2), options.loadOptions ?? options.dir)
    .then(async (result) => {
      await flush(60000)
      return result
    })
    .catch(async (error) => {
      if (error.code === 'EEXIT' && error.oclif.exit === 0) { /* command exit (quit) */ }
      else
        if (error.message === 'HOOK_EXIT') { /* hook exit */ }
        else return handle(error as Error)
    })

}
