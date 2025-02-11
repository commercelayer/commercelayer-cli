import Command, { Args, Flags } from '../../base'
import { clOutput, clColor } from '@commercelayer/cli-core'
import type { CommandError } from '@oclif/core/lib/interfaces'



export default class ExportsInterrupt extends Command {

  static description = 'show the details of an existing export'

  static aliases = ['exp:interrupt']

  static examples = [
    '$ commercelayer exports:interrupt <export-id>',
    '$ cl exp:interrupt <export-id>'
  ]


  static flags = {
    details: Flags.boolean({
      char: 'D',
      description: 'show export details after command execution'
    })
  }


  static args = {
    id: Args.string({ name: 'id', description: 'id of the export resource', required: true, hidden: false })
  }



  async run(): Promise<any> {

    const { args, flags } = await this.parse(ExportsInterrupt)

    const id = args.id

    this.commercelayerInit(flags)


    try {

      let exp = await this.cl.exports.retrieve(id)

      this.log()
      if (['completed', 'interrupted'].includes(exp.status)) this.log(`Export ${clColor.api.id(id)} is already ${this.exportStatus(exp.status)}.`)
      else {
        exp = await this.cl.exports._interrupt(id)
        if (exp.status === 'interrupted') this.log(`Export ${clColor.api.id(id)} has been successfully ${this.exportStatus(exp.status)}.`)
        else this.log(`Something went wrong. Export ${clColor.api.id(id)} is still ${this.exportStatus(exp.status)}.`)
      }
      this.log()
      
      if (flags.details) this.log(clOutput.printObject(exp))


      return exp

    } catch (error) {
      this.handleError(error as CommandError, flags, id)
    }

  }

}
