import { expect } from 'chai'
import { apply, available, documentation, filters, list } from '../../src/filter'

describe('filter', () => {
  it('lists the predicates without the attribute placeholder', () => {
    expect(list()).to.include.members(['_eq', '_in', '_cont', '_true'])
    expect(list().every((f) => f.startsWith('_'))).to.equal(true)
    expect(filters()[0]).to.have.keys('predicate', 'description')
  })

  it('returns a copy of the filters', () => {
    filters().pop()
    expect(filters()).to.have.length(list().length)
  })

  it('recognizes filters with and without the leading underscore', () => {
    expect(available('eq')).to.equal(true)
    expect(available('_not_in_or_null')).to.equal(true)
    expect(available('code_start')).to.equal(true)
    expect(available('unknown')).to.equal(false)
  })

  it('builds the filter of one or more fields', () => {
    expect(apply('eq', 'code')).to.equal('code_eq')
    expect(apply('_cont', 'name', 'code')).to.equal('name_or_code_cont')
  })

  it('rejects an unknown predicate', () => {
    expect(() => apply('like', 'code')).to.throw('Unknown filter: like')
  })

  it('links the filtering documentation', () => {
    expect(documentation).to.match(/^https:\/\//)
  })
})
