import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, mockQuery, useMockedApi } from '../../helpers'

describe('metrics:date_breakdown', () => {
  useMockedApi()

  it('sends the date breakdown query and prints one block per date', async () => {
    const q = mockQuery('orders/date_breakdown', 200, {
      data: [
        { date: '2026-01-01T00:00:00Z', value: 3 },
        { date: '2026-02-01T00:00:00Z', value: 8 },
      ],
    })
    const { stdout, error } = await runCommand(['metrics:date_breakdown', 'orders', ...AUTH, '-b', 'order.placed_at', '-f', 'order.id', '-O', 'value_count', '-i', 'month'])
    expect(error).to.equal(undefined)
    expect(q.body.date_breakdown).to.deep.equal({ by: 'order.placed_at', field: 'order.id', operator: 'value_count', interval: 'month' })
    expect(stdout).to.contain('value_count = 3')
    expect(stdout).to.contain('value_count = 8')
  })

  it('prints every stat of an object operator', async () => {
    mockQuery('orders/date_breakdown', 200, { data: [{ date: '2026-01-01T00:00:00Z', value: { count: 2, min: 10, max: 30, avg: 20, sum: 40 } }] })
    const { stdout } = await runCommand(['metrics:date_breakdown', 'orders', ...AUTH, '-b', 'order.placed_at', '-f', 'order.total_amount', '-O', 'stats'])
    expect(stdout).to.match(/avg: 20/)
    expect(stdout).to.match(/sum: 40/)
  })
})
