import { api, useMockedApi } from '@commercelayer/cli-test-utils'
import { expect } from 'chai'
import { download } from '../../src/schema'

describe('schema.download', () => {
  useMockedApi()

  const schemas = () => api('https://data.commercelayer.app')

  it('downloads the latest schema', async () => {
    schemas().get('/schemas/openapi.json').reply(200, { openapi: '3.1.0' })
    expect(await download()).to.deep.equal({ openapi: '3.1.0' })
  })

  it('downloads the schema of a version', async () => {
    schemas().get('/schemas/openapi_7-8-1.json').reply(200, { info: { version: '7.8.1' } })
    expect((await download('7.8.1')).info.version).to.equal('7.8.1')
  })
})
