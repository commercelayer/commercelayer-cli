import { clColor } from '@commercelayer/cli-core'
import type { Hook } from '@oclif/core'



const hook: Hook<'postrun'> = async function (opts) {

  if (opts.Command.id !== 'plugins:update') return

  this.log(`\n${clColor.style.title('Current installed plugins')}\n`)

  const pluginsCmd = await this.config.findCommand('plugins')?.load()
  await pluginsCmd?.run([])

  this.log('')

}


export default hook
