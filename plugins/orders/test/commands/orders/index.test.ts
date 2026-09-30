import { expect, test } from '@oclif/test'
import inquirer from 'inquirer'
import { AUTH, api, resource, single, useMockedApi } from '../../helpers'

describe('orders', () => {
  useMockedApi()

  const prompt = inquirer.prompt
  afterEach(() => {
    inquirer.prompt = prompt
  })

  test
    .do(() => {
      // The command asks which action to execute: answer "approve"
      inquirer.prompt = (async () => ({ trigger: 'approve' })) as unknown as typeof inquirer.prompt
      api()
        .get('/api/orders/oRd1')
        .reply(200, single(resource('orders', 'oRd1')))
        .patch('/api/orders/oRd1', (body) => body.data.attributes._approve === true)
        .reply(200, single(resource('orders', 'oRd1', { status: 'approved' })))
    })
    .stdout()
    .command(['orders', 'oRd1', ...AUTH])
    .it('executes the action picked from the list', (ctx) => {
      expect(ctx.stdout).to.contain('Action approve executed without errors on order oRd1')
    })

  test
    .do(() => {
      inquirer.prompt = (async () => ({ trigger: 'approve' })) as unknown as typeof inquirer.prompt
      api().get('/api/orders/nope').reply(404, { errors: [{ title: 'Record not found', detail: 'not found', code: 'RECORD_NOT_FOUND', status: '404' }] })
    })
    .command(['orders', 'nope', ...AUTH])
    .catch(/Invalid order or order not found: nope/)
    .it('reports a missing order')
})
