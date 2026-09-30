/**
 * The list of API resources a plugin works on, written as a TypeScript
 * module. The plugin supplies the resources (usually from its SDK's static
 * helpers, so the list follows the installed SDK version).
 */
import type { Context } from '../context'

export type ResourceEntry = { name: string; type: string; api: string; model: string; singleton?: boolean }

export type ResourceListOptions = {
  output: string
  /** Name of the exported constant */
  name: string
  resources: () => ResourceEntry[]
}

export const resourceList =
  (options: ResourceListOptions) =>
  (ctx: Context): void => {
    const lines = ['', `const ${options.name} = [`]
    for (const r of options.resources()) {
      lines.push(`\t{ name: '${r.name}', type: '${r.type}', api: '${r.api}', model: '${r.model}'${r.singleton ? ', singleton: true' : ''} },`)
    }
    lines.push(`] as const\n`, `\n\nexport default ${options.name}\n`)
    ctx.write(options.output, lines.join('\n'))
    ctx.log(`Generated ${options.output}`)
  }
