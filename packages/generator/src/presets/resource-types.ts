/**
 * The resource types the CLI accepts for imports, exports, cleanups, tags and
 * links, from the OpenAPI schema instead of lists copied by hand from the docs
 * (which fell behind the API: cleanups refused coupons).
 *
 * - imports, exports, cleanups: the `resource_type` enum of the create schema;
 * - tags: the resources whose objects have a `tags` relationship;
 * - links: the types of the `item` relationship of a link.
 */
import type { Context } from '../context'
import { generated } from '../context'

export type ResourceTypes = {
  imports: string[]
  exports: string[]
  cleanups: string[]
  tags: string[]
  links: string[]
}

const createSchema = (openapi: any, name: string): any => {
  const schema = openapi.components?.schemas?.[name]
  if (!schema) throw new Error(`The OpenAPI schema has no ${name}`)
  return schema.properties.data.properties
}

const resourceTypeEnum = (openapi: any, name: string): string[] => {
  const values: unknown = createSchema(openapi, name).attributes?.properties?.resource_type?.enum
  if (!Array.isArray(values) || values.length === 0) throw new Error(`${name}.resource_type has no enum`)
  return [...values].sort()
}

/** Reduces the OpenAPI document to the resource type lists (sorted) */
export const extractResourceTypes = (openapi: any): ResourceTypes => {
  const tags = new Set<string>()
  for (const [name, schema] of Object.entries<any>(openapi.components.schemas)) {
    // The resource objects, not their create/update payloads: promotions (the
    // generic type) has no create schema but its objects have tags
    if (name.endsWith('Create') || name.endsWith('Update')) continue
    const data = schema.properties?.data?.properties
    const type: unknown = data?.type?.enum?.[0]
    if (typeof type === 'string' && data?.relationships?.properties?.tags) tags.add(type)
  }
  const links: unknown = createSchema(openapi, 'linkCreate').relationships?.properties?.item?.properties?.data?.properties?.type?.enum
  if (!Array.isArray(links) || links.length === 0) throw new Error('linkCreate.item has no type enum')
  return {
    imports: resourceTypeEnum(openapi, 'importCreate'),
    exports: resourceTypeEnum(openapi, 'exportCreate'),
    cleanups: resourceTypeEnum(openapi, 'cleanupCreate'),
    tags: [...tags].sort(),
    links: [...links].sort(),
  }
}

export type ResourceTypesOptions = {
  output: string
}

const NAMES: Record<keyof ResourceTypes, string> = {
  imports: 'IMPORT_RESOURCE_TYPES',
  exports: 'EXPORT_RESOURCE_TYPES',
  cleanups: 'CLEANUP_RESOURCE_TYPES',
  tags: 'TAG_RESOURCE_TYPES',
  links: 'LINK_RESOURCE_TYPES',
}

/** Writes the lists of the snapshot as exported constants */
export const resourceTypes =
  (options: ResourceTypesOptions) =>
  (ctx: Context): void => {
    const types = ctx.snapshot as ResourceTypes
    const blocks = (Object.keys(NAMES) as Array<keyof ResourceTypes>).map((key) =>
      [`export const ${NAMES[key]}: readonly string[] = [`, ...types[key].map((t) => `\t'${t}',`), '] as const'].join('\n'),
    )
    ctx.write(options.output, generated(`${blocks.join('\n\n')}\n`))
    ctx.log(`Generated ${options.output}`)
  }
