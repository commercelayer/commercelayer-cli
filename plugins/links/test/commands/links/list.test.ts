import { expect, test } from '@oclif/test'
import { AUTH, api, apiError, link, list, resource, useMockedApi } from '../../helpers'

describe('links:list', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .get('/api/links')
        .query((q) => q.sort === '-expires_at,-starts_at' && q.include === 'item')
        .reply(200, list([link('lnK1'), link('lnK2', { name: 'Winter link' })], [resource('skus', 'skuId', { code: 'TSHIRT-M' })]))
    })
    .stdout()
    .command(['links:list', ...AUTH])
    .it('lists the links, by expiration date', (ctx) => {
      expect(ctx.stdout).to.contain('lnK1')
      expect(ctx.stdout).to.contain('Winter link')
    })

  test
    .do(() => {
      api()
        .get('/api/links')
        .query((q) => q['filter[q][name_cont]'] === 'Summer' && q['filter[q][scope_cont]'] === 'market')
        .reply(200, list([link('lnK1')]))
    })
    .stdout()
    .command(['links:list', ...AUTH, '-n', 'Summer', '-S', 'market'])
    .it('filters by name and scope', (ctx) => {
      expect(ctx.stdout).to.contain('lnK1')
    })

  test
    .do(() => {
      api().get('/api/links').query(true).reply(200, list([]))
    })
    .stdout()
    .command(['links:list', ...AUTH])
    .it('says when there are no links', (ctx) => {
      expect(ctx.stdout).to.contain('No links found')
    })

  test
    .command(['links:list', ...AUTH, '-l', '0'])
    .catch(/Limit must be a positive integer/)
    .it('rejects a non-positive limit')

  test
    .do(() => {
      api().get('/api/links').query(true).reply(401, apiError(401, 'Invalid token', 'The access token you provided is invalid.'))
    })
    .command(['links:list', ...AUTH])
    .catch(/Invalid token/)
    .it('reports an invalid access token')
})
