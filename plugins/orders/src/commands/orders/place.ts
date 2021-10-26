import Command from '../../base'


export default class OrdersPlace extends Command {

	static description = 'place an order'

	static hidden = false

	static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

		const { args, flags } = this.parse(OrdersPlace)

		const cl = this.commercelayerInit(flags)

		const result = cl.orders.update({ id: args.id, _place: true })

		return result

	}

}
