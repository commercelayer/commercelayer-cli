import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, link, resource, single, useMockedApi } from '../../helpers'

describe('links:update', () => {
  useMockedApi()

  const updated = single(link('lnK1', { name: 'Autumn link' }), [resource('skus', 'skuId')])

  it('updates only the given fields', async () => {
    api()
      .get('/api/links/lnK1')
      .reply(200, single(link('lnK1')))
      .patch('/api/links/lnK1', (body) => body.data.attributes.name === 'Autumn link' && !('domain' in body.data.attributes))
      .query(true)
      .reply(200, updated)
    const ctx = await runCommand(['links:update', 'lnK1', ...AUTH, '-n', '"Autumn link"'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('update link lnK1')
  })

  it('updates the link domain when given explicitly', async () => {
    api()
      .get('/api/links/lnK1')
      .reply(200, single(link('lnK1')))
      .patch('/api/links/lnK1', (body) => body.data.attributes.domain === 'links.example.com')
      .query(true)
      .reply(200, updated)
    const ctx = await runCommand(['links:update', 'lnK1', ...AUTH, '-D', 'links.example.com'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('update link lnK1')
  })

  it('requires something to update', async () => {
    const ctx = await runCommand(['links:update', 'lnK1', ...AUTH])
    expect(ctx.error?.message).to.match(/At least one field of link lnK1 must be updated/)
  })
})
