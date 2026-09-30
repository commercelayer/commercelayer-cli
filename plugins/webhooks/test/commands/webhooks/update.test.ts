import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, single, useMockedApi, webhook } from '../../helpers'

describe('webhooks:update', () => {
  useMockedApi()

  it('updates only the given fields', async () => {
    api()
      .patch('/api/webhooks/wHk1', (body) => {
        const { attributes } = body.data
        return attributes.callback_url === 'https://hooks.example.com/v2' && !('topic' in attributes) && !('name' in attributes)
      })
      .reply(200, single(webhook('wHk1')))
    const ctx = await runCommand(['webhooks:update', 'wHk1', ...AUTH, '-u', 'https://hooks.example.com/v2'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('updated webhook with id wHk1')
  })

  it('clears the included resources with null', async () => {
    api()
      .patch('/api/webhooks/wHk1', (body) => Array.isArray(body.data.attributes.include_resources) && body.data.attributes.include_resources.length === 0)
      .reply(200, single(webhook('wHk1', { include_resources: [] })))
    const ctx = await runCommand(['webhooks:update', 'wHk1', ...AUTH, '-i', 'null'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('updated webhook with id wHk1')
  })
})
