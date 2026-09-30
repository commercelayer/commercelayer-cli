import { expect, test } from '@oclif/test'
import { AUTH, api, apiError, link, single, useMockedApi } from '../../helpers'

describe('links:open', () => {
  useMockedApi()

  test
    .do(() => {
      api().get('/api/links/nope').reply(404, apiError(404, 'Record not found'))
    })
    .stdout()
    .command(['links:open', 'nope', ...AUTH])
    .exit(0)
    .it('says when the link does not exist', (ctx) => {
      expect(ctx.stdout).to.contain('Link nope not found')
    })

  test
    .do(() => {
      api().get('/api/links/lnK1').reply(200, single(link('lnK1', { url: null })))
    })
    .command(['links:open', 'lnK1', ...AUTH])
    .catch(/Link's URL is empty/)
    .it('fails when the link has no URL')
})
