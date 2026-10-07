import { expect, test } from '@oclif/test'
import { AUTH, api, apiError, useMockedApi } from '../../helpers'

describe('links:delete', () => {
  useMockedApi()

  test
    .do(() => {
      api().delete('/api/links/lnK1').reply(204)
    })
    .stdout()
    .command(['links:delete', 'lnK1', ...AUTH])
    .it('deletes the link', (ctx) => {
      expect(ctx.stdout).to.contain('deleted link with id lnK1')
    })

  test
    .do(() => {
      api().delete('/api/links/nope').reply(404, apiError(404, 'Record not found'))
    })
    .stdout()
    .command(['links:delete', 'nope', ...AUTH])
    .exit(0)
    .it('says when the link does not exist', (ctx) => {
      expect(ctx.stdout).to.contain('Link nope not found')
      expect(ctx.stdout).not.to.contain('Successfully')
    })

  test
    .do(() => {
      api().delete('/api/links/lnK1').reply(500, apiError(500, 'Internal server error'))
    })
    .stdout()
    .command(['links:delete', 'lnK1', ...AUTH])
    .catch(/Internal server error/)
    .it('reports a failed deletion instead of claiming success', (ctx) => {
      expect(ctx.stdout).not.to.contain('Successfully')
    })
})
