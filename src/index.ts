import { program } from 'commander'
import config from './commands/config'

const version = '0.0.1'

export const index = async () => {
  program.version(version, '-v, --version', 'output the current version')

  program
    .version(version)
    .command('config')
    .description('Set your local config')
    .action(config)

  await program.parseAsync(process.argv)
}

index()
