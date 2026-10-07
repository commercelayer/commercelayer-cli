import { expect, test } from '@oclif/test'
import nock from 'nock'
import { AUTH, api, useMockedApi } from '../../helpers'

describe('provisioning:exec', () => {
  useMockedApi()

  test
    .do(() => {
      api().post('/api/memberships/mBr1/resend').reply(204)
    })
    .stdout()
    .command(['provisioning:exec', 'memberships', 'mBr1', 'resend', ...AUTH])
    .it('executes the action on the resource', () => {
      expect(nock.isDone()).to.equal(true)
    })

  test
    .command(['provisioning:exec', 'memberships', 'mBr1', ...AUTH])
    .catch(/Missing action name/)
    .it('requires an action')

  test
    .command(['provisioning:exec', 'memberships', 'mBr1', 'fly', ...AUTH])
    .catch(/Operation not supported for resource memberships: fly/)
    .it('rejects an unknown action')
})
