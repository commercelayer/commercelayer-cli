import { expect, test } from '@oclif/test'
import { AUTH, api, apiError, list, useMockedApi, webhook } from '../../helpers'

describe('webhooks:list', () => {
  useMockedApi()

  test
    .do(() => {
      api().get('/api/webhooks').query(true).reply(200, list([webhook('wHk1'), webhook('wHk2', { name: 'Customer created', topic: 'customers.create', circuit_state: 'open', circuit_failure_count: 3 })]))
    })
    .stdout()
    .command(['webhooks:list', ...AUTH])
    .it('lists the webhooks', (ctx) => {
      expect(ctx.stdout).to.contain('wHk1')
      expect(ctx.stdout).to.contain('customers.create')
    })

  test
    .do(() => {
      api().get('/api/webhooks').query((q) => q['filter[q][topic_eq]'] === 'orders.place').reply(200, list([webhook('wHk1')]))
    })
    .stdout()
    .command(['webhooks:list', ...AUTH, '-t', 'orders.place'])
    .it('filters by topic', (ctx) => {
      expect(ctx.stdout).to.contain('wHk1')
    })

  test
    .do(() => {
      api().get('/api/webhooks').query(true).reply(200, list([webhook('wHk1'), webhook('wHk2', { circuit_state: 'open' })]))
    })
    .stdout()
    .command(['webhooks:list', ...AUTH, '-c', 'open'])
    .it('filters by circuit state', (ctx) => {
      expect(ctx.stdout).to.contain('wHk2')
      expect(ctx.stdout).not.to.contain('wHk1')
    })

  test
    .do(() => {
      api().get('/api/webhooks').query(true).reply(200, list([webhook('wHk1')]))
    })
    .stdout()
    .command(['webhooks:list', ...AUTH, '-c', 'open'])
    .it('says when no webhook matches the circuit state', (ctx) => {
      expect(ctx.stdout).to.contain('No webhooks found with circuit state open')
    })

  test
    .do(() => {
      api().get('/api/webhooks').query(true).reply(401, apiError(401, 'Invalid token'))
    })
    .command(['webhooks:list', ...AUTH])
    .catch(/Invalid token/)
    .it('reports an invalid access token')
})
