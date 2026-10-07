#!/usr/bin/env tsx
/**
 * cl-generate: generates a plugin's code from its gen.config.ts.
 *
 * Run from the plugin folder (the `generate` / `generate-local` scripts do):
 *
 *   cl-generate                 download the schema, update the snapshot, generate
 *   cl-generate --local         generate from the committed snapshot, offline
 *   cl-generate --env <name>    download from another environment of gen.config.ts
 *   cl-generate --api-host <d>  download from an explicit domain
 *   cl-generate --api-version <v>  download a specific schema version
 *
 * Plugins without a schema (their input is an installed SDK) generate the
 * same way with or without --local.
 */
import { execFileSync } from 'node:child_process'
import { loadConfig, resolveDomain } from './config'
import { createContext } from './context'
import { downloadOpenApi, openApiUrl, readSnapshot, writeSnapshot } from './schema'

const argv = process.argv.slice(2)
const option = (name: string): string | undefined => {
  const eq = argv.find((a) => a.startsWith(`--${name}=`))
  if (eq) return eq.slice(name.length + 3)
  const idx = argv.indexOf(`--${name}`)
  return idx >= 0 ? argv[idx + 1] : undefined
}

const main = async (): Promise<void> => {
  const config = await loadConfig()
  const local = argv.includes('--local')
  console.log(`>> ${config.name}: generating${local ? ' from the local snapshot' : ''}`)

  let snapshot: unknown
  if (config.schema) {
    if (!local) {
      const domain = resolveDomain(config, { env: option('env'), apiHost: option('api-host') }) as string
      const url = openApiUrl(domain, option('api-version'))
      console.log(`>> Downloading ${url}`)
      const written = writeSnapshot(config.schema, url, await downloadOpenApi(url))
      console.log(`>> Schema v${written.source.version} → ${config.schema.snapshot}`)
    }
    const read = readSnapshot(config.schema)
    console.log(`>> Snapshot: schema v${read.source.version}`)
    snapshot = read.data
  }

  await config.generate(createContext(snapshot))

  if (config.format?.length) {
    console.log(`>> Formatting ${config.format.join(', ')}`)
    execFileSync('pnpm', ['exec', 'biome', 'check', '--write', ...config.format], { stdio: 'inherit' })
  }
  console.log(`>> ${config.name}: done`)
}

main().catch((error: Error) => {
  console.error(`✖ ${error.message}`)
  process.exit(1)
})
