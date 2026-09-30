/**
 * Schema download and snapshots.
 *
 * `generate` downloads the schema, reduces it with the plugin's `extract`
 * and writes the snapshot; `generate-local` only reads the snapshot. The
 * code is always generated from the snapshot, so both produce the same
 * output from the same data, and CI can regenerate offline to check drift.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import snakeCase from 'lodash.snakecase'
import type { OpenApiSchema } from './config'

export type Snapshot<T = unknown> = {
  /** Where and which schema version the data was extracted from */
  source: { url: string; version: string }
  data: T
}

export const openApiUrl = (domain: string, apiVersion?: string): string => {
  const suffix = apiVersion ? `_${apiVersion.replace(/\./g, '-')}` : ''
  return `https://data.${domain}/schemas/openapi${suffix}.json`
}

export const downloadOpenApi = async (url: string): Promise<any> => {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Unable to download ${url}: ${response.status} ${response.statusText}`)
  return response.json()
}

export const writeSnapshot = (schema: OpenApiSchema, url: string, openapi: any): Snapshot => {
  const snapshot: Snapshot = { source: { url, version: openapi.info?.version ?? 'unknown' }, data: schema.extract(openapi) }
  writeFileSync(schema.snapshot, `${JSON.stringify(snapshot, null, 2)}\n`, { encoding: 'utf-8' })
  return snapshot
}

export const readSnapshot = (schema: OpenApiSchema): Snapshot => JSON.parse(readFileSync(schema.snapshot, { encoding: 'utf-8' }))

export type Trigger = { action: string; trigger: string; description: string }

/**
 * Trigger attributes (`_action`) of every resource's update schema, keyed by
 * snake_case resource name, in schema order. Resources without triggers are
 * left out.
 */
export const extractTriggers = (openapi: any): Record<string, Trigger[]> => {
  const resources: Record<string, Trigger[]> = {}
  for (const [name, schema] of Object.entries<any>(openapi.components.schemas)) {
    if (!name.endsWith('Update')) continue
    const triggers: Trigger[] = []
    for (const [attribute, definition] of Object.entries<any>(schema.properties.data.properties.attributes.properties)) {
      if (attribute.startsWith('_')) triggers.push({ action: attribute.substring(1), trigger: attribute, description: definition.description })
    }
    if (triggers.length > 0) resources[snakeCase(name.replace('Update', ''))] = triggers
  }
  return resources
}
