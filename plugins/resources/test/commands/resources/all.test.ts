import { mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, list, resource, useMockedApi } from '../../helpers'

describe('resources:all', () => {
  useMockedApi()

  const dir = mkdtempSync(join(tmpdir(), 'resources-all-'))

  it('fetches all the resources and saves them to a JSON file', async () => {
    api()
      .get('/api/skus')
      .query((q) => q['filter[q][code_start]'] === 'TS')
      .reply(200, list([resource('skus', 'sKu1', { code: 'TSHIRT-M' }), resource('skus', 'sKu2', { code: 'TSHIRT-L' })]))
    const ctx = await runCommand(['resources:all', 'skus', ...AUTH, '-w', 'code_start=TS', '-x', join(dir, 'skus.json'), '-j', '--blind'])
    if (ctx.error) throw ctx.error
    const saved = JSON.parse(readFileSync(join(dir, 'skus.json'), 'utf8'))
    expect(saved.map((s: { code: string }) => s.code)).to.deep.equal(['TSHIRT-M', 'TSHIRT-L'])
  })

  it('keeps fetching past an estimated page count while the pages are full', async () => {
    // Above 10,000 records page_count is an estimate: here it says 1, but the first page is full
    const page = (n: number, size: number) => Array.from({ length: size }, (_, i) => resource('skus', `sKu${n}-${i}`, { code: `C${n}-${i}` }))
    const scope = api()
      .get('/api/skus')
      .query((q) => q['page[number]'] === '1')
      .reply(200, { data: page(1, 25), meta: { record_count: 10_001, page_count: 1 } })
      .get('/api/skus')
      .query((q) => q['page[number]'] === '2')
      .reply(200, { data: page(2, 3), meta: { record_count: 10_001, page_count: 1 } })
    const ctx = await runCommand(['resources:all', 'skus', ...AUTH, '-x', join(dir, 'estimated.json'), '-j', '--blind'])
    if (ctx.error) throw ctx.error
    expect(scope.isDone(), 'second page requested').to.equal(true)
    expect(JSON.parse(readFileSync(join(dir, 'estimated.json'), 'utf8'))).to.have.length(28)
  })

  it('requires an output path', async () => {
    const ctx = await runCommand(['resources:all', 'skus', ...AUTH])
    expect(ctx.error?.message).to.match(/Undefined output file path/)
  })
})
