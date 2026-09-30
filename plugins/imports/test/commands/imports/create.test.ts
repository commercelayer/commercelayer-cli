import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import { AUTH, api, apiError, importJob, ORG, resource, single, token, useMockedApi } from '../../helpers'

describe('imports:create', () => {
  useMockedApi()

  const dir = mkdtempSync(join(tmpdir(), 'imports-test-'))
  const jsonFile = join(dir, 'skus.json')
  const csvFile = join(dir, 'skus.csv')
  writeFileSync(jsonFile, JSON.stringify([{ code: 'TSHIRT-M', name: 'T-shirt M' }, { code: 'TSHIRT-L', name: 'T-shirt L' }]))
  writeFileSync(csvFile, 'code,name\nTSHIRT-M,T-shirt M\nTSHIRT-L,T-shirt L\n')
  writeFileSync(join(dir, 'empty.json'), '[]')

  const application = () => api().get('/api/application').reply(200, single(resource('application', 'AppId', { kind: 'integration' })))

  it('starts the import of a JSON file', async () => {
    application()
    api()
      .post('/api/imports', (body) => {
        const { attributes } = body.data
        return (
          attributes.resource_type === 'skus' &&
          attributes.format === 'json' &&
          attributes.inputs.length === 2 &&
          attributes.inputs[1].code === 'TSHIRT-L' &&
          attributes.reference_origin === 'cli-plugin-imports' &&
          attributes.metadata.chunk_number === '1/1'
        )
      })
      .reply(201, single(importJob('iMp9', { status: 'pending' })))
    const ctx = await runCommand(['imports:create', ...AUTH, '-t', 'skus', '-i', jsonFile, '--blind'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('The import of 2 skus has been started')
  })

  it('starts the import of a CSV file, header excluded from the count', async () => {
    application()
    api()
      .post('/api/imports', (body) => body.data.attributes.format === 'csv' && String(body.data.attributes.inputs).includes('TSHIRT-L'))
      .reply(201, single(importJob('iMp9', { status: 'pending', format: 'csv' })))
    const ctx = await runCommand(['imports:create', ...AUTH, '-t', 'skus', '-i', csvFile, '-C', '--blind'])
    if (ctx.error) throw ctx.error
    expect(ctx.stdout).to.contain('The import of 2 skus has been started')
  })

  it('stops when the file is empty', async () => {
    application()
    const ctx = await runCommand(['imports:create', ...AUTH, '-t', 'skus', '-i', join(dir, 'empty.json'), '--blind'])
    expect(ctx.error?.message).to.match(/No SKUs to import|No skus to import/i)
  })

  it('checks the access token first', async () => {
    api().get('/api/application').reply(401, apiError(401, 'Invalid token', 'The access token you provided is invalid.'))
    const ctx = await runCommand(['imports:create', ...AUTH, '-t', 'skus', '-i', jsonFile, '--blind'])
    expect(ctx.error?.message).to.match(/Invalid token: The access token you provided is invalid/)
  })

  it('requires an integration or cli token', async () => {
    const ctx = await runCommand(['imports:create', '-o', ORG, '--accessToken', token('sales_channel'), '-t', 'skus', '-i', jsonFile, '--blind'])
    expect(ctx.error?.message).to.match(/Invalid application kind: sales_channel/)
  })
})
