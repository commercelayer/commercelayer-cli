import { expect } from 'chai'
import { runCommand } from '@oclif/test'


describe('orders:save_billing_address_to_customer_address_book', () => {
  it('runs NoC', async () => {
    const { stdout } = await runCommand<{ name: string }>(['orders:noc'])
    expect(stdout).to.contain('-= NoC =-')
  }).timeout(31000)
})

