import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, cleanup, list, single, useMockedApi } from '../../helpers'

describe('cleanups', () => {
  useMockedApi()

  it('lists the cleanups without an ID', async () => {
    api().get('/api/cleanups').query(true).reply(200, list([cleanup('cLn1')]))
    const ctx = await runCommand(['cleanups', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('cLn1')
  })

  it('shows the details with an ID', async () => {
    api().get('/api/cleanups/cLn1').reply(200, single(cleanup('cLn1')))
    const ctx = await runCommand(['cleanups', 'cLn1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('code_start')
  })
})
