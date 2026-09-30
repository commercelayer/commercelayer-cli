import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, list, single, useMockedApi, webhook } from '../../helpers'

describe('webhooks', () => {
  useMockedApi()

  it('lists the webhooks without an ID', async () => {
    api().get('/api/webhooks').query(true).reply(200, list([webhook('wHk1')]))
    const ctx = await runCommand(['webhooks', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('wHk1')
  })

  it('shows the details with an ID', async () => {
    api().get('/api/webhooks/wHk1').query(true).reply(200, single(webhook('wHk1')))
    const ctx = await runCommand(['webhooks', 'wHk1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('orders.place')
  })
})
