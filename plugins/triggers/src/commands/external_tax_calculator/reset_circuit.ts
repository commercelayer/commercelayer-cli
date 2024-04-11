import Command from '../../base'
import { triggers } from '../../triggers/external_tax_calculators'
import { type ExternalTaxCalculator } from '@commercelayer/sdk'


const TRIGGER = 'reset_circuit'


export default class ExternalTaxCalculatorResetCircuit extends Command {

	static description = triggers[TRIGGER].description

  static flags = {
		
	}

	static args = {
		...Command.args,
  }


	async run(): Promise<any> {

    const { args, flags } = await this.parse(ExternalTaxCalculatorResetCircuit)

		const res = await this.executeAction<ExternalTaxCalculator>('external_tax_calculators', args.id, TRIGGER, flags)

    if (flags.print) this.printOutput(res, flags)

    this.successMessage('external_tax_calculator', TRIGGER, res.id)

    return res

	}

}
