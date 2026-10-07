import { expect, test } from '@oclif/test'
import { AUTH, api, resource, single, useMockedApi } from '../../helpers'

describe('##__RESOURCE_NAME__##:##__ACTION_ID__##', () => {
  useMockedApi()

  test
    .timeout(##__SPEC_TIMEOUT__##)
    .do(() => {
      api()
        .get('/api/##__RESOURCE_TYPE__##/rEs1')
        .reply(200, single(resource('##__RESOURCE_TYPE__##', 'rEs1')))
        .patch('/api/##__RESOURCE_TYPE__##/rEs1', (body) => body.data.attributes._##__ACTION_ID__## === ##__TRIGGER_VALUE__##)
        .reply(200, single(resource('##__RESOURCE_TYPE__##', 'rEs1')))
    })
    .stdout()
    .command(['##__RESOURCE_NAME__##:##__ACTION_ID__##', 'rEs1', ...AUTH##__TRIGGER_VALUE_ARGS__##])
    .it('sends the _##__ACTION_ID__## trigger', (ctx) => {
      expect(ctx.stdout).to.contain('Action ##__ACTION_ID__## executed without errors')
      expect(ctx.stdout).to.contain('rEs1')
    })
})
