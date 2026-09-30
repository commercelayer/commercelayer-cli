import { Flags } from '@oclif/core'
import { expect } from 'chai'
import { allFlags, checkISODateTimeValue, commandFlags, findLongStringFlag, fixDashedFlagValue, fixValueType } from '../../src/command'

describe('command', () => {
  const flags = {
    organization: Flags.string({ char: 'o' }),
    json: Flags.boolean({ char: 'j' }),
    csv: Flags.boolean(),
  }

  it('copies the flags excluding some of them', () => {
    const copy = commandFlags(flags, ['csv'])
    expect(copy).to.have.keys('organization', 'json')
    expect(flags).to.have.keys('organization', 'json', 'csv')
    expect(commandFlags(flags)).to.have.keys('organization', 'json', 'csv')
  })

  it('merges the command flags with its base flags', () => {
    const command = { flags: { json: flags.json }, baseFlags: { organization: flags.organization } }
    expect(allFlags(command as never)).to.have.keys('json', 'organization')
  })

  it('converts string values to their type', () => {
    expect(fixValueType('null')).to.equal(null)
    expect(fixValueType('42')).to.equal(42)
    expect(fixValueType('1.5')).to.equal(1.5)
    expect(fixValueType('true')).to.equal(true)
    expect(fixValueType('false')).to.equal(false)
    expect(fixValueType('abc')).to.equal('abc')
  })

  describe('findLongStringFlag', () => {
    it('finds a flag followed by its value', () => {
      expect(findLongStringFlag(['-o', 'acme', '--name', 'vip'], 'name')).to.deep.equal({ value: 'vip', index: 2, single: false })
    })

    it('finds a flag with an inline value', () => {
      expect(findLongStringFlag(['--name=vip'], '--name')).to.deep.equal({ value: 'vip', index: 0, single: true })
    })

    it('returns undefined when the flag is missing', () => {
      expect(findLongStringFlag(['-o', 'acme'], 'name')).to.equal(undefined)
    })
  })

  describe('fixDashedFlagValue', () => {
    const flag = { name: 'value', char: 'v' }

    it('protects a value starting with a dash from the flag parser', () => {
      expect(fixDashedFlagValue(['-v', '-10'], flag)).to.deep.equal(['-v', '____-10'])
      expect(fixDashedFlagValue(['--value', '-10'], flag)).to.deep.equal(['--value', '____-10'])
      expect(fixDashedFlagValue(['--value=-10'], flag)).to.deep.equal(['--value=____-10'])
    })

    it('restores the parsed value', () => {
      const parsed = { flags: { value: '____-10' }, raw: [{ type: 'flag', flag: 'value', input: '____-10' }] }
      expect(fixDashedFlagValue(['-v', '____-10'], flag, undefined, parsed)).to.deep.equal(['-v', '-10'])
      expect(parsed.flags.value).to.equal('-10')
      expect(parsed.raw[0].input).to.equal('-10')
    })

    it('leaves other values and missing flags alone', () => {
      expect(fixDashedFlagValue(['-v', '10'], flag)).to.deep.equal(['-v', '10'])
      expect(fixDashedFlagValue(['-o', 'acme'], flag)).to.deep.equal(['-o', 'acme'])
      expect(fixDashedFlagValue(['-v', '-10'], {})).to.deep.equal(['-v', '-10'])
    })
  })

  describe('checkISODateTimeValue', () => {
    it('parses an ISO date', () => {
      expect(checkISODateTimeValue('2026-01-01T10:00:00.000Z').toISOString()).to.equal('2026-01-01T10:00:00.000Z')
    })

    it('rejects empty and invalid dates', () => {
      expect(() => checkISODateTimeValue()).to.throw('Date is empty')
      expect(() => checkISODateTimeValue('yesterday')).to.throw('Error parsing date: yesterday')
    })
  })
})
