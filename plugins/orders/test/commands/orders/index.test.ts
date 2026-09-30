import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import inquirer from 'inquirer'
import { AUTH, api, resource, single, useMockedApi } from '../../helpers'

describe('orders', () => {
  useMockedApi()

  const prompt = inquirer.prompt
  afterEach(() => {
    inquirer.prompt = prompt
  })

  it('executes the action picked from the list', async () => {
    // The command asks which action to execute: answer "approve"
    inquirer.prompt = (async () => ({ trigger: 'approve' })) as unknown as typeof inquirer.prompt
    api()
      .get('/api/orders/oRd1')
      .reply(200, single(resource('orders', 'oRd1')))
      .patch('/api/orders/oRd1', (body) => body.data.attributes._approve === true)
      .reply(200, single(resource('orders', 'oRd1', { status: 'approved' })))
    const ctx = await runCommand(['orders', 'oRd1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Action approve executed without errors on order oRd1')
  })

  it('reports a missing order', async () => {
    inquirer.prompt = (async () => ({ trigger: 'approve' })) as unknown as typeof inquirer.prompt
    api().get('/api/orders/nope').reply(404, { errors: [{ title: 'Record not found', detail: 'not found', code: 'RECORD_NOT_FOUND', status: '404' }] })
    const ctx = await runCommand(['orders', 'nope', ...AUTH])
    expect(ctx.error?.message).to.match(/Invalid order or order not found: nope/)
  })
})
