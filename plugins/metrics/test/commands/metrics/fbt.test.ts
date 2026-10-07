import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, mockQuery, useMockedApi } from '../../helpers'

describe('metrics:fbt', () => {
  useMockedApi()

  it('asks for the items bought together with the given ones', async () => {
    const q = mockQuery('analysis/fbt', 200, { data: [{ id: 'sku2', label: 'Socks', value: 5 }] })
    const { stdout, error } = await runCommand(['metrics:fbt', ...AUTH, '-i', 'sku1,sku3'])
    expect(error).to.equal(undefined)
    expect(q.body).to.deep.equal({ filter: { line_items: { item_ids: { in: ['sku1', 'sku3'] } } } })
    expect(stdout).to.not.contain('No data found')
  })

  it('sends an empty query without item IDs', async () => {
    const q = mockQuery('analysis/fbt', 200, { data: [] })
    const { stdout } = await runCommand(['metrics:fbt', ...AUTH, '-F', '{"order":{"market_code_eq":"EU"}}'])
    // MetricsQueryFbt only allows a filter on line_items.item_ids
    expect(q.body).to.deep.equal({})
    expect(stdout).to.contain('No data found')
  })
})
