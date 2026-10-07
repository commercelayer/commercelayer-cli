import { expect, test } from '@oclif/test'
import { AUTH, api, notFound, single, useMockedApi, webhook } from '../../helpers'

describe('webhooks:reset', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .patch('/api/webhooks/wHk1', (body) => body.data.attributes._reset_circuit === true)
        .reply(200, single(webhook('wHk1')))
    })
    .stdout()
    .command(['webhooks:reset', 'wHk1', ...AUTH])
    .it('resets the circuit breaker', (ctx) => {
      expect(ctx.stdout).to.contain('circuit breaker associated to the webhook wHk1 has been successfully reset')
    })

  test
    .do(() => {
      api().patch('/api/webhooks/nope').reply(404, notFound())
    })
    .command(['webhooks:reset', 'nope', ...AUTH])
    .catch(/Unable to find webhook with id nope/)
    .it('reports a missing webhook as a command error')
})
