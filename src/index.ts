const { Command } = require('commander')
import config from './commands/config'

const program = new Command();

const version = '0.0.1'

export const index = async () => {
  program.version(version, '-v, --version', 'output the current version')

  program
    //.version(version)
    .command('config')
    .description('set your local config')
    .action(config)

  await program.parseAsync(process.argv)
}

index()
