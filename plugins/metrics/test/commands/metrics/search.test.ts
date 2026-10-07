import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, mockQuery, useMockedApi } from '../../helpers'

describe('metrics:search', () => {
  useMockedApi()

  it('sends the search query and prints records, count and cursor', async () => {
    const q = mockQuery('orders/search', 200, {
      data: [{ order: { id: 'ord1', number: '1234' } }],
      meta: { pagination: { record_count: 42, cursor: 'nextPage' } },
    })
    const { stdout, error } = await runCommand(['metrics:search', 'orders', ...AUTH, '-f', 'order.id,order.number', '-f', 'customer.email', '-l', '10', '-b', 'order.placed_at', '-s', 'asc'])
    expect(error).to.equal(undefined)
    expect(q.body.search).to.deep.equal({ fields: ['order.id', 'order.number', 'customer.email'], limit: 10, sort: 'asc', sort_by: 'order.placed_at' })
    expect(stdout).to.contain('1234')
    expect(stdout).to.contain('Record count: 42')
    expect(stdout).to.contain('Cursor: nextPage')
  })

  it('requires sort_by with sort', async () => {
    const { error } = await runCommand(['metrics:search', 'orders', ...AUTH, '-f', 'order.id', '-s', 'asc'])
    expect(error?.message).to.contain('sort_by')
  })
})
