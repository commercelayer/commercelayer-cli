import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, list, resource, single, useMockedApi } from '../../helpers'

describe('resources:get', () => {
  useMockedApi()

  it('lists without an ID', async () => {
    api().get('/api/skus').query(true).reply(200, list([resource('skus', 'sKu1', { code: 'TSHIRT' })]))
    const ctx = await runCommand(['resources:get', 'skus', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('TSHIRT')
  })

  it('retrieves with an ID', async () => {
    api().get('/api/skus/sKu1').query(true).reply(200, single(resource('skus', 'sKu1', { code: 'TSHIRT' })))
    const ctx = await runCommand(['resources:get', 'skus/sKu1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('TSHIRT')
  })
})
