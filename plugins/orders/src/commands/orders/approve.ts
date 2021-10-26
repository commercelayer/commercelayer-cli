import Command from '../../base'


export default class OrdersApprove extends Command {

	static description = 'approve an order'

	static hidden = false

	static flags = {
		...Command.flags,
	}

	static args = [
		...Command.args,
	]


	async run() {

		const { args, flags } = this.parse(OrdersApprove)

		const cl = this.commercelayerInit(flags)

		const result = cl.orders.update({ id: args.id, _approve: true })

		return result

	}

}
