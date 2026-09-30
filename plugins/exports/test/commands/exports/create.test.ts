import { mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'
import { expect, test } from '@oclif/test'
import nock from 'nock'
import { AUTH, api, apiError, exportJob, ORG, single, token, useMockedApi } from '../../helpers'

describe('exports:create', () => {
  useMockedApi()

  const dir = mkdtempSync(join(tmpdir(), 'exports-test-'))
  const records = [
    { id: 'sku1', code: 'TSHIRT-M' },
    { id: 'sku2', code: 'TSHIRT-L' },
  ]
  const attachment = () => nock('https://exports.example.com').get('/eXp1.json.gz').reply(200, gzipSync(JSON.stringify(records)))

  test
    .timeout(15000)
    .do(() => {
      api()
        .post('/api/exports', (body) => {
          const { attributes } = body.data
          return (
            attributes.resource_type === 'skus' &&
            attributes.format === 'json' &&
            attributes.filters.code_start === 'TS' &&
            attributes.includes.join() === 'prices' &&
            attributes.dry_data === false
          )
        })
        .reply(201, single(exportJob('eXp1', { status: 'pending', records_count: null })))
        .get('/api/exports/eXp1')
        .reply(200, single(exportJob('eXp1')))
      attachment()
    })
    .stdout()
    .command(['exports:create', ...AUTH, '-t', 'skus', '-w', 'code_start=TS', '-i', 'prices', '-x', join(dir, 'skus'), '--blind'])
    .it('creates the export, waits for it and saves the file', (ctx) => {
      expect(ctx.stdout).to.contain('Started export eXp1')
      expect(ctx.stdout).to.contain('Exported 2 skus')
      expect(JSON.parse(readFileSync(join(dir, 'skus.json'), 'utf8'))).to.deep.equal(records)
    })

  test
    .timeout(15000)
    .do(() => {
      api()
        .post('/api/exports')
        .reply(201, single(exportJob('eXp1', { status: 'pending', records_count: null })))
        .get('/api/exports/eXp1')
        .reply(200, single(exportJob('eXp1', { records_count: 0 })))
    })
    .stdout()
    .command(['exports:create', ...AUTH, '-t', 'skus', '-x', join(dir, 'none'), '--blind'])
    .exit(0)
    .it('stops when there is nothing to export', (ctx) => {
      expect(ctx.stdout).to.contain('No records found')
    })

  test
    .command(['exports:create', ...AUTH, '-t', 'skus'])
    .catch(/Undefined output file path/)
    .it('requires an output path')

  test
    .command(['exports:create', ...AUTH, '-t', 'skus', '-x', join(dir, 'x'), '-C', '-P'])
    .catch(/prettify|Prettify/)
    .it('rejects prettify with CSV')

  test
    .command(['exports:create', ...AUTH, '-t', 'unicorns', '-x', join(dir, 'x')])
    .catch(/Unsupported resource type: unicorns/)
    .it('rejects an unknown resource type')

  test
    .command(['exports:create', '-o', ORG, '--accessToken', token('sales_channel'), '-t', 'skus', '-x', join(dir, 'x')])
    .catch(/Invalid application kind: sales_channel/)
    .it('requires an integration or cli token')

  test
    .timeout(15000)
    .do(() => {
      api().post('/api/exports').reply(422, apiError(422, 'Invalid filter', 'filters - is invalid'))
    })
    .command(['exports:create', ...AUTH, '-t', 'skus', '-w', 'nope_eq=1', '-x', join(dir, 'x'), '--blind'])
    .catch(/filters - is invalid/)
    .it('reports an export rejected by the API')
})
