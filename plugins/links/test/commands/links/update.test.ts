import { expect, test } from '@oclif/test'
import { AUTH, api, link, resource, single, useMockedApi } from '../../helpers'

describe('links:update', () => {
  useMockedApi()

  const updated = single(link('lnK1', { name: 'Autumn link' }), [resource('skus', 'skuId')])

  test
    .do(() => {
      api()
        .get('/api/links/lnK1')
        .reply(200, single(link('lnK1')))
        .patch('/api/links/lnK1', (body) => body.data.attributes.name === 'Autumn link' && !('domain' in body.data.attributes))
        .query(true)
        .reply(200, updated)
    })
    .stdout()
    .command(['links:update', 'lnK1', ...AUTH, '-n', 'Autumn link'])
    .it('updates only the given fields', (ctx) => {
      expect(ctx.stdout).to.contain('update link lnK1')
    })

  test
    .do(() => {
      api()
        .get('/api/links/lnK1')
        .reply(200, single(link('lnK1')))
        .patch('/api/links/lnK1', (body) => body.data.attributes.domain === 'links.example.com')
        .query(true)
        .reply(200, updated)
    })
    .stdout()
    .command(['links:update', 'lnK1', ...AUTH, '-D', 'links.example.com'])
    .it('updates the link domain when given explicitly', (ctx) => {
      expect(ctx.stdout).to.contain('update link lnK1')
    })

  test
    .command(['links:update', 'lnK1', ...AUTH])
    .catch(/At least one field of link lnK1 must be updated/)
    .it('requires something to update')
})
