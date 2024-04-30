import { clText, clUtil } from "@commercelayer/cli-core"
import { Command, Flags, ux as cliux } from "@oclif/core"
import { writeFileSync } from "node:fs"
import { join } from "node:path"
import { format } from 'prettier'


const FIG_SPECS_DIR = '/Users/pierlu/Documents/GitHub/fig-autocomplete/src'
const SPEC_NAME = 'commercelayer'

const processedCommands: string[] = []


function getFigArgs(args: Command.Arg.Cached[]): Fig.Arg[] {

  const figArgs: Fig.Arg[] = []

  for (const arg of args) {

    if (arg.hidden) continue

    const figArg: Fig.Arg = {
      name: arg.name,
      ...(arg.description && { description: description(arg.description) }),
      ...(arg.default && { default: `${arg.default}` }),
      ...(arg.options?.length && { suggestions: arg.options }),
      ...(arg.required === false && { isOptional: true })
    }

    figArgs.push(figArg)

  }

  return figArgs

}



function getFigOptions(options: Command.Flag.Cached[]): Fig.Option[] {

  const figOptions: Fig.Option[] = []

  for (const flag of options) {

    const figOption: Fig.Option = {
      name: flag.char ? [`-${flag.char}`, `--${flag.name}`] : `--${flag.name}`,
      ...(flag.description && { description: description(flag.description) }),
      ...(flag.type === "option" && {
        args: {
          description: description(flag.helpValue),
          ...(flag.options?.length && { suggestions: flag.options }),
          ...(flag.default && { default: `${flag.default}` }),
        },
      }),
      ...(flag.required === true && { isRequired: true }),
      ...(flag.type === "boolean" && flag.allowNo && { exclusiveOn: [`--no-${flag.name}`] }),
      hidden: flag.hidden
    }

    figOptions.push(figOption)

    if (flag.type === "boolean" && flag.allowNo) {
      figOptions.push({
        name: `--no-${flag.name}`
      })
    }

  }

  return figOptions

}



function description(desc?: string): string | undefined {
  let d = desc
  if (d) {
    if (d.length > 80) {
      d = d.substring(0, d.indexOf('.')+1)
      if (d.length > 80) d = d.substring(0, 80)
    }
    if (d.endsWith('...') && (d.charAt(d.indexOf('...')-1) === '|')) d = d.replace('...', 'etc')
    d = clText.capitalize(d) || ''
    if (d.endsWith('.')) d = d.substring(0, d.length - 1)
    d = d.trim()
  }
  return d
}


function getFigSubcommands(commands: Command.Loadable[], hidden: boolean = false): Fig.Subcommand[] {

  const subcommands: Fig.Subcommand[] = []

  for (const command of commands) {

    // skip...
    if (['fig', 'cli:fig'].includes(command.id) // this command
      || processedCommands.includes(command.id) // command aliases
      || (command.hidden && !hidden)) continue  // hidden commands if no explicitely requested

    const options: Fig.Option[] = getFigOptions(Object.values(command.flags))
    const args: Fig.Arg[] = getFigArgs(Object.values(command.args))

    const commandNames = [command.id]
    if (command.aliases) command.aliases.forEach(a => { if (!commandNames.includes(a)) commandNames.push(a) })

    const subCommand: Fig.Subcommand = {
      name: (commandNames.length === 1) ? commandNames[0] : commandNames,
      ...(command.description && { description: description(command.description) }),
      ...(options.length && { options }),
      ...(args.length && { args: (args.length === 1) ? args[0] : args }),
      hidden: command.hidden
    }

    subcommands.push(subCommand)
    processedCommands.push(...commandNames) // mark command and its aliases as processed

  }

  return subcommands

}


const buildSpec = (spec: Fig.Spec): string => {
  return `/**
 * Autogenerated by @commercelayer/cli cli:fig command
 **/

const completionSpec: Fig.Spec = ${JSON.stringify(spec, null, 2)}


export default completionSpec
`
}


type ResClasses = {
  listable: string[]
  retrievable: string[]
  updatable: string[]
  creatable: string[]
  deletable: string[]
}


