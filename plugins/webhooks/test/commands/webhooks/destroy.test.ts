import { expect, test } from '@oclif/test'
import { AUTH, api, notFound, useMockedApi } from '../../helpers'

describe('webhooks:destroy', () => {
  useMockedApi()

  test
    .do(() => {
      api().delete('/api/webhooks/wHk1').reply(204)
    })
    .stdout()
    .command(['webhooks:destroy', 'wHk1', ...AUTH])
    .it('destroys the webhook', (ctx) => {
      expect(ctx.stdout).to.contain('destroyed webhook with id wHk1')
    })

  test
    .do(() => {
      api().delete('/api/webhooks/nope').reply(404, notFound())
    })
    .command(['webhooks:destroy', 'nope', ...AUTH])
    .catch(/Unable to find webhook with id nope/)
    .it('reports a missing webhook as a command error')
})
