import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, test } from '@oclif/test'
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

  test
    .do(() => {
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
    })
    .stdout()
    .command(['imports:create', ...AUTH, '-t', 'skus', '-i', jsonFile, '--blind'])
    .it('starts the import of a JSON file', (ctx) => {
      expect(ctx.stdout).to.contain('The import of 2 skus has been started')
    })

  test
    .do(() => {
      application()
      api()
        .post('/api/imports', (body) => body.data.attributes.format === 'csv' && String(body.data.attributes.inputs).includes('TSHIRT-L'))
        .reply(201, single(importJob('iMp9', { status: 'pending', format: 'csv' })))
    })
    .stdout()
    .command(['imports:create', ...AUTH, '-t', 'skus', '-i', csvFile, '-C', '--blind'])
    .it('starts the import of a CSV file, header excluded from the count', (ctx) => {
      expect(ctx.stdout).to.contain('The import of 2 skus has been started')
    })

  test
    .do(() => {
      application()
    })
    .command(['imports:create', ...AUTH, '-t', 'skus', '-i', join(dir, 'empty.json'), '--blind'])
    .catch(/No SKUs to import|No skus to import/i)
    .it('stops when the file is empty')

  test
    .do(() => {
      api().get('/api/application').reply(401, apiError(401, 'Invalid token', 'The access token you provided is invalid.'))
    })
    .command(['imports:create', ...AUTH, '-t', 'skus', '-i', jsonFile, '--blind'])
    .catch(/Invalid token: The access token you provided is invalid/)
    .it('checks the access token first')

  test
    .command(['imports:create', '-o', ORG, '--accessToken', token('sales_channel'), '-t', 'skus', '-i', jsonFile, '--blind'])
    .catch(/Invalid application kind: sales_channel/)
    .it('requires an integration or cli token')
})
