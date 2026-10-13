import { type ParseArgsOptionsConfig, parseArgs } from 'node:util'

/**
 * Parses a command's arguments (node:util parseArgs, strict), printing its
 * usage on --help or on an unknown option.
 */
export const parse = <O extends ParseArgsOptionsConfig>(args: string[], options: O, usage: string) => {
  try {
    const parsed = parseArgs({ args, options: { ...options, help: { type: 'boolean', short: 'h' } }, allowPositionals: true, strict: true })
    if ((parsed.values as { help?: boolean }).help) {
      console.log(usage)
      process.exit(0)
    }
    return parsed
  } catch (error) {
    console.error(`${(error as Error).message}\n\n${usage}`)
    process.exit(1)
  }
}
