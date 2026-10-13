import { writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, resource, single, useMockedApi } from '../../helpers'

describe('provisioning:update', () => {
  useMockedApi()

  it('updates the resource', async () => {
    api()
      .patch('/api/roles/rOl1', (body) => body.data.id === 'rOl1' && body.data.attributes.name === 'Admins')
      .reply(200, single(resource('roles', 'rOl1', { name: 'Admins' })))
    const ctx = await runCommand(['provisioning:update', 'roles', 'rOl1', ...AUTH, '-a', 'name=Admins'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Admins')
  })

  const dataFile = join(tmpdir(), 'provisioning-update.json')

  it('updates the resource from a data file and reports its ID', async () => {
    writeFileSync(dataFile, JSON.stringify({ data: { type: 'roles', id: 'rOl1', attributes: { name: 'From file' } } }))
    api()
      .patch('/api/roles/rOl1', (body) => body.data.attributes.name === 'From file')
      .reply(200, single(resource('roles', 'rOl1', { name: 'From file' })))
    const ctx = await runCommand(['provisioning:update', 'roles', 'rOl1', ...AUTH, '-D', dataFile])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('updated resource of type roles with id rOl1')
  })
})
