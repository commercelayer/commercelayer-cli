import { mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, test } from '@oclif/test'
import { AUTH, api, list, resource, useMockedApi } from '../../helpers'

describe('resources:all', () => {
  useMockedApi()

  const dir = mkdtempSync(join(tmpdir(), 'resources-all-'))

  test
    .do(() => {
      api()
        .get('/api/skus')
        .query((q) => q['filter[q][code_start]'] === 'TS')
        .reply(200, list([resource('skus', 'sKu1', { code: 'TSHIRT-M' }), resource('skus', 'sKu2', { code: 'TSHIRT-L' })]))
    })
    .stdout()
    .command(['resources:all', 'skus', ...AUTH, '-w', 'code_start=TS', '-x', join(dir, 'skus.json'), '-j', '--blind'])
    .it('fetches all the resources and saves them to a JSON file', () => {
      const saved = JSON.parse(readFileSync(join(dir, 'skus.json'), 'utf8'))
      expect(saved.map((s: { code: string }) => s.code)).to.deep.equal(['TSHIRT-M', 'TSHIRT-L'])
    })

  // Above 10,000 records page_count is an estimate: here it says 1, but the first page is full
  const page = (n: number, size: number) => Array.from({ length: size }, (_, i) => resource('skus', `sKu${n}-${i}`, { code: `C${n}-${i}` }))
  let scope: ReturnType<typeof api>
  test
    .do(() => {
      scope = api()
        .get('/api/skus')
        .query((q) => q['page[number]'] === '1')
        .reply(200, { data: page(1, 25), meta: { record_count: 10_001, page_count: 1, record_count_estimated: true } })
        .get('/api/skus')
        .query((q) => q['page[number]'] === '2')
        .reply(200, { data: page(2, 3), meta: { record_count: 10_001, page_count: 1, record_count_estimated: true } })
    })
    .stdout()
    .command(['resources:all', 'skus', ...AUTH, '-x', join(dir, 'estimated.json'), '-j', '--blind'])
    .it('keeps fetching past an estimated page count while the pages are full', () => {
      expect(scope.isDone(), 'second page requested').to.equal(true)
      expect(JSON.parse(readFileSync(join(dir, 'estimated.json'), 'utf8'))).to.have.length(28)
    })

  test
    .command(['resources:all', 'skus', ...AUTH])
    .catch(/Undefined output file path/)
    .it('requires an output path')
})
