import { mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'
import { runCommand } from '@oclif/test'
import { expect } from 'chai'
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

  it('creates the export, waits for it and saves the file', async function () {
    this.timeout(15000)
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
    const ctx = await runCommand(['exports:create', ...AUTH, '-t', 'skus', '-w', 'code_start=TS', '-i', 'prices', '-x', join(dir, 'skus'), '--blind'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('Started export eXp1')
    expect(ctx.stdout).to.contain('Exported 2 skus')
    expect(JSON.parse(readFileSync(join(dir, 'skus.json'), 'utf8'))).to.deep.equal(records)
  })

  it('stops when there is nothing to export', async function () {
    this.timeout(15000)
    api()
      .post('/api/exports')
      .reply(201, single(exportJob('eXp1', { status: 'pending', records_count: null })))
      .get('/api/exports/eXp1')
      .reply(200, single(exportJob('eXp1', { records_count: 0 })))
    const ctx = await runCommand(['exports:create', ...AUTH, '-t', 'skus', '-x', join(dir, 'none'), '--blind'])
    expect(ctx.error?.oclif?.exit ?? 0).to.equal(0)
    expect(ctx.stdout).to.contain('No records found')
  })

  it('requires an output path', async () => {
    const ctx = await runCommand(['exports:create', ...AUTH, '-t', 'skus'])
    expect(ctx.error?.message).to.match(/Undefined output file path/)
  })

  it('rejects prettify with CSV', async () => {
    const ctx = await runCommand(['exports:create', ...AUTH, '-t', 'skus', '-x', join(dir, 'x'), '-C', '-P'])
    expect(ctx.error?.message).to.match(/prettify|Prettify/)
  })

  it('rejects an unknown resource type', async () => {
    const ctx = await runCommand(['exports:create', ...AUTH, '-t', 'unicorns', '-x', join(dir, 'x')])
    expect(ctx.error?.message).to.match(/Unsupported resource type: unicorns/)
  })

  it('requires an integration or cli token', async () => {
    const ctx = await runCommand(['exports:create', '-o', ORG, '--accessToken', token('sales_channel'), '-t', 'skus', '-x', join(dir, 'x')])
    expect(ctx.error?.message).to.match(/Invalid application kind: sales_channel/)
  })

  it('reports an export rejected by the API', async function () {
    this.timeout(15000)
    api().post('/api/exports').reply(422, apiError(422, 'Invalid filter', 'filters - is invalid'))
    const ctx = await runCommand(['exports:create', ...AUTH, '-t', 'skus', '-w', 'nope_eq=1', '-x', join(dir, 'x'), '--blind'])
    expect(ctx.error?.message).to.match(/filters - is invalid/)
  })
})
