import { expect, test } from '@oclif/test'
import { AUTH, api, link, list, single, useMockedApi } from '../../helpers'

describe('links', () => {
  useMockedApi()

  test
    .do(() => {
      api().get('/api/links').query(true).reply(200, list([link('lnK1')]))
    })
    .stdout()
    .command(['links', ...AUTH])
    .it('lists the links without an ID', (ctx) => {
      expect(ctx.stdout).to.contain('lnK1')
    })

  test
    .do(() => {
      api().get('/api/links/lnK1').query(true).reply(200, single(link('lnK1')))
    })
    .stdout()
    .command(['links', 'lnK1', ...AUTH])
    .it('shows the details with an ID', (ctx) => {
      expect(ctx.stdout).to.contain('Summer link')
    })
})
