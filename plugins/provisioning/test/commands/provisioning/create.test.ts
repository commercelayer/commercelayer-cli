import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, resource, single, useMockedApi } from '../../helpers'

describe('provisioning:create', () => {
  useMockedApi()

  it('creates the resource with attributes, relationships and metadata', async () => {
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
    const ctx = await runCommand(['provisioning:create', 'roles', ...AUTH, '-a', 'name=Support', '-r', 'organization=organizations/OrgId', '-m', 'level=2'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('rOl9')
  })

  it('rejects an attribute without a value', async () => {
    const ctx = await runCommand(['provisioning:create', 'roles', ...AUTH, '-a', 'name'])
    expect(ctx.error?.message).to.match(/Invalid attribute name/)
  })
})
