import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, single, tag, useMockedApi } from '../../helpers'

describe('tags:create', () => {
  useMockedApi()

  it('creates every tag', async () => {
    api()
      .post('/api/tags', (body) => body.data.type === 'tags' && body.data.attributes.name === 'vip')
      .reply(201, single(tag('aBcDeF', 'vip')))
      .post('/api/tags', (body) => body.data.attributes.name === 'wholesale')
      .reply(201, single(tag('gHiJkL', 'wholesale')))
    const ctx = await runCommand(['tags:create', ...AUTH, '-n', 'vip', 'wholesale'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Created tag vip with id aBcDeF')
    expect(ctx.stdout).to.contain('Created tag wholesale with id gHiJkL')
    expect(ctx.stdout).to.contain('created new tags: vip, wholesale')
  })

  it('warns when the API rejects a tag', async () => {
    api()
      .post('/api/tags')
      .reply(422, { errors: [{ title: 'has already been taken', detail: 'name - has already been taken', code: 'VALIDATION_ERROR', status: '422' }] })
    const ctx = await runCommand(['tags:create', ...AUTH, '-n', 'vip'])
    if (ctx.error) throw ctx.error
    expect(ctx.stderr).to.contain('Error creating tag vip')
    expect(ctx.stdout).not.to.contain('Successfully')
  })
})
