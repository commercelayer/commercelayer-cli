/**
 * The contract between the generator and a plugin, declared in the plugin's
 * `gen.config.ts` (the counterpart of commercelayer-sdk's `sdk.config.ts`).
 *
 * A plugin states where its input comes from (`schema`), which files are
 * generated (`outputs`) and how to produce them (`generate`, usually a preset
 * from this package). Everything runs from the plugin folder, so every path
 * is relative to it.
 */
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import type { Context } from './context'

export type OpenApiSchema = {
  kind: 'openapi'
  /**
   * The committed snapshot `generate-local` regenerates from. It holds only
   * what `extract` keeps: the raw OpenAPI document is almost 5 MB.
   */
  snapshot: string
  /** Reduces the downloaded OpenAPI document to the data the plugin needs */
  extract: (openapi: any) => unknown
}

export type GeneratorConfig = {
  /** Shown in the logs */
  name: string
  /**
   * API domains by environment, for the `--env` option. `production` is the
   * default. The OpenAPI schema is served by `data.<domain>`.
   */
  environments?: Readonly<Record<string, string>> & { production: string }
  /** Input downloaded by `generate` and snapshotted for `generate-local` */
  schema?: OpenApiSchema
  /**
   * Paths (files or folders) the generator owns. They get the "generated"
   * attributes and are what CI checks for drift.
   */
  outputs: string[]
  /** Paths to run `biome check --write` on once generation is done */
  format?: string[]
  generate: (ctx: Context) => void | Promise<void>
}

export const defineConfig = (config: GeneratorConfig): GeneratorConfig => config

export const CONFIG_FILE = 'gen.config.ts'

export const loadConfig = async (path = CONFIG_FILE): Promise<GeneratorConfig> => {
  const file = resolve(path)
  if (!existsSync(file)) throw new Error(`No ${CONFIG_FILE} in ${process.cwd()}`)
  const mod = await import(pathToFileURL(file).href)
  const config: GeneratorConfig | undefined = mod.default?.default ?? mod.default
  if (!config || typeof config.generate !== 'function') throw new Error(`${path} must export a default config with a generate() function`)
  if (!Array.isArray(config.outputs) || config.outputs.length === 0) throw new Error(`${path} must declare its outputs`)
  if (config.schema && !config.environments?.production) throw new Error(`${path} declares a schema, so it needs environments.production`)
  return config
}

export const resolveDomain = (config: GeneratorConfig, opts: { env?: string; apiHost?: string }): string | undefined => {
  if (opts.apiHost) return opts.apiHost
  const envs = config.environments
  if (!envs) return undefined
  const env = opts.env ?? 'production'
  const domain = envs[env]
  if (!domain) throw new Error(`Unknown environment '${env}'. ${config.name} declares: ${Object.keys(envs).sort().join(', ')}`)
  return domain
}
