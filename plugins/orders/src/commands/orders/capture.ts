import Command from '../../base'


export default class OrdersCapture extends Command {

	static description = 'capture an order'

	static hidden = false

	static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

		const { args, flags } = this.parse(OrdersCapture)

		const cl = this.commercelayerInit(flags)

		const result = cl.orders.update({ id: args.id, _capture: true })

		return result

	}

}
