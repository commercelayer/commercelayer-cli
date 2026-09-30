/**
 * Trigger commands: one oclif command (and spec) per trigger attribute of the
 * API resources, plus the trigger list module the commands import.
 *
 * - `per-resource` (triggers plugin): every resource with triggers gets a
 *   command folder `<commandsDir>/<resource>/` with an `index.ts` and one
 *   command per trigger, and a module `<triggersPath>/<resources>.ts`.
 * - `single-resource` (orders plugin): the triggers of one resource become
 *   commands in `<commandsDir>`, next to hand-written ones listed in `keep`,
 *   with a single module at `<triggersPath>`.
 *
 * The snapshot data is `Record<resource, Trigger[]>` (see extractTriggers).
 */
import { join } from 'node:path'
import snakeCase from 'lodash.snakecase'
import type { Context } from '../context'
import { render } from '../context'
import type { Trigger } from '../schema'

const Inflector: any = require('inflector-js')

type Common = {
  commandsDir: string
  specsDir: string
  /** Indentation of the trigger entries in the generated trigger modules */
  indent: number
}

export type TriggerCommandsOptions =
  | (Common & {
      mode: 'per-resource'
      /** Folder of the per-resource trigger modules */
      triggersPath: string
      /** Template copied to `<commandsDir>/noc.ts` */
      nocTemplate?: string
    })
  | (Common & {
      mode: 'single-resource'
      resource: string
      /** File of the trigger module */
      triggersPath: string
      /** Hand-written entries of commandsDir / specsDir to preserve */
      keep?: { commands?: string[]; specs?: string[] }
    })

const FLAG_VALUE = `value: Flags.string({
      char: 'v',
      description: 'the trigger attribute value',
      multiple: false,
      required: true,
    }),`

const triggersModule = (template: string, triggers: Trigger[], indent: number): string => {
  const pad = ' '.repeat(indent)
  const close = ' '.repeat(indent - 2)
  const entries = triggers
    .map(
      (t) => `${t.action}: {
${pad}action: '${t.action}',
${pad}trigger: '${t.trigger}',
${pad}description: '${t.description.replace(/'/g, "\\'")}',
${close}},`,
    )
    .join('\n\t')
  return render(template, {}, { TRIGGERS: entries, ACTION: triggers.map((t) => `'${t.action}'`).join(' |\n\t') })
}

const flagPlaceholders = (action: string) => ({
  FLAG_VALUE: action.endsWith('_id') ? FLAG_VALUE : '',
  FLAGS_IMPORT: action.endsWith('_id') ? ', { Flags }' : '',
})

const specName = (fileName: string) => fileName.replace(/.ts/g, '.test.ts')

export const triggerCommands =
  (options: TriggerCommandsOptions) =>
  (ctx: Context): void => {
    const all: Record<string, Trigger[]> = ctx.snapshot

    if (options.mode === 'per-resource') {
      ctx.clean(options.triggersPath)
      ctx.clean(options.commandsDir)
      ctx.clean(options.specsDir)

      const indexTpl = ctx.template('index')
      const actionTpl = ctx.template('action')
      const specTpl = ctx.template('spec')
      const triggersTpl = ctx.template('triggers')
      const specTimeout = String(1000 * Object.keys(all).length)

      for (const [resource, triggers] of Object.entries(all)) {
        const resType = Inflector.pluralize(resource)
        const resClass = Inflector.camelize(resource)

        ctx.write(join(options.triggersPath, `${resType}.ts`), triggersModule(triggersTpl, triggers, options.indent))
        ctx.log(`Updated ${resource} triggers`)

        const cmdDir = join(options.commandsDir, resource)
        const spcDir = join(options.specsDir, resource)
        ctx.mkdir(cmdDir)
        ctx.mkdir(spcDir)

        ctx.write(
          join(cmdDir, 'index.ts'),
          render(indexTpl, { RESOURCE_NAME: resource.replace(/_/g, ' '), RESOURCE_TYPE: resType, RESOURCE_CLASS: resClass }),
        )

        for (const { action } of triggers) {
          const fileName = `${action}.ts`
          const command = render(
            actionTpl,
            { ACTION_ID: action, ACTION_NAME: Inflector.camelize(action), RESOURCE_NAME: resource, RESOURCE_TYPE: resType, RESOURCE_CLASS: resClass },
            flagPlaceholders(action),
          )
          ctx.write(join(cmdDir, fileName), command)
          ctx.write(join(spcDir, specName(fileName)), render(specTpl, { ACTION_ID: action, RESOURCE_TYPE: resType, SPEC_TIMEOUT: specTimeout }))
        }
        ctx.log(`Created ${triggers.length} ${resource} command(s)`)
      }

      if (options.nocTemplate) ctx.copy(options.nocTemplate, join(options.commandsDir, 'noc.ts'))
      return
    }

    const triggers = all[options.resource]
    if (!triggers) throw new Error(`The snapshot has no triggers for '${options.resource}'`)

    ctx.write(options.triggersPath, triggersModule(ctx.template('triggers'), triggers, options.indent))
    ctx.log(`Updated ${options.resource} triggers`)

    ctx.clean(options.commandsDir, options.keep?.commands)
    ctx.clean(options.specsDir, options.keep?.specs)

    const actionTpl = ctx.template('action')
    const specTpl = ctx.template('spec')
    const specTimeout = String(1000 * triggers.length)

    for (const { action } of triggers) {
      const fileName = `${snakeCase(action)}.ts`
      ctx.write(join(options.commandsDir, fileName), render(actionTpl, { ACTION_ID: action, ACTION_NAME: Inflector.camelize(action) }, flagPlaceholders(action)))
      ctx.write(join(options.specsDir, specName(fileName)), render(specTpl, { ACTION_ID: action, SPEC_TIMEOUT: specTimeout }))
    }
    ctx.log(`Created ${triggers.length} ${options.resource} command(s)`)
  }
