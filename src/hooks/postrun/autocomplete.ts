import { clColor } from '@commercelayer/cli-core'
import { Hook } from '@oclif/core'



const hook: Hook<'postrun'> = async function (opts) {

  // Windows OS not supported
  if (opts.config.windows) return

  // Check if autocomplete plugin is installed
  if (opts.config.plugins.filter(p => p.name === '@oclif/plugin-autocomplete').length > 0) {

    // If a plugin is installed/uninstalled refresh autocomplete cache
    if (['plugins:install', 'plugins:uninstall'].includes(opts.Command.id)) {

      try {
        const acCmd = opts.config.findCommand('autocomplete')
        if (acCmd && (opts.argv[0] !== '@oclif/plugin-autocomplete')) {
          const runCmd = await acCmd.load()
          await runCmd.run(['--refresh-cache'], opts.config)
        }
      } catch (error: any) {
        this.error(error.message)
      }

    } else if ((opts.Command.id === 'autocomplete') && !opts.argv.includes('-r') && !opts.argv.includes('--refresh-cache')) {
      this.log(`${clColor.msg.warning('WARNING')}`)
      this.log(`-- Autocomplete feature currently works only using the extended command ${clColor.cyan(this.config.bin)} (not ${clColor.cyan('cl')} or ${clColor.cyan('clayer')}})`)
      this.log(`-- If autocomplete doesn’t work immediately execute the command ${clColor.cyan('autocomplete --refresh-cache')}`)
      this.log('-- It will likely be necessary to open a new terminal window for the changes to take effect')
      this.log('')
    }

  }

}


export default hook
