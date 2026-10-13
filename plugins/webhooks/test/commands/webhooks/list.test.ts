import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, apiError, list, useMockedApi, webhook } from '../../helpers'

describe('webhooks:list', () => {
  useMockedApi()

  it('lists the webhooks', async () => {
    api().get('/api/webhooks').query(true).reply(200, list([webhook('wHk1'), webhook('wHk2', { name: 'Customer created', topic: 'customers.create', circuit_state: 'open', circuit_failure_count: 3 })]))
    const ctx = await runCommand(['webhooks:list', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('wHk1')
    expect(ctx.stdout).to.contain('customers.create')
  })

  it('filters by topic', async () => {
    api().get('/api/webhooks').query((q) => q['filter[q][topic_eq]'] === 'orders.place').reply(200, list([webhook('wHk1')]))
    const ctx = await runCommand(['webhooks:list', ...AUTH, '-t', 'orders.place'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('wHk1')
  })

  it('filters by circuit state', async () => {
    api().get('/api/webhooks').query(true).reply(200, list([webhook('wHk1'), webhook('wHk2', { circuit_state: 'open' })]))
    const ctx = await runCommand(['webhooks:list', ...AUTH, '-c', 'open'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('wHk2')
    expect(ctx.stdout).not.to.contain('wHk1')
  })

  it('says when no webhook matches the circuit state', async () => {
    api().get('/api/webhooks').query(true).reply(200, list([webhook('wHk1')]))
    const ctx = await runCommand(['webhooks:list', ...AUTH, '-c', 'open'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('No webhooks found with circuit state open')
  })

  it('reports an invalid access token', async () => {
    api().get('/api/webhooks').query(true).reply(401, apiError(401, 'Invalid token'))
    const ctx = await runCommand(['webhooks:list', ...AUTH])
    expect(ctx.error?.message).to.match(/Invalid token/)
  })
})
