import { expect, test } from '@oclif/test'
import { AUTH, api, apiError, link, resource, single, useMockedApi } from '../../helpers'

describe('links:details', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .get('/api/links/lnK1')
        .query((q) => q.include === 'item')
        .reply(200, single(link('lnK1'), [resource('skus', 'skuId', { code: 'TSHIRT-M' })]))
    })
    .stdout()
    .command(['links:details', 'lnK1', ...AUTH])
    .it('shows the link attributes and its item', (ctx) => {
      expect(ctx.stdout).to.contain('Summer link')
      expect(ctx.stdout).to.contain('https://test-org.c11r.link/lnK1')
      expect(ctx.stdout).to.contain('skuId')
    })

  test
    .do(() => {
      api().get('/api/links/nope').query(true).reply(404, apiError(404, 'Record not found'))
    })
    .stdout()
    .command(['links:details', 'nope', ...AUTH])
    .exit(0)
    .it('says when the link does not exist', (ctx) => {
      expect(ctx.stdout).to.contain('Link nope not found')
    })

  test
    .do(() => {
      api().get('/api/links/lnK1').query(true).reply(401, apiError(401, 'Invalid token'))
    })
    .command(['links:details', 'lnK1', ...AUTH])
    .catch(/Invalid token/)
    .it('reports other API errors instead of exiting silently')
})
