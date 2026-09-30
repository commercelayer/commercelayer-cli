import { writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, test } from '@oclif/test'
import { AUTH, api, resource, single, useMockedApi } from '../../helpers'

describe('provisioning:update', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .patch('/api/roles/rOl1', (body) => body.data.id === 'rOl1' && body.data.attributes.name === 'Admins')
        .reply(200, single(resource('roles', 'rOl1', { name: 'Admins' })))
    })
    .stdout()
    .command(['provisioning:update', 'roles', 'rOl1', ...AUTH, '-a', 'name=Admins'])
    .it('updates the resource', (ctx) => {
      expect(ctx.stdout).to.contain('Admins')
    })

  const dataFile = join(tmpdir(), 'provisioning-update.json')

  test
    .do(() => {
      writeFileSync(dataFile, JSON.stringify({ data: { type: 'roles', id: 'rOl1', attributes: { name: 'From file' } } }))
      api()
        .patch('/api/roles/rOl1', (body) => body.data.attributes.name === 'From file')
        .reply(200, single(resource('roles', 'rOl1', { name: 'From file' })))
    })
    .stdout()
    .command(['provisioning:update', 'roles', 'rOl1', ...AUTH, '-D', dataFile])
    .it('updates the resource from a data file and reports its ID', (ctx) => {
      expect(ctx.stdout).to.contain('updated resource of type roles with id rOl1')
    })
})
