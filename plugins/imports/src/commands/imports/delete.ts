import Command from '../../base'
import chalk from 'chalk'
import CommerceLayer from '@commercelayer/sdk'
import ImportsDetails from './details'


export default class ImportsDelete extends Command {

  static description = 'delete an existing import'

  static aliases = ['imp:delete']

  static examples = [
		'$ commercelayer imports:delete <import-id>>',
		'$ cl imp:delete <import-id>>',
	]

  static flags = {
		...Command.flags,
	}

	static args = [
		...ImportsDetails.args,
	]


  async run() {

    const { args, flags } = this.parse(ImportsDelete)

    const organization = flags.organization
    const accessToken = flags.accessToken
    const domain = flags.domain
    const id = args.id

    // eslint-disable-next-line new-cap
    const cl = CommerceLayer({
      organization,
      domain,
      accessToken,
    })


    cl.imports.delete(id)
      .then(() => this.log(`\n${chalk.greenBright('Successfully')} deleted import with id ${chalk.bold(id)}\n`))
      .catch(error => this.printError(error))

  }

}
