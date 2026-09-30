import { expect, test } from '@oclif/test'
import { AUTH, api, resource, single, useMockedApi } from '../../helpers'

describe('provisioning:create', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .post('/api/roles', (body) => {
          const { attributes, relationships } = body.data
          return (
            body.data.type === 'roles' &&
            attributes.name === 'Support' &&
            attributes.metadata.level === 2 &&
            relationships.organization.data.type === 'organizations' &&
            relationships.organization.data.id === 'OrgId'
          )
        })
        .query(true)
        .reply(201, single(resource('roles', 'rOl9', { name: 'Support' })))
    })
    .stdout()
    .command(['provisioning:create', 'roles', ...AUTH, '-a', 'name=Support', '-r', 'organization=organizations/OrgId', '-m', 'level=2'])
    .it('creates the resource with attributes, relationships and metadata', (ctx) => {
      expect(ctx.stdout).to.contain('rOl9')
    })

  test
    .command(['provisioning:create', 'roles', ...AUTH, '-a', 'name'])
    .catch(/Invalid attribute name/)
    .it('rejects an attribute without a value')
})
