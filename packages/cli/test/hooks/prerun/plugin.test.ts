import { expect } from 'chai'
import { testBuildPlugin } from '../../../src/hooks/prerun/plugin'

describe('hooks:prerun:plugin', () => {
  describe('test builds', () => {
    it('recognizes a pkg.pr.new preview of a known plugin', () => {
      expect(testBuildPlugin('https://pkg.pr.new/commercelayer/commercelayer-cli/@commercelayer/cli-plugin-tags@5259929')).to.equal('@commercelayer/cli-plugin-tags')
      expect(testBuildPlugin('https://pkg.pr.new/@commercelayer/cli-plugin-orders@a1b2c3d')).to.equal('@commercelayer/cli-plugin-orders')
    })

    it('recognizes a local tarball of a known plugin', () => {
      expect(testBuildPlugin('file:/tmp/try/commercelayer-cli-plugin-webhooks-5.0.0.tgz')).to.equal('@commercelayer/cli-plugin-webhooks')
      expect(testBuildPlugin('file:./commercelayer-cli-plugin-imports-5.0.0-beta.0.tgz')).to.equal('@commercelayer/cli-plugin-imports')
    })

    it('rejects unknown plugins and other hosts', () => {
      expect(testBuildPlugin('https://pkg.pr.new/@commercelayer/cli-plugin-unicorn@a1b2c3d')).to.equal(undefined)
      expect(testBuildPlugin('file:/tmp/commercelayer-cli-plugin-unicorn-1.0.0.tgz')).to.equal(undefined)
      expect(testBuildPlugin('https://example.com/@commercelayer/cli-plugin-tags@1')).to.equal(undefined)
      expect(testBuildPlugin('tags')).to.equal(undefined)
    })
  })
})
