import { expect } from 'chai'
import { symbols } from '../../src/symbol'

describe('symbol', () => {
  it('defines the symbols and their aliases', () => {
    expect(symbols.check.small).to.equal('✔')
    expect(symbols.check.heavy).to.equal(symbols.check.small)
    expect(symbols.check.whiteHeavy).to.equal(symbols.check.bkgGreen)
    expect(symbols.cross.heavyBallot).to.equal(symbols.cross.small)
  })
})
