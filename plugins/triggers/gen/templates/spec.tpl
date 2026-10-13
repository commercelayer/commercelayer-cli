import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, resource, single, useMockedApi } from '../../helpers'

describe('##__RESOURCE_NAME__##:##__ACTION_ID__##', () => {
  useMockedApi()

  it('sends the _##__ACTION_ID__## trigger', async function () {
    this.timeout(##__SPEC_TIMEOUT__##)
    api()
      .get('/api/##__RESOURCE_TYPE__##/rEs1')
      .reply(200, single(resource('##__RESOURCE_TYPE__##', 'rEs1')))
      .patch('/api/##__RESOURCE_TYPE__##/rEs1', (body) => body.data.attributes._##__ACTION_ID__## === ##__TRIGGER_VALUE__##)
      .reply(200, single(resource('##__RESOURCE_TYPE__##', 'rEs1')))
    const ctx = await runCommand(['##__RESOURCE_NAME__##:##__ACTION_ID__##', 'rEs1', ...AUTH##__TRIGGER_VALUE_ARGS__##])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Action ##__ACTION_ID__## executed without errors')
    expect(ctx.stdout).to.contain('rEs1')
  })
})
