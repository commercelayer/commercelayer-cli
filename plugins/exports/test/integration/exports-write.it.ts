import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { stripVTControlCharacters } from 'node:util'
import { describeLive, liveAuth, liveDelete, liveRequest } from '@commercelayer/cli-test-utils'
import { runCommand } from '@oclif/test'
import { expect } from 'chai'

// An export reads data: it only creates the export job, deleted afterwards
describeLive('exports: create an export', () => {
  let dir: string
  let exportId: string | undefined
  before(() => {
    dir = mkdtempSync(join(tmpdir(), 'cli-it-exports-'))
  })
  after(async () => {
    await liveDelete('exports', exportId)
    rmSync(dir, { recursive: true, force: true })
  })

  it('exports one SKU to a file', async function () {
    this.timeout(180_000)
    const sku = (await liveRequest('GET', '/api/skus?page[size]=1&fields[skus]=code')).data[0]
    if (!sku) this.skip()
    const code: string = sku.attributes.code
    const file = join(dir, 'skus.json')
    const ctx = await runCommand(['exports:create', ...(await liveAuth()), '-t', 'skus', '-w', `code_eq=${code}`, '-x', file, '-b'])
    exportId = stripVTControlCharacters(ctx.stdout + ctx.stderr).match(/export (\w+)/)?.[1]
    if (ctx.error) throw ctx.error
    expect(stripVTControlCharacters(ctx.stdout)).to.match(/Exported 1 sku/)
    const exported = JSON.parse(readFileSync(file, 'utf8'))
    expect(exported).to.be.an('array').with.length(1)
    expect(exported[0]).to.include({ code })
  })
})
