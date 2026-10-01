import { expect } from 'chai'
import chalk from 'chalk'
import { colorize, getColor, parseTheme } from '../../src/theme'

describe('theme', () => {
  let level: typeof chalk.level
  before(() => {
    level = chalk.level
    chalk.level = 3
  })
  after(() => {
    chalk.level = level
  })

  it('colorizes with chalk colors and hex codes', () => {
    expect(colorize('red', 'x')).to.equal(chalk.red('x'))
    expect(colorize('#00ff00', 'x')).to.equal(chalk.hex('#00ff00')('x'))
    expect(colorize(undefined, 'x')).to.equal('x')
  })

  it('normalizes colors to chalk names or hex codes', () => {
    expect(getColor('cyan')).to.equal('cyan')
    expect(getColor('rgb(255, 0, 0)')).to.equal('#FF0000')
    expect(getColor('not a color')).to.equal(undefined)
  })

  it('parses a theme dropping invalid colors', () => {
    expect(parseTheme({ bin: 'blue', flag: '#123456', topic: 'nope' })).to.deep.equal({ bin: 'blue', flag: '#123456' })
  })
})
