import { expect, test } from '@oclif/test'
import { AUTH, api, single, tag, useMockedApi } from '../../helpers'

describe('tags:create', () => {
  useMockedApi()

  test
    .do(() => {
      api()
        .post('/api/tags', (body) => body.data.type === 'tags' && body.data.attributes.name === 'vip')
        .reply(201, single(tag('aBcDeF', 'vip')))
        .post('/api/tags', (body) => body.data.attributes.name === 'wholesale')
        .reply(201, single(tag('gHiJkL', 'wholesale')))
    })
    .stdout()
    .command(['tags:create', ...AUTH, '-n', 'vip', 'wholesale'])
    .it('creates every tag', (ctx) => {
      expect(ctx.stdout).to.contain('Created tag vip with id aBcDeF')
      expect(ctx.stdout).to.contain('Created tag wholesale with id gHiJkL')
      expect(ctx.stdout).to.contain('created new tags: vip, wholesale')
    })

  test
    .do(() => {
      api()
        .post('/api/tags')
        .reply(422, { errors: [{ title: 'has already been taken', detail: 'name - has already been taken', code: 'VALIDATION_ERROR', status: '422' }] })
    })
    .stdout()
    .stderr()
    .command(['tags:create', ...AUTH, '-n', 'vip'])
    .it('warns when the API rejects a tag', (ctx) => {
      expect(ctx.stderr).to.contain('Error creating tag vip')
      expect(ctx.stdout).not.to.contain('Successfully')
    })
})
