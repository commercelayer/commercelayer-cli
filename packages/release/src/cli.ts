/**
 * cl-release: the release tooling of the monorepo.
 *
 * The root scripts run it (`pnpm release:version`, …), and the workflows call
 * its commands directly (`pnpm exec cl-release resolve <tag>`, …). It works
 * from anywhere in the repository: it runs at the workspace root.
 */
import { execFileSync } from 'node:child_process'

const COMMANDS = {
  version: ['Bump the changed packages and open the chore(release) pull request', () => import('./commands/version.ts')],
  tag: ['Tag the package versions not released yet and push the tags', () => import('./commands/tag.ts')],
  try: ['Install the working tree in a sandbox, packed as for npm', () => import('./commands/try.ts')],
  resolve: ['Resolve a release tag to its package, as $GITHUB_OUTPUT lines', () => import('./commands/resolve.ts')],
  notes: ['Write the release notes of a tag', () => import('./commands/notes.ts')],
  publish: ['Publish a tag to npm, with the workspace dependencies it needs', () => import('./commands/publish.ts')],
  manifest: ['Compare a package command surface with its npm version', () => import('./commands/manifest.ts')],
  labels: ['Generate .github/labeler.yml (pkg:<dir> labels)', () => import('./commands/labels.ts')],
} satisfies Record<string, [string, () => Promise<{ run: (args: string[]) => Promise<void> | void }>]>

const usage = (): string => {
  const width = Math.max(...Object.keys(COMMANDS).map((c) => c.length))
  return [
    'Usage: cl-release <command> [options]',
    '',
    ...Object.entries(COMMANDS).map(([name, [description]]) => `  ${name.padEnd(width)}  ${description}`),
    '',
    'cl-release <command> --help shows the options of a command.',
  ].join('\n')
}

const [command, ...args] = process.argv.slice(2)

if (!command || command === '--help' || command === '-h') {
  console.log(usage())
  process.exit(command ? 0 : 1)
}
if (!(command in COMMANDS)) {
  console.error(`Unknown command '${command}'\n\n${usage()}`)
  process.exit(1)
}

process.chdir(execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim())

const { run } = await COMMANDS[command as keyof typeof COMMANDS][1]()
await run(args)
