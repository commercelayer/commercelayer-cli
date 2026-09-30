import { expect, test } from '@oclif/test'
import { AUTH, api, resource, single, useMockedApi } from '../../helpers'

describe('orders:##__ACTION_ID__##', () => {
  useMockedApi()

  test
    .timeout(##__SPEC_TIMEOUT__##)
    .do(() => {
      api()
        .get('/api/orders/oRd1')
        .query(true)
        .reply(200, single(resource('orders', 'oRd1')))
        .patch('/api/orders/oRd1', (body) => body.data.attributes._##__ACTION_ID__## === ##__TRIGGER_VALUE__##)
        .query(true)
        .reply(200, single(resource('orders', 'oRd1')))
    })
    .stdout()
    .command(['orders:##__ACTION_ID__##', 'oRd1', ...AUTH##__TRIGGER_VALUE_ARGS__##])
    .it('sends the _##__ACTION_ID__## trigger', (ctx) => {
      expect(ctx.stdout).to.contain('Action ##__ACTION_ID__## executed without errors on order oRd1')
    })
})
