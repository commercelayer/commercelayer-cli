import { expect, test } from '@oclif/test'
import { AUTH, api, apiError, single, useMockedApi, webhook } from '../../helpers'

describe('webhooks:create', () => {
  useMockedApi()

  test
    .do(() => {
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
    })
    .stdout()
    .command(['webhooks:create', ...AUTH, '-t', 'orders.place', '-u', 'https://hooks.example.com/orders', '-n', 'Order placed', '-i', 'customer,line_items'])
    .it('creates the webhook', (ctx) => {
      expect(ctx.stdout).to.contain('created new webhook with topic orders.place and id wHk1')
    })

  test
    .command(['webhooks:create', ...AUTH, '-t', 'orders.place', '-u', 'not a url'])
    .catch(/Invalid URL/)
    .it('rejects an invalid callback URL')

  test
    .do(() => {
      api().post('/api/webhooks').reply(422, apiError(422, 'Invalid topic', 'topic - is not included in the list'))
    })
    .command(['webhooks:create', ...AUTH, '-t', 'orders.fly', '-u', 'https://hooks.example.com/orders'])
    .catch(/topic - is not included in the list/)
    .it('reports a webhook rejected by the API')
})
