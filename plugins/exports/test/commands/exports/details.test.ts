import { expect, test } from '@oclif/test'
import { AUTH, api, exportJob, notFound, single, useMockedApi } from '../../helpers'

describe('exports:details', () => {
  useMockedApi()

  test
    .do(() => {
      api().get('/api/exports/eXp1').reply(200, single(exportJob('eXp1')))
    })
    .stdout()
    .command(['exports:details', 'eXp1', ...AUTH])
    .it('shows the export attributes and the attachment URL', (ctx) => {
      expect(ctx.stdout).to.contain('eXp1')
      expect(ctx.stdout).to.contain('skus')
      expect(ctx.stdout).to.contain('code_start')
      expect(ctx.stdout).to.contain('Attachment URL')
      expect(ctx.stdout).to.contain('https://exports.example.com/eXp1.json.gz')
    })

  test
    .do(() => {
      api().get('/api/exports/nope').reply(404, notFound())
    })
    .command(['exports:details', 'nope', ...AUTH])
    .catch(/nope|not found/i)
    .it('reports a missing export')
})
