import { expect, test } from '@oclif/test'
import { AUTH, api, link, single, useMockedApi } from '../../helpers'

describe('links:enable', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .patch('/api/links/lnK1', (body) => body.data.attributes._enable === true)
        .reply(200, single(link('lnK1')))
    })
    .stdout()
    .command(['links:enable', 'lnK1', ...AUTH])
    .it('enables the link', (ctx) => {
      expect(ctx.stdout).to.contain('enabled link with id lnK1')
    })
})
