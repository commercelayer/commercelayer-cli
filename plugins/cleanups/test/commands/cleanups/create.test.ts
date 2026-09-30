import { expect, test } from '@oclif/test'
import { AUTH, api, apiError, cleanup, list, ORG, resource, single, token, useMockedApi } from '../../helpers'

describe('cleanups:create', () => {
  useMockedApi()

  const application = () => api().get('/api/application').reply(200, single(resource('application', 'AppId', { kind: 'integration' })))
  const count = (n: number) =>
    api()
      .get('/api/skus')
      .query((q) => q['filter[q][code_start]'] === 'OLD' && q['page[size]'] === '1' && !q.sort)
      .reply(200, { ...list([resource('skus', 'sku1')]), meta: { record_count: n, page_count: n } })

  test
    .do(() => {
      application()
      count(3)
      api()
        .get('/api/skus')
        .query((q) => q['page[number]'] === '3' && q.sort === 'id')
        .reply(200, list([resource('skus', 'sku3')]))
        .post('/api/cleanups', (body) => {
          const { attributes } = body.data
          return (
            attributes.resource_type === 'skus' &&
            attributes.filters.code_start === 'OLD' &&
            attributes.filters.id_lteq === 'sku3' &&
            attributes.reference_origin === 'cli-plugin-cleanups' &&
            /-0001$/.test(attributes.reference) &&
            attributes.metadata.group_id === attributes.reference.replace(/-0001$/, '')
          )
        })
        .reply(201, single(cleanup('cLn9', { status: 'pending' })))
    })
    .stdout()
    .command(['cleanups:create', ...AUTH, '-t', 'skus', '-w', 'code_start=OLD', '--blind'])
    .it('starts a cleanup of the filtered records', (ctx) => {
      expect(ctx.stdout).to.contain('The cleanup of 3 skus has been started')
    })

  test
    .do(() => {
      application()
      count(0)
    })
    .command(['cleanups:create', ...AUTH, '-t', 'skus', '-w', 'code_start=OLD', '--blind'])
    .catch(/No skus to cleanup/)
    .it('stops when nothing matches')

  test
    .do(() => {
      api().get('/api/application').reply(401, apiError(401, 'Invalid token', 'The access token you provided is invalid.'))
    })
    .command(['cleanups:create', ...AUTH, '-t', 'skus', '--blind'])
    .catch(/Invalid token: The access token you provided is invalid/)
    .it('checks the access token first')

  test
    .command(['cleanups:create', '-o', ORG, '--accessToken', token('sales_channel'), '-t', 'skus', '--blind'])
    .catch(/Invalid application kind: sales_channel/)
    .it('requires an integration or cli token')
})
