import { expect, test } from '@oclif/test'
import { AUTH, api, link, single, useMockedApi } from '../../helpers'

describe('links:disable', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .patch('/api/links/lnK1', (body) => body.data.attributes._disable === true)
        .reply(200, single(link('lnK1', { active: false, status: 'disabled' })))
    })
    .stdout()
    .command(['links:disable', 'lnK1', ...AUTH])
    .it('disables the link', (ctx) => {
      expect(ctx.stdout).to.contain('disabled link with id lnK1')
    })
})
