import { expect } from 'chai'
import { center, cleanDate, formatError, formatOutput, localeDate, maxLength, printCSV, printJSON, printObject } from '../../src/output'

describe('output', () => {
  const rows = [
    { id: 'a1', type: 'skus', code: 'SKU1', shipping_category: 'std' },
    { id: 'a2', type: 'skus', code: 'SKU2', shipping_category: 'fast' },
  ]

  it('prints JSON indented or unformatted', () => {
    expect(printJSON({ a: 1 })).to.equal('{\n    "a": 1\n}')
    expect(printJSON({ a: 1 }, { tabSize: 2 })).to.equal('{\n  "a": 1\n}')
    expect(printJSON({ a: 1 }, { unformatted: true })).to.equal('{"a":1}')
  })

  it('prints objects without colors', () => {
    expect(printObject({ b: 1, a: [1, 2] }, { color: false })).to.equal('{ b: 1, a: [ 1, 2 ] }')
    expect(printObject({ b: 1, a: 2 }, { color: false, sort: true })).to.equal('{ a: 2, b: 1 }')
  })

  describe('printCSV', () => {
    it('prints a header and a row per object, without id and type', () => {
      expect(printCSV(rows)).to.equal('CODE;SHIPPING CATEGORY\nSKU1;std\nSKU2;fast\n')
    })

    it('keeps id and type when they are among the requested fields', () => {
      expect(printCSV(rows, { fields: ['id'] })).to.equal('ID;CODE;SHIPPING CATEGORY\na1;SKU1;std\na2;SKU2;fast\n')
    })

    it('prints nothing for no rows', () => {
      expect(printCSV([])).to.equal('')
    })
  })

  it('centers a string', () => {
    expect(center('ab', 6)).to.equal('  ab  ')
    expect(center('abc', 6)).to.equal(' abc  ')
  })

  it('computes the longest value of a field', () => {
    expect(maxLength(rows, 'shipping_category')).to.equal(4)
    expect(maxLength([{ f: ['a', 'bcd'] }], 'f')).to.equal(5)
    expect(maxLength([], 'f')).to.equal(0)
  })

  it('cleans ISO dates', () => {
    expect(cleanDate('2026-01-01T10:00:00.000Z')).to.equal('2026-01-01 10:00:00')
    expect(cleanDate('2026-01-01T10:00:00Z')).to.equal('2026-01-01 10:00:00')
    expect(cleanDate('')).to.equal('')
  })

  it('localizes dates', () => {
    expect(localeDate('2026-01-01T10:00:00.000Z')).to.equal(new Date('2026-01-01T10:00:00.000Z').toLocaleString())
    expect(localeDate('')).to.equal('')
  })

  describe('formatOutput', () => {
    it('returns strings as they are and nothing for no output', () => {
      expect(formatOutput('done')).to.equal('done')
      expect(formatOutput(undefined)).to.equal('')
    })

    it('formats as CSV, JSON or object according to the flags', () => {
      expect(formatOutput(rows, { csv: true })).to.equal(printCSV(rows))
      expect(formatOutput({ a: 1 }, { json: true, unformatted: true })).to.equal('{"a":1}')
      expect(formatOutput({ a: 1 }, {}, { color: false })).to.equal('{ a: 1 }')
    })

    it('formats the errors of an API error', () => {
      expect(formatError({ errors: [{ code: 'NOT_FOUND' }] }, { json: true, unformatted: true })).to.equal('[{"code":"NOT_FOUND"}]')
      expect(formatError({ message: 'boom' }, { json: true, unformatted: true })).to.equal('{"message":"boom"}')
    })
  })
})
