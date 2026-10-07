import { expect } from 'chai'
import { countCsvRecords } from '../src/csv'

describe('countCsvRecords', () => {
  it('counts the lines ended by a line break', () => {
    expect(countCsvRecords('code,name\nA,Alpha\nB,Beta\n')).to.equal(3)
    expect(countCsvRecords('')).to.equal(0)
  })

  it('keeps commas, line breaks and escaped quotes of quoted fields in their record', () => {
    expect(countCsvRecords('code,name\n"A,1","Alpha\nsecond line"\n"B","say ""hi""\n"\n')).to.equal(3)
  })

  it('runs in linear time on the input that made the regular expression backtrack', () => {
    const start = Date.now()
    expect(countCsvRecords(`,${'"",'.repeat(50_000)}`)).to.equal(0)
    expect(Date.now() - start).to.be.lessThan(1000)
  })
})
