import { Hook } from '@oclif/config'


const hook: Hook<'postrun'> = async function (opts) {
  // Check if autocomplete plugin is installed
  if (opts.config.plugins.filter(p => p.name === '@oclif/plugin-autocomplete').length > 0) {
    // If a plugin is installed/uninstalled refresh autocomplete cache
    if (['plugins:install', 'plugins:uninstall'].includes(opts.Command.id)) {
      const acCmd = opts.config.findCommand('autocomplete')
      if (acCmd && (opts.argv[0] !== '@oclif/plugin-autocomplete')) acCmd.load().run(['--refresh-cache'], opts.config)
    }
  }
}


export default hook
