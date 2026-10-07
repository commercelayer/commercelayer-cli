import { expect, test } from '@oclif/test'
import { AUTH, api, importJob, list, single, useMockedApi } from '../../helpers'

describe('imports', () => {
  useMockedApi()

  test
    .do(() => {
      api().get('/api/imports').query(true).reply(200, list([importJob('iMp1')]))
    })
    .stdout()
    .command(['imports', ...AUTH])
    .it('lists the imports without an ID', (ctx) => {
      expect(ctx.stdout).to.contain('iMp1')
    })

  test
    .do(() => {
      api().get('/api/imports/iMp1').reply(200, single(importJob('iMp1')))
    })
    .stdout()
    .command(['imports', 'iMp1', ...AUTH])
    .it('shows the details with an ID', (ctx) => {
      expect(ctx.stdout).to.contain('iMp1')
    })
})