async function classifyResources(resUrl: string | URL): Promise<ResClasses> {

  const resources: any[] = (await (await fetch(resUrl)).json()).data

  const classes: ResClasses = {
    listable: [],
    retrievable: [],
    updatable: [],
    creatable: [],
    deletable: []
  }

  resources.filter(res => res.type === 'resources').forEach(res => {
    if (res.attributes?.actions) {
      const r = res.id as string
      const actions: string[] = res.attributes.actions
      if (actions.includes('list')) classes.listable.push(r)
      if (actions.includes('retrieve')) classes.retrievable.push(r)
      if (actions.includes('update')) classes.updatable.push(r)
      if (actions.includes('create')) classes.creatable.push(r)
      if (actions.includes('delete')) classes.deletable.push(r)
    }
  })

  return classes

}


function setCmdArgSuggestions(spec: Fig.Spec, cmd: string, res: string, suggestions: string[]): Fig.Spec {
  const args = (spec as Fig.Subcommand).subcommands?.find(res => res.name.includes(cmd))?.args
  if (args) {
    const arg = Array.isArray(args) ? args.find(a => a.name === res) : args
    if (arg) arg.suggestions = suggestions
  }
  return spec
}


async function enhanceSpec(spec: Fig.Spec): Promise<Fig.Spec> {

  let classes: ResClasses

  // CORE
  classes = await classifyResources('https://core.commercelayer.io/api/public/resources')

  setCmdArgSuggestions(spec, 'resources:list', 'resource', classes.listable.map(r => clText.pluralize(r)))
  setCmdArgSuggestions(spec, 'resources:retrieve', 'resource', classes.retrievable)
  setCmdArgSuggestions(spec, 'resources:update', 'resource', classes.updatable)
  setCmdArgSuggestions(spec, 'resources:create', 'resource', classes.creatable)
  setCmdArgSuggestions(spec, 'resources:delete', 'resource', classes.deletable)

  // PROVISIONING
  classes = await classifyResources('https://provisioning.commercelayer.co/api/public/resources')

  setCmdArgSuggestions(spec, 'provisioning:list', 'resource', classes.listable.map(r => clText.pluralize(r)))
  setCmdArgSuggestions(spec, 'provisioning:retrieve', 'resource', classes.retrievable)
  setCmdArgSuggestions(spec, 'provisioning:update', 'resource', classes.updatable)
  setCmdArgSuggestions(spec, 'provisioning:create', 'resource', classes.creatable)
  setCmdArgSuggestions(spec, 'provisioning:delete', 'resource', classes.deletable)


  return spec

}



export default class CliFig extends Command {

  static description = 'generate a Fig completion spec for Commerce Layer CLI'

  static hidden = true

  static flags = {
    dir: Flags.directory({
      char: 'd',
      description: 'directory where to save the output spec file',
      exclusive: ['install']
    }),
    hidden: Flags.boolean({
      char: 'h',
      description: 'include hidden commands'
    }),
    install: Flags.boolean({
      char: 'i',
      description: 'copy into Fig specs directory',
      exclusive: ['dir']
    }),
    blind: Flags.boolean({
      char: 'b',
      description: 'execute in blind mode without terminal output',
      hidden: true,
      exclusive: ['install']
    })
  }



  public async run(): Promise<void> {

    const { flags } = await this.parse(CliFig)

    const spec: Fig.Spec = {
      name: this.config.name,
      subcommands: getFigSubcommands(this.config.commands)
    }

    await enhanceSpec(spec)

    const template = await format(buildSpec(spec), { parser: 'typescript', printWidth: 80 })

    if (flags.dir || flags.install) {

      const fileName = `${SPEC_NAME}.ts`

      let fileDir = '.'
      if (flags.dir) fileDir = clUtil.specialFolder(flags.dir)
      else if (flags.install) fileDir = FIG_SPECS_DIR

      const filePath = join(fileDir, fileName)
      cliux.action.start(`Generating spec file ${filePath}`)
      writeFileSync(filePath, template, { encoding: 'utf8', flag: 'w' })
      cliux.action.stop()

    }
    else if (!flags.blind) this.log(template)

  }

}
