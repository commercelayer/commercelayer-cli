import Command from '../../base'


export default class OrdersIndex extends Command {

	static description = 'describe the command here'

	static aliases = ['orders:list']

	static flags = {
		...Command.flags,
	}


	async run() {

		const { flags } = this.parse(OrdersIndex)

		const cl = this.commercelayerInit(flags)

		try {

			const res = await cl.orders.list()

			if (res && res.length > 0) res.forEach(r => {
				console.log(r)
			})

		} catch (error) {
			console.log(error)
		}

	}

}
