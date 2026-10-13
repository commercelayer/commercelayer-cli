import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, mockQuery, useMockedApi } from '../../helpers'

describe('metrics:fbt', () => {
  useMockedApi()

  it('asks for the items bought together with the given ones and prints one line per item', async () => {
    const q = mockQuery('analysis/fbt', 200, {
      data: [
        { item_id: 'sku2', value: 5, type: 'skus', name: 'Socks' },
        { item_id: 'bnd1', value: 2, type: 'bundles' },
      ],
    })
    const { stdout, error } = await runCommand(['metrics:fbt', ...AUTH, '-i', 'sku1,sku3'])
    expect(error).to.equal(undefined)
    expect(q.body).to.deep.equal({ filter: { line_items: { item_ids: { in: ['sku1', 'sku3'] } } } })
    expect(stdout).to.match(/Socks.*\(skus sku2\).*5/)
    expect(stdout).to.match(/bnd1.*\(bundles bnd1\).*2/)
    expect(stdout).to.not.contain('[object Object]')
  })

  it('collects the IDs of repeated --in flags', async () => {
    const q = mockQuery('analysis/fbt', 200, { data: [] })
    const { stdout } = await runCommand(['metrics:fbt', ...AUTH, '-i', 'sku1', '-i', 'sku2, sku3'])
    expect(q.body.filter.line_items.item_ids.in).to.deep.equal(['sku1', 'sku2', 'sku3'])
    expect(stdout).to.contain('No data found')
  })

  it('requires the item IDs', async () => {
    const { error } = await runCommand(['metrics:fbt', ...AUTH])
    expect(error?.message).to.match(/Missing required flag in/)
  })

  it('refuses a filter: the FBT query only takes item IDs', async () => {
    const { error } = await runCommand(['metrics:fbt', ...AUTH, '-i', 'sku1', '-F', '{"order":{"market_code_eq":"EU"}}'])
    expect(error?.message).to.match(/Nonexistent flag|Unexpected argument/)
  })

  it('prints the API errors', async () => {
    mockQuery('analysis/fbt', 400, { errors: [{ title: 'Bad request', detail: 'invalid filter' }] })
    const { stdout } = await runCommand(['metrics:fbt', ...AUTH, '-i', 'sku1'])
    expect(stdout).to.contain('invalid filter')
  })
})
