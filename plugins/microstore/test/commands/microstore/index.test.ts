import { expect, test } from '@oclif/test'
import { AUTH, api, apiError, ORG, resource, single, TOKEN, token, useMockedApi } from '../../helpers'

describe('microstore', () => {
  useMockedApi()

  const BASE = `https://${ORG}.commercelayer.app/microstore/list/sKl1?accessToken=${TOKEN}`
  const skuList = () => api().get('/api/sku_lists/sKl1').reply(200, single(resource('sku_lists', 'sKl1', { name: 'Summer' })))

  test
    .do(skuList)
    .stdout()
    .command(['microstore', ...AUTH, '-S', 'sKl1'])
    .it('prints the microstore URL of the SKU list', (ctx) => {
      expect(ctx.stdout).to.contain('Microstore URL for sku list sKl1')
      expect(ctx.stdout).to.contain(BASE)
    })

  test
    .do(skuList)
    .stdout()
    .command(['microstore', ...AUTH, '-S', 'sKl1', '-A', '-C', '-I'])
    .it('adds the Buy All, Cart and inline options', (ctx) => {
      expect(ctx.stdout).to.contain(`${BASE}&all=true&cart=true&inline=true`)
    })

  test
    .do(skuList)
    .stdout()
    .command(['microstore', ...AUTH, '-S', 'sKl1', '--staging'])
    .it('builds a staging URL', (ctx) => {
      expect(ctx.stdout).to.contain(`https://${ORG}.stg.commercelayer.app/microstore/list/sKl1`)
    })

  test
    .command(['microstore', ...AUTH, '-S', 'sKl1', '-I'])
    .catch(/cart/)
    .it('requires the cart for the inline option')

  test
    .do(() => {
      api().get('/api/sku_lists/nope').reply(404, apiError(404, 'Record not found'))
    })
    .command(['microstore', ...AUTH, '-S', 'nope'])
    .catch(/Record not found|not found/)
    .it('reports a missing SKU list')

  test
    .command(['microstore', '-o', ORG, '-a', token('integration'), '-S', 'sKl1'])
    .catch(/Invalid application kind: integration/)
    .it('requires a sales channel token')
})
