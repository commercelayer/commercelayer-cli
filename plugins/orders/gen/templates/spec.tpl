import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, resource, single, useMockedApi } from '../../helpers'

describe('orders:##__ACTION_ID__##', () => {
  useMockedApi()

  it('sends the _##__ACTION_ID__## trigger', async function () {
    this.timeout(##__SPEC_TIMEOUT__##)
    api()
      .get('/api/orders/oRd1')
      .query(true)
      .reply(200, single(resource('orders', 'oRd1')))
      .patch('/api/orders/oRd1', (body) => body.data.attributes._##__ACTION_ID__## === ##__TRIGGER_VALUE__##)
      .query(true)
      .reply(200, single(resource('orders', 'oRd1')))
    const ctx = await runCommand(['orders:##__ACTION_ID__##', 'oRd1', ...AUTH##__TRIGGER_VALUE_ARGS__##])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Action ##__ACTION_ID__## executed without errors on order oRd1')
  })
})
