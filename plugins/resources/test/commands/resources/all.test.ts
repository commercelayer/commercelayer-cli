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

  test
    .command(['resources:all', 'skus', ...AUTH])
    .catch(/Undefined output file path/)
    .it('requires an output path')
})
