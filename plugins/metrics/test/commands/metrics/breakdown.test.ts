import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, apiError, mockQuery, token, useMockedApi } from '../../helpers'

describe('metrics:breakdown', () => {
  useMockedApi()

  const ARGS = ['metrics:breakdown', 'orders', ...AUTH, '-b', 'order.country_code', '-f', 'order.id', '-O', 'value_count']

  it('sends the breakdown query and prints the results, nested ones included', async () => {
    const q = mockQuery('orders/breakdown', 200, {
      data: {
        'order.country_code': [
          { label: 'IT', value: 12, 'line_items.name': [{ label: 'T-shirt', value: 7 }] },
          { label: 'US', value: 5 },
        ],
      },
    })
    const { stdout, error } = await runCommand([...ARGS, '-s', 'desc', '-l', '20', '-c', 'gte=5', '-F', '{"order":{"placed_at_gte":"2026-01-01"}}'])
    expect(error).to.equal(undefined)
    expect(q.body).to.deep.equal({
      breakdown: { by: 'order.country_code', field: 'order.id', operator: 'value_count', condition: { gte: '5' }, sort: 'desc', limit: 20 },
      filter: { order: { placed_at_gte: '2026-01-01' } },
    })
    expect(stdout).to.contain('IT: 12')
    expect(stdout).to.contain('T-shirt: 7')
    expect(stdout).to.contain('US: 5')
  })

  it('turns an interval condition into a pair of values', async () => {
    const q = mockQuery('orders/breakdown', 200, { data: { 'order.country_code': [] } })
    await runCommand([...ARGS, '-c', 'gte_lte=1,10'])
    expect(q.body.breakdown.condition).to.deep.equal({ gte_lte: ['1', '10'] })
  })

  it('rejects an invalid condition', async () => {
    const { error } = await runCommand([...ARGS, '-c', 'between=1'])
    expect(error?.message).to.contain('Invalid condition name: between')
  })

  it('rejects an invalid filter', async () => {
    const { error } = await runCommand([...ARGS, '-F', '{notjson'])
    expect(error?.message).to.contain('Invalid filter format')
  })

  it('prints the API error', async () => {
    mockQuery('orders/breakdown', 422, apiError(422, 'Invalid field'))
    const { stdout } = await runCommand(ARGS)
    expect(stdout).to.contain('Invalid field')
  })

  it('rejects an access token of another organization', async () => {
    const { error } = await runCommand(['metrics:breakdown', 'orders', '-o', 'test-org', '-a', token('integration', 'other-org'), '-b', 'x', '-f', 'y', '-O', 'sum'])
    expect(error?.message).to.contain('belongs to a wrong organization: other-org')
  })
})
