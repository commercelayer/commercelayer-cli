import { expect } from 'chai'
import { appKey, appKeyMatch, appKeyValid, arrayScope, isProvisioningApp } from '../../src/application'

describe('application', () => {
  it('builds an application key from the current time', () => {
    expect(appKey()).to.match(/^[0-9a-z]+$/)
  })

  it('checks an application key', () => {
    expect(appKeyValid({ key: 'abc', mode: 'test' })).to.equal(true)
    expect(appKeyValid({ key: '', mode: 'test' })).to.equal(false)
  })

  it('matches application keys', () => {
    expect(appKeyMatch({ key: 'a', mode: 'test' }, { key: 'a', mode: 'live' })).to.equal(true)
    expect(appKeyMatch({ key: 'a', mode: 'test' }, { key: 'b', mode: 'test' })).to.equal(false)
    expect(appKeyMatch({ key: 'a', mode: 'test' }, undefined)).to.equal(false)
    expect(appKeyMatch(undefined, undefined)).to.equal(true)
  })

  it('splits a scope on spaces, commas and semicolons', () => {
    expect(arrayScope('market:1 market:2,stock_location:3;store:4')).to.deep.equal(['market:1', 'market:2', 'stock_location:3', 'store:4'])
    expect(arrayScope(['market:1'])).to.deep.equal(['market:1'])
    expect(arrayScope()).to.deep.equal([])
  })

  it('recognizes provisioning applications', () => {
    expect(isProvisioningApp({ clientId: 'x', scope: 'provisioning-api' })).to.equal(true)
    expect(isProvisioningApp({ clientId: 'x', api: 'provisioning' })).to.equal(true)
    expect(isProvisioningApp({ clientId: 'x', scope: 'market:1' })).to.equal(false)
  })
})
