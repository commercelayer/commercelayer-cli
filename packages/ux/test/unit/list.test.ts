import { expect } from 'chai'
import { renderList } from '../../src/list'

describe('list', () => {
  it('aligns the descriptions', () => {
    expect(renderList([
      ['a', 'first'],
      ['long', 'second'],
    ])).to.equal('a     first\nlong  second')
  })

  it('prints items without description as they are', () => {
    expect(renderList([['alone', undefined]])).to.equal('alone')
  })

  it('renders nothing for no items', () => {
    expect(renderList([])).to.equal('')
  })
})
