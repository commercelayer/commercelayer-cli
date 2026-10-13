import { defineConfig, extractResourceTypes, resourceTypes } from '@commercelayer/cli-generator'

/**
 * The resource types of imports, exports, cleanups, tags and links, from the
 * OpenAPI schema. `pnpm generate` refreshes gen/resource-types.json from the
 * API, `pnpm generate-local` regenerates from it.
 */
export default defineConfig({
  name: 'cli-core',
  environments: { production: 'commercelayer.app' },
  schema: { kind: 'openapi', snapshot: 'gen/resource-types.json', extract: extractResourceTypes },
  outputs: ['src/resource-types.ts'],
  format: ['src/resource-types.ts'],
  generate: resourceTypes({ output: 'src/resource-types.ts' }),
})
