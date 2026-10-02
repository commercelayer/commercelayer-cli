import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { api, coreApi, useMockedApi } from '@commercelayer/cli-test-utils'
import { expect } from 'chai'
import {
  baseURL,
  execMode,
  extractDomain,
  humanizeResource,
  isRecordCountEstimated,
  isResourceCacheable,
  liveEnvironment,
  Operation,
  RECORD_COUNT_EXACT_MAX,
  request,
  requestRateLimitDelay,
} from '../../src/api'

describe('api', () => {
  describe('baseURL', () => {
    it('uses the organization slug for the core and metrics APIs', () => {
      expect(baseURL('core', 'My-Org')).to.equal('https://my-org.commercelayer.io')
      expect(baseURL('metrics', 'acme', 'commercelayer.co')).to.equal('https://acme.commercelayer.co')
    })

    it('uses the API name as subdomain for the other APIs', () => {
      expect(baseURL('provisioning', 'acme')).to.equal('https://provisioning.commercelayer.io')
      expect(baseURL('auth')).to.equal('https://auth.commercelayer.io')
    })

    it('falls back to the API name without a slug', () => {
      expect(baseURL()).to.equal('https://core.commercelayer.io')
    })
  })

  it('extracts the domain of a base URL', () => {
    expect(extractDomain('https://acme.commercelayer.io')).to.equal('commercelayer.io')
    expect(extractDomain('')).to.equal(undefined)
  })

  it('decodes the execution mode', () => {
    expect(execMode(true)).to.equal('live')
    expect(execMode('live')).to.equal('live')
    expect(execMode(false)).to.equal('test')
    expect(execMode('test')).to.equal('test')
    expect(execMode(undefined)).to.equal('test')
    expect(liveEnvironment('live')).to.equal(true)
    expect(liveEnvironment('test')).to.equal(false)
  })

  it('tells estimated list counts', () => {
    expect(RECORD_COUNT_EXACT_MAX).to.equal(10_000)
    expect(isRecordCountEstimated({ recordCount: 10_000 })).to.equal(false)
    expect(isRecordCountEstimated({ recordCount: 10_001 })).to.equal(true)
    // the API flag wins over the threshold when the SDK passes it on
    expect(isRecordCountEstimated({ recordCount: 20_000, recordCountEstimated: false })).to.equal(false)
    expect(isRecordCountEstimated({ recordCount: 5, record_count_estimated: true })).to.equal(true)
    expect(isRecordCountEstimated()).to.equal(false)
  })

  it('humanizes resource types', () => {
    expect(humanizeResource('price_lists')).to.equal('price lists')
    expect(humanizeResource('price_lists', true)).to.equal('price list')
  })

  it('knows which requests are cacheable', () => {
    expect(isResourceCacheable('skus')).to.equal(true)
    expect(isResourceCacheable('skus', 'get' as never)).to.equal(true)
    expect(isResourceCacheable('skus', 'PATCH')).to.equal(false)
    expect(isResourceCacheable('orders', 'GET')).to.equal(false)
    expect(isResourceCacheable()).to.equal(false)
  })

  describe('requestRateLimitDelay', () => {
    it('defaults to the slowest of the burst and average limits of the test environment', () => {
      // test, uncacheable: burst 10s/25 = 400ms, average 60s/100 = 600ms
      expect(requestRateLimitDelay()).to.equal(600)
    })

    it('uses the live and cacheable limits', () => {
      // live, uncacheable: burst 10s/50 = 200ms, average 60s/200 = 300ms
      expect(requestRateLimitDelay({ environment: 'live' })).to.equal(300)
      // live, cacheable: burst 10s/250 = 40ms, average 60s/1000 = 60ms
      expect(requestRateLimitDelay({ environment: 'live', resourceType: 'skus' })).to.equal(60)
    })

    it('scales with the parallel requests', () => {
      expect(requestRateLimitDelay({ parallelRequests: 3 })).to.equal(1800)
    })

    it('needs no delay when the total requests fit in a burst', () => {
      expect(requestRateLimitDelay({ totalRequests: 25 })).to.equal(0)
      expect(requestRateLimitDelay({ totalRequests: 26 })).to.equal(400)
      expect(requestRateLimitDelay({ totalRequests: 101 })).to.equal(600)
    })

    it('applies the minimum and security delays', () => {
      expect(requestRateLimitDelay({ totalRequests: 1, minimumDelay: 150 })).to.equal(150)
      expect(requestRateLimitDelay({ securityDelay: 50 })).to.equal(650)
    })
  })

  describe('request.raw', () => {
    useMockedApi()

    const config = (operation: Operation) => ({ baseUrl: coreApi(), resource: 'skus', accessToken: 'token', operation })

    it('creates a resource', async () => {
      const data = { data: { type: 'skus', attributes: { code: 'SKU1' } } }
      api()
        .post('/api/skus', data)
        .matchHeader('authorization', 'Bearer token')
        .matchHeader('content-type', 'application/vnd.api+json')
        .reply(201, { data: { id: 'sku1', type: 'skus' } })
      expect(await request.raw(config(Operation.Create), data)).to.deep.equal({ data: { id: 'sku1', type: 'skus' } })
    })

    it('updates a resource by id', async () => {
      api().patch('/api/skus/sku1').reply(200, { data: { id: 'sku1', type: 'skus' } })
      expect((await request.raw(config(Operation.Update), {}, 'sku1')).data.id).to.equal('sku1')
    })

    it('throws the status text of a failed request', async () => {
      api().post('/api/skus').reply(422, { errors: [] })
      let error: Error | undefined
      try {
        await request.raw(config(Operation.Create), {})
      } catch (e) {
        error = e as Error
      }
      expect(error?.message).to.equal('Unprocessable Entity')
    })
  })

  describe('request.readDataFile', () => {
    let dir: string
    before(() => {
      dir = mkdtempSync(join(tmpdir(), 'cli-core-'))
    })
    after(() => {
      rmSync(dir, { recursive: true, force: true })
    })

    const file = (name: string, content: string): string => {
      const path = join(dir, name)
      writeFileSync(path, content)
      return path
    }

    it('wraps the file content in a data member', () => {
      expect(request.readDataFile(file('plain.json', '{"type":"skus"}'))).to.deep.equal({ data: { type: 'skus' } })
    })

    it('keeps a document that already has a data member', () => {
      expect(request.readDataFile(file('doc.json', '{"data":{"type":"skus"}}'))).to.deep.equal({ data: { type: 'skus' } })
    })

    it('rejects missing files and invalid JSON', () => {
      expect(() => request.readDataFile(join(dir, 'missing.json'))).to.throw(/Unable to find or open the data file/)
      expect(() => request.readDataFile(file('bad.json', '{no'))).to.throw(/invalid JSON format/)
    })
  })
})
