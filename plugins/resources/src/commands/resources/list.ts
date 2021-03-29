import Command, { flags } from '../../base'

export default class ResourcesList extends Command {
  static description = 'describe the command here'

  static aliases = ['list', 'rl']

  static flags = {
    ...Command.flags,
    include: flags.string({
      char: 'i',
      multiple: true,
      description: 'comma separated resources to include',
    }),
    fields: flags.string({
      char: 'f',
      multiple: true,
      description: 'comma separeted list of fields in the format [resource]=field1,field2...',
    }),
  }

  static args = [ ]

  async run() {

    const { flags } = this.parse(ResourcesList)

    this.log(JSON.stringify(flags))

  }

}
