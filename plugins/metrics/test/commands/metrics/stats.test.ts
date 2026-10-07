import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, mockQuery, token, useMockedApi } from '../../helpers'

describe('metrics:stats', () => {
  useMockedApi()

  it('sends the stats query and prints the value', async () => {
    const q = mockQuery('orders/stats', 200, { data: { value: 1234.5 } })
    const { stdout, error } = await runCommand(['metrics:stats', 'orders', ...AUTH, '-f', 'order.total_amount', '-O', 'avg'])
    expect(error).to.equal(undefined)
    expect(q.body).to.deep.equal({ stats: { field: 'order.total_amount', operator: 'avg' } })
    expect(stdout).to.contain('avg(order.total_amount) = 1234.5')
  })

  it('prints every stat of the stats operator', async () => {
    mockQuery('returns/stats', 200, { data: { value: { count: 4, min: 1, max: 9, avg: 5, sum: 20 } } })
    const { stdout } = await runCommand(['metrics:stats', 'returns', ...AUTH, '-f', 'return.id', '-O', 'stats'])
    expect(stdout).to.match(/count: 4/)
    expect(stdout).to.match(/max: 9/)
  })

  it('accepts a webapp access token', async () => {
    mockQuery('orders/stats', 200, { data: { value: 1 } })
    const { error } = await runCommand(['metrics:stats', 'orders', '-o', 'test-org', '-a', token('webapp'), '-f', 'order.id', '-O', 'value_count'])
    expect(error).to.equal(undefined)
  })

  it('rejects other application kinds', async () => {
    const { error } = await runCommand(['metrics:stats', 'orders', '-o', 'test-org', '-a', token('sales_channel'), '-f', 'order.id', '-O', 'value_count'])
    expect(error?.message).to.contain('Invalid application kind: sales_channel')
  })

  it('rejects an unknown resource', async () => {
    const { error } = await runCommand(['metrics:stats', 'skus', ...AUTH, '-f', 'sku.id', '-O', 'value_count'])
    expect(error?.message).to.match(/Expected skus to be one of: orders, returns, carts/)
  })
})
