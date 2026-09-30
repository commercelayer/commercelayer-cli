import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, exportJob, list, useMockedApi } from '../../helpers'

describe('exports:group', () => {
  useMockedApi()

  it('lists the exports of a group', async () => {
    api()
      .get('/api/exports')
      .query((q) => q['filter[q][reference_start]'] === 'group1-' && q.sort === 'reference,-completed_at')
      .reply(200, list([exportJob('eXp1'), exportJob('eXp2', { reference: 'group1-0002' })]))
    const ctx = await runCommand(['exports:group', 'group1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('eXp1')
    expect(ctx.stdout).to.contain('eXp2')
  })
})
