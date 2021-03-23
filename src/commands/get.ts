import {Command, flags} from '@oclif/command'

export default class Get extends Command {
  static description = 'Get resources from Commerce Layer'

  static flags = {
    help: flags.help({char: 'h'}),
    includes: flags.string({char: 'i', multiple: true, description: 'comma separated resources to include'}),
    // flag with a value (-n, --name=VALUE)
    // name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    // force: flags.boolean({char: 'f'}),
  }

  static args = [
    {name: 'resource', required: true, options: ['customers', 'orders'],
      // parse: (input: string) => input.toLowerCase()
    },
    {name: 'id'},
  ]

  async run() {
    const {args, flags} = this.parse(Get)

    const incargs = flags.includes.map(i => {
      return i.split(',').map(t => t.trim())
    })

    const includes: string[] = []
    incargs.forEach(a => includes.push(...a))

    const resource = args.resource
    const id = args.id

    this.log(resource)
    this.log(id)

    this.log(includes.join(','))

    /*
    const name = flags.name ?? 'world'
    this.log(`hello ${name} from /Users/pierlu/Documents/GitHub/commercelayer-cli-new/src/commands/get.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
    */
  }
}
