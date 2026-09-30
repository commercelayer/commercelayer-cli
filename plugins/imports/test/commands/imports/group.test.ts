import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, importJob, list, useMockedApi } from '../../helpers'

describe('imports:group', () => {
  useMockedApi()

  it('lists the imports of a group', async () => {
    api()
      .get('/api/imports')
      .query((q) => q['filter[q][reference_start]'] === 'group1-' && q.sort === 'reference,-completed_at')
      .reply(200, list([importJob('iMp1'), importJob('iMp2', { reference: 'group1-0002' })]))
    const ctx = await runCommand(['imports:group', 'group1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('iMp1')
    expect(ctx.stdout).to.contain('iMp2')
  })
})
