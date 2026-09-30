import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, apiError, single, useMockedApi, webhook } from '../../helpers'

describe('webhooks:create', () => {
  useMockedApi()

  it('creates the webhook', async () => {
    api()
      .post('/api/webhooks', (body) => {
        const { attributes } = body.data
        return (
          attributes.topic === 'orders.place' &&
          attributes.callback_url === 'https://hooks.example.com/orders' &&
          attributes.name === 'Order placed' &&
          attributes.include_resources.join() === 'customer,line_items'
        )
      })
      .reply(201, single(webhook('wHk1')))
    const ctx = await runCommand(['webhooks:create', ...AUTH, '-t', 'orders.place', '-u', 'https://hooks.example.com/orders', '-n', '"Order placed"', '-i', 'customer,line_items'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('created new webhook with topic orders.place and id wHk1')
  })

  it('rejects an invalid callback URL', async () => {
    const ctx = await runCommand(['webhooks:create', ...AUTH, '-t', 'orders.place', '-u', '"not a url"'])
    expect(ctx.error?.message).to.match(/Invalid URL/)
  })

  it('reports a webhook rejected by the API', async () => {
    api().post('/api/webhooks').reply(422, apiError(422, 'Invalid topic', 'topic - is not included in the list'))
    const ctx = await runCommand(['webhooks:create', ...AUTH, '-t', 'orders.fly', '-u', 'https://hooks.example.com/orders'])
    expect(ctx.error?.message).to.match(/topic - is not included in the list/)
  })
})
