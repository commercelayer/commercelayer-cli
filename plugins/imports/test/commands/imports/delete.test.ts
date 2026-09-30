import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, notFound, useMockedApi } from '../../helpers'

describe('imports:delete', () => {
  useMockedApi()

  it('deletes the import', async () => {
    api().delete('/api/imports/iMp1').reply(204)
    const ctx = await runCommand(['imports:delete', 'iMp1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('deleted import with id iMp1')
  })

  it('reports a missing import as a command error', async () => {
    api().delete('/api/imports/nope').reply(404, notFound())
    const ctx = await runCommand(['imports:delete', 'nope', ...AUTH])
    expect(ctx.error?.message).to.match(/nope|not found/i)
  })
})
