import { expect } from 'chai'
import { updateTarget } from '../src/commands/cli/update'
import { nodeErrorMessage, satisfiesNode, unsupportedNode } from '../src/engines'

describe('engines', () => {
  it('compares a Node.js version with a >= range', () => {
    expect(satisfiesNode('>=22.13', '22.13.0')).to.equal(true)
    expect(satisfiesNode('>=22.13', '24.1.0')).to.equal(true)
    expect(satisfiesNode('>=22.13', 'v22.12.9')).to.equal(false)
    expect(satisfiesNode('>=22.13', '20.5.1')).to.equal(false)
    expect(satisfiesNode('>=20', '20.0.0')).to.equal(true)
    // Another form of range, or none: npm decides
    expect(satisfiesNode('^20 || ^22', '18.0.0')).to.equal(true)
    expect(satisfiesNode(undefined, '18.0.0')).to.equal(true)
  })

  it('reports the range a release requires, when unsupported', () => {
    expect(unsupportedNode({ engines: { node: '>=22.13' } }, '20.5.1')).to.equal('>=22.13')
    expect(unsupportedNode({ engines: { node: '>=22.13' } }, '22.20.0')).to.equal(undefined)
  })

  it('explains how to go on with an older Node.js', () => {
    const message = nodeErrorMessage({ name: '@commercelayer/cli', version: '7.0.0', engines: { node: '>=22.13' } }, '20.5.1')
    expect(message).to.contain('Commerce Layer CLI 7.0.0 requires Node.js >=22.13 (current: 20.5.1)')
    expect(message).to.contain('npm install -g @commercelayer/cli@6')
    expect(nodeErrorMessage({ name: '@commercelayer/cli', version: '7.0.0', engines: { node: '>=22.13' } }, '22.13.1')).to.equal(undefined)
  })
})

describe('cli:update target', () => {
  it('stays on the current major unless asked otherwise', () => {
    expect(updateTarget('7.0.0', {})).to.equal('^7')
    expect(updateTarget('7.2.1', { latest: true })).to.equal('latest')
    expect(updateTarget('7.2.1', { version: '7.1.0' })).to.equal('7.1.0')
  })
})
