import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, exportJob, notFound, single, useMockedApi } from '../../helpers'

describe('exports:details', () => {
  useMockedApi()

  it('shows the export attributes and the attachment URL', async () => {
    api().get('/api/exports/eXp1').reply(200, single(exportJob('eXp1')))
    const ctx = await runCommand(['exports:details', 'eXp1', ...AUTH])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('eXp1')
    expect(ctx.stdout).to.contain('skus')
    expect(ctx.stdout).to.contain('code_start')
    expect(ctx.stdout).to.contain('Attachment URL')
    expect(ctx.stdout).to.contain('https://exports.example.com/eXp1.json.gz')
  })

  it('reports a missing export', async () => {
    api().get('/api/exports/nope').reply(404, notFound())
    const ctx = await runCommand(['exports:details', 'nope', ...AUTH])
    expect(ctx.error?.message).to.match(/nope|not found/i)
  })
})
