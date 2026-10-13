import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, cleanup, list, useMockedApi } from '../../helpers'

describe('cleanups:group', () => {
  useMockedApi()

  it('lists the cleanups of a group', async () => {
    api()
      .get('/api/cleanups')
      .query((q) => q['filter[q][reference_start]'] === 'group1-' && q.sort === 'reference,-completed_at')
      .reply(200, list([cleanup('cLn1'), cleanup('cLn2', { reference: 'group1-0002' })]))
    const ctx = await runCommand(['cleanups:group', 'group1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('cLn1')
    expect(ctx.stdout).to.contain('cLn2')
  })
})
