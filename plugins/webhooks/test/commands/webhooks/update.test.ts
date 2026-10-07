import { expect, test } from '@oclif/test'
import { AUTH, api, single, useMockedApi, webhook } from '../../helpers'

describe('webhooks:update', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .patch('/api/webhooks/wHk1', (body) => {
          const { attributes } = body.data
          return attributes.callback_url === 'https://hooks.example.com/v2' && !('topic' in attributes) && !('name' in attributes)
        })
        .reply(200, single(webhook('wHk1')))
    })
    .stdout()
    .command(['webhooks:update', 'wHk1', ...AUTH, '-u', 'https://hooks.example.com/v2'])
    .it('updates only the given fields', (ctx) => {
      expect(ctx.stdout).to.contain('updated webhook with id wHk1')
    })

  test
    .do(() => {
      api()
        .patch('/api/webhooks/wHk1', (body) => Array.isArray(body.data.attributes.include_resources) && body.data.attributes.include_resources.length === 0)
        .reply(200, single(webhook('wHk1', { include_resources: [] })))
    })
    .stdout()
    .command(['webhooks:update', 'wHk1', ...AUTH, '-i', 'null'])
    .it('clears the included resources with null', (ctx) => {
      expect(ctx.stdout).to.contain('updated webhook with id wHk1')
    })
})
