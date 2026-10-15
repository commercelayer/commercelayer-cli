import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect } from 'chai'
import { getAvailablePlugins } from '../../../src/commands/plugins/available'
import { pinPlugins, testBuildPlugin } from '../../../src/hooks/prerun/plugin'

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

describe('hooks:prerun:plugin pinning', () => {
  const table = getAvailablePlugins()
  const range = (name: string): string | undefined => table.find((p) => p.name === name)?.version

  it('pins the plugins that follow latest to their installed major, or else to the plugin table', () => {
    const manifest = {
      oclif: {
        plugins: [
          { name: '@commercelayer/cli-plugin-tags', tag: 'latest', type: 'user' },
          { name: '@commercelayer/cli-plugin-orders', type: 'user' },
          { name: '@commercelayer/cli-plugin-imports', tag: '^4', type: 'user' },
          { name: 'some-other-plugin', tag: 'latest', type: 'user' },
        ],
      },
    }
    const installed = new Map([['@commercelayer/cli-plugin-orders', '5.7.0']])
    expect(pinPlugins(manifest, table, installed)).to.equal(true)
    // orders keeps its major 5 even if the table installs ^6: a new major is never implicit
    expect(manifest.oclif.plugins.map((p) => p.tag)).to.deep.equal([range('tags'), '^5', '^4', 'latest'])
    expect(pinPlugins(manifest, table, installed)).to.equal(false)
  })
})

describe('plugin table', () => {
  it('installs the current major of every plugin of the workspace, as a ^N range', () => {
    for (const p of getAvailablePlugins()) {
      const { name, version } = JSON.parse(readFileSync(join(__dirname, `../../../../../plugins/${p.name}/package.json`), 'utf8'))
      expect(name).to.equal(p.plugin)
      expect(p.version, p.name).to.equal(`^${version.split('.')[0]}`)
    }
  })
})
