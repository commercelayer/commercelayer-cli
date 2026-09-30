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

  it('requires an output path', async () => {
    const ctx = await runCommand(['resources:all', 'skus', ...AUTH])
    expect(ctx.error?.message).to.match(/Undefined output file path/)
  })
})
