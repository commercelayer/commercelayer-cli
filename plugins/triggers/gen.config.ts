import { defineConfig, extractTriggers, triggerCommands } from '@commercelayer/cli-generator'

/**
 * One command per trigger attribute of every API resource, generated from the
 * OpenAPI schema. `pnpm generate` refreshes gen/triggers.json from the API,
 * `pnpm generate-local` regenerates from it.
 */
export default defineConfig({
  name: 'cli-plugin-triggers',
  environments: { production: 'commercelayer.app' },
  schema: { kind: 'openapi', snapshot: 'gen/triggers.json', extract: extractTriggers },
  outputs: ['src/commands', 'src/triggers', 'test/commands'],
  format: ['src/commands', 'test/commands', 'src/triggers'],
  generate: triggerCommands({
    mode: 'per-resource',
    commandsDir: 'src/commands',
    specsDir: 'test/commands',
    triggersPath: 'src/triggers',
    nocTemplate: 'gen/templates/noc.tpl',
    indent: 6,
  }),
})
