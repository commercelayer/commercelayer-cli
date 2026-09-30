import { expect, test } from '@oclif/test'
import { AUTH, api, list, single, useMockedApi, webhook } from '../../helpers'

describe('webhooks', () => {
  useMockedApi()

  test
    .do(() => {
      api().get('/api/webhooks').query(true).reply(200, list([webhook('wHk1')]))
    })
    .stdout()
    .command(['webhooks', ...AUTH])
    .it('lists the webhooks without an ID', (ctx) => {
      expect(ctx.stdout).to.contain('wHk1')
    })

  test
    .do(() => {
      api().get('/api/webhooks/wHk1').query(true).reply(200, single(webhook('wHk1')))
    })
    .stdout()
    .command(['webhooks', 'wHk1', ...AUTH])
    .it('shows the details with an ID', (ctx) => {
      expect(ctx.stdout).to.contain('orders.place')
    })
})
