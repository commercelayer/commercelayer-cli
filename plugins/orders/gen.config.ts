import { defineConfig, extractTriggers, triggerCommands } from '@commercelayer/cli-generator'

/**
 * One `orders:<action>` command per trigger attribute of the order resource,
 * generated from the OpenAPI schema, next to the hand-written commands kept
 * below. `pnpm generate` refreshes gen/triggers.json from the API,
 * `pnpm generate-local` regenerates from it.
 */
export default defineConfig({
  name: 'cli-plugin-orders',
  environments: { production: 'commercelayer.app' },
  schema: { kind: 'openapi', snapshot: 'gen/triggers.json', extract: (openapi) => ({ order: extractTriggers(openapi).order }) },
  outputs: ['src/triggers.ts', 'src/commands/orders', 'test/commands/orders'],
  format: ['src/triggers.ts', 'src/commands/orders', 'test/commands/orders'],
  generate: triggerCommands({
    mode: 'single-resource',
    resource: 'order',
    commandsDir: 'src/commands/orders',
    specsDir: 'test/commands/orders',
    triggersPath: 'src/triggers.ts',
    keep: { commands: ['index.ts', 'noc.ts', 'history.ts'], specs: ['index.test.ts', 'noc.test.ts'] },
    indent: 4,
  }),
})
