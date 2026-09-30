import { expect, test } from '@oclif/test'
import { AUTH, api, list, resource, single, useMockedApi } from '../../helpers'

describe('resources:get', () => {
  useMockedApi()

  test
    .do(() => {
      api().get('/api/skus').query(true).reply(200, list([resource('skus', 'sKu1', { code: 'TSHIRT' })]))
    })
    .stdout()
    .command(['resources:get', 'skus', ...AUTH])
    .it('lists without an ID', (ctx) => {
      expect(ctx.stdout).to.contain('TSHIRT')
    })

  test
    .do(() => {
      api().get('/api/skus/sKu1').query(true).reply(200, single(resource('skus', 'sKu1', { code: 'TSHIRT' })))
    })
    .stdout()
    .command(['resources:get', 'skus/sKu1', ...AUTH])
    .it('retrieves with an ID', (ctx) => {
      expect(ctx.stdout).to.contain('TSHIRT')
    })
})
