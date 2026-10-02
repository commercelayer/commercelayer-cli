import { expect } from 'chai'
import { previousVersion, resolveTag, sortByDependencies, tagOf, workspaceDeps } from '../src/workspace.ts'
import { pkg } from './helpers.ts'

describe('workspace', () => {
  const packages = [pkg('core', '6.0.0'), pkg('tags', '3.1.0', ['core']), pkg('dev', '1.0.0', [], { private: true }), pkg('beta', '2.0.0-beta.1')]

  describe('resolveTag', () => {
    it('resolves a release tag to its package', () => {
      const target = resolveTag('tags-v3.1.0', packages)
      expect(target).to.include({ name: '@cl/tags', tag: 'tags-v3.1.0', prerelease: false, distTag: 'latest' })
    })
    it('refuses what is not a <dir>-v<version> tag', () => {
      expect(resolveTag('v3.1.0', packages)).to.have.property('error').that.matches(/not a <dir>-v<version> tag/)
      expect(resolveTag('tags-v3.1', packages)).to.have.property('error')
    })
    it('refuses an unknown folder, a private package, a version mismatch and a prerelease', () => {
      expect(resolveTag('nope-v1.0.0', packages)).to.have.property('error').that.matches(/does not match a workspace package/)
      expect(resolveTag('dev-v1.0.0', packages)).to.have.property('error').that.matches(/private/)
      expect(resolveTag('tags-v3.0.0', packages)).to.have.property('error').that.matches(/does not match plugins\/tags\/package.json \(3.1.0\)/)
      expect(resolveTag('beta-v2.0.0-beta.1', packages)).to.have.property('error').that.matches(/prerelease/)
    })
  })

  it('tagOf builds <dir>-v<version>', () => {
    expect(tagOf(packages[1])).to.equal('tags-v3.1.0')
    expect(tagOf(packages[1], '4.0.0')).to.equal('tags-v4.0.0')
  })

  it('workspaceDeps lists the workspace: dependencies only', () => {
    expect(workspaceDeps(packages[1])).to.deep.equal(['@cl/core'])
  })

  it('sortByDependencies puts dependencies first, the rest by folder', () => {
    const sorted = sortByDependencies([pkg('zeta', '1.0.0', ['ux']), pkg('cli', '1.0.0', ['core', 'ux']), pkg('ux', '1.0.0', ['core']), pkg('core', '1.0.0'), pkg('alpha', '1.0.0')])
    const order = sorted.map((p) => p.dir)
    expect(order.indexOf('core')).to.be.lessThan(order.indexOf('ux'))
    expect(order.indexOf('ux')).to.be.lessThan(order.indexOf('cli'))
    expect(order.indexOf('ux')).to.be.lessThan(order.indexOf('zeta'))
    expect(order[0]).to.equal('alpha')
  })

  describe('previousVersion', () => {
    const versions = ['1.0.0', '1.1.0', '2.0.0-beta.0', '2.0.0-beta.1', '1.10.0', 'junk']
    it('is the closest lower stable version for a stable release', () => {
      expect(previousVersion(versions, '2.0.0')).to.equal('1.10.0')
      expect(previousVersion(versions, '1.10.0')).to.equal('1.1.0')
    })
    it('is the closest lower version of any kind for a prerelease', () => {
      expect(previousVersion(versions, '2.0.0-beta.2')).to.equal('2.0.0-beta.1')
    })
    it('is undefined for a first release', () => {
      expect(previousVersion(versions, '1.0.0')).to.equal(undefined)
    })
  })
})
