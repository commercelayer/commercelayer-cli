import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, apiError, cleanup, list, ORG, resource, single, token, useMockedApi } from '../../helpers'

describe('cleanups:create', () => {
  useMockedApi()

  const application = () => api().get('/api/application').reply(200, single(resource('application', 'AppId', { kind: 'integration' })))
  const count = (n: number) =>
    api()
      .get('/api/skus')
      .query((q) => q['filter[q][code_start]'] === 'OLD' && q['page[size]'] === '1' && !q.sort)
      .reply(200, { ...list([resource('skus', 'sku1')]), meta: { record_count: n, page_count: n } })

  it('starts a cleanup of the filtered records', async () => {
    application()
    count(3)
    // One chunk, the last one: no upper bound, so no page lookup
    const scope = api()
      .post('/api/cleanups', (body) => {
        const { attributes } = body.data
        return (
          attributes.resource_type === 'skus' &&
          attributes.filters.code_start === 'OLD' &&
          attributes.filters.id_lteq === undefined &&
          attributes.filters.id_gt === undefined &&
          attributes.reference_origin === 'cli-plugin-cleanups' &&
          /-0001$/.test(attributes.reference) &&
          attributes.metadata.group_id === attributes.reference.replace(/-0001$/, '')
        )
      })
      .reply(201, single(cleanup('cLn9', { status: 'pending' })))
    const ctx = await runCommand(['cleanups:create', ...AUTH, '-t', 'skus', '-w', 'code_start=OLD', '--blind'])
    if (ctx.error) throw ctx.error
    expect(scope.isDone(), 'cleanup created').to.equal(true)
    expect(ctx.stdout).to.contain('The cleanup of 3 skus has been started')
  })

  it('leaves the last chunk open-ended when the total is estimated', async () => {
    application()
    // Above 10,000 records the API estimates the count: 25,000 -> chunks of 10,000, 10,000 and the rest
    count(25_000)
    const bounds: Array<{ gt?: string; lteq?: string }> = []
    const scope = api()
      .get('/api/skus')
      .query((q) => q['page[number]'] === '10000' && q.sort === 'id')
      .reply(200, list([resource('skus', 'sku10k')]))
      .get('/api/skus')
      .query((q) => q['page[number]'] === '20000' && q.sort === 'id')
      .reply(200, list([resource('skus', 'sku20k')]))
      .post('/api/cleanups', (body) => {
        bounds.push({ gt: body.data.attributes.filters.id_gt, lteq: body.data.attributes.filters.id_lteq })
        return true
      })
      .times(3)
      .reply(201, single(cleanup('cLn9', { status: 'pending' })))
    const ctx = await runCommand(['cleanups:create', ...AUTH, '-t', 'skus', '-w', 'code_start=OLD', '--blind'])
    if (ctx.error) throw ctx.error
    expect(scope.isDone(), 'chunk lookups and cleanups').to.equal(true)
    expect(bounds).to.have.deep.members([{ gt: undefined, lteq: 'sku10k' }, { gt: 'sku10k', lteq: 'sku20k' }, { gt: 'sku20k', lteq: undefined }])
  })

  it('stops when nothing matches', async () => {
    application()
    count(0)
    const ctx = await runCommand(['cleanups:create', ...AUTH, '-t', 'skus', '-w', 'code_start=OLD', '--blind'])
    expect(ctx.error?.message).to.match(/No skus to cleanup/)
  })

  it('checks the access token first', async () => {
    api().get('/api/application').reply(401, apiError(401, 'Invalid token', 'The access token you provided is invalid.'))
    const ctx = await runCommand(['cleanups:create', ...AUTH, '-t', 'skus', '--blind'])
    expect(ctx.error?.message).to.match(/Invalid token: The access token you provided is invalid/)
  })

  it('requires an integration or cli token', async () => {
    const ctx = await runCommand(['cleanups:create', '-o', ORG, '--accessToken', token('sales_channel'), '-t', 'skus', '--blind'])
    expect(ctx.error?.message).to.match(/Invalid application kind: sales_channel/)
  })
})
