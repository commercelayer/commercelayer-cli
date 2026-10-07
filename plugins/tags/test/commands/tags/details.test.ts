import { expect, test } from '@oclif/test'
import { AUTH, api, mockTagByName, single, tag, useMockedApi } from '../../helpers'

describe('tags:details', () => {
  useMockedApi()

  test
    .do(() => {
      api().get('/api/tags/aBcDeF').reply(200, single(tag('aBcDeF', 'vip')))
    })
    .stdout()
    .command(['tags:details', 'aBcDeF', ...AUTH])
    .it('shows the tag attributes', (ctx) => {
      expect(ctx.stdout).to.contain('aBcDeF')
      expect(ctx.stdout).to.contain('vip')
      expect(ctx.stdout).to.contain('created_at')
      expect(ctx.stdout).not.to.contain('reference_origin')
    })

  test
    .do(() => {
      mockTagByName(api(), 'ghost')
    })
    .stdout()
    .command(['tags:details', 'ghost', ...AUTH])
    .exit(0)
    .it('says when the tag does not exist', (ctx) => {
      expect(ctx.stdout).to.contain('Unable to find tag with this ID or name: ghost')
    })
})
