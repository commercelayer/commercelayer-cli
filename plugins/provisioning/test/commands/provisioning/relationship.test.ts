import { expect, test } from '@oclif/test'
import { AUTH, api, list, resource, useMockedApi } from '../../helpers'

describe('provisioning:relationship', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .get('/api/roles/rOl1/permissions')
        .query((q) => q['filter[q][subject_eq]'] === 'orders')
        .reply(200, list([resource('permissions', 'pRm1', { subject: 'orders' })]))
    })
    .stdout()
    .command(['provisioning:relationship', 'roles', 'rOl1', 'permissions', ...AUTH, '-w', 'subject_eq=orders'])
    .it('lists a 1-N relationship with filters', (ctx) => {
      expect(ctx.stdout).to.contain('pRm1')
    })

  test
    .command(['provisioning:relationship', 'roles', 'rOl1', 'unicorns', ...AUTH])
    .catch(/unicorns/)
    .it('rejects an unknown relationship')
})
