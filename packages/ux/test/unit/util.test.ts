import { expect } from 'chai'
import {
  capitalize,
  castArray,
  compact,
  isNotFalsy,
  isProd,
  isTruthy,
  last,
  mapValues,
  maxBy,
  mergeNestedObjects,
  pickBy,
  sortBy,
  sumBy,
  uniq,
  uniqBy,
} from '../../src/util'

describe('util', () => {
  it('picks the entries matching a predicate', () => {
    expect(pickBy({ a: 1, b: 2, c: 3 }, (v) => v !== 2)).to.deep.equal({ a: 1, c: 3 })
  })

  it('compacts arrays', () => {
    expect(compact(['a', undefined, 'b'])).to.deep.equal(['a', 'b'])
  })

  it('keeps the last item of each key', () => {
    expect(uniqBy([{ k: 1, v: 'a' }, { k: 2, v: 'b' }, { k: 1, v: 'c' }], (i) => i.k)).to.deep.equal([
      { k: 2, v: 'b' },
      { k: 1, v: 'c' },
    ])
  })

  it('returns the last item', () => {
    expect(last([1, 2, 3])).to.equal(3)
    expect(last()).to.equal(undefined)
  })

  it('sorts by one or more keys', () => {
    const rows = [
      { a: 2, b: 'x' },
      { a: 1, b: 'y' },
      { a: 1, b: 'x' },
    ]
    expect(sortBy([...rows], (r) => r.a).map((r) => r.a)).to.deep.equal([1, 1, 2])
    expect(sortBy([...rows], (r) => [r.a, r.b])).to.deep.equal([
      { a: 1, b: 'x' },
      { a: 1, b: 'y' },
      { a: 2, b: 'x' },
    ])
    expect(sortBy([{ n: 3 }, {}, { n: 1 }], (r: { n?: number }) => r.n)).to.deep.equal([{}, { n: 1 }, { n: 3 }])
  })

  it('casts values to arrays', () => {
    expect(castArray('a')).to.deep.equal(['a'])
    expect(castArray(['a'])).to.deep.equal(['a'])
    expect(castArray()).to.deep.equal([])
  })

  it('tells a production environment', () => {
    const env = process.env.NODE_ENV
    try {
      process.env.NODE_ENV = 'test'
      expect(isProd()).to.equal(false)
      process.env.NODE_ENV = 'production'
      expect(isProd()).to.equal(true)
    } finally {
      if (env === undefined) delete process.env.NODE_ENV
      else process.env.NODE_ENV = env
    }
  })

  it('finds the max and the sum', () => {
    expect(maxBy([{ n: 1 }, { n: 3 }, { n: 2 }], (i) => i.n)).to.deep.equal({ n: 3 })
    expect(maxBy([], (i: number) => i)).to.equal(undefined)
    expect(sumBy([{ n: 1 }, { n: 3 }], (i) => i.n)).to.equal(4)
  })

  it('capitalizes lowercasing the rest', () => {
    expect(capitalize('hELLO')).to.equal('Hello')
    expect(capitalize('')).to.equal('')
  })

  it('parses truthy and falsy answers', () => {
    for (const t of ['1', 'true', 'Y', 'yes']) expect(isTruthy(t), t).to.equal(true)
    expect(isTruthy('maybe')).to.equal(false)
    for (const f of ['0', 'FALSE', 'n', 'no']) expect(isNotFalsy(f), f).to.equal(false)
    expect(isNotFalsy('maybe')).to.equal(true)
  })

  it('returns the sorted unique values', () => {
    expect(uniq(['b', 'a', 'b'])).to.deep.equal(['a', 'b'])
  })

  it('maps the values of an object', () => {
    expect(mapValues({ a: 1, b: 2 }, (v, k) => `${String(k)}${v * 2}`)).to.deep.equal({ a: 'a2', b: 'b4' })
  })

  it('merges nested objects, the first one winning', () => {
    const objs = [{ x: { theme: { a: 1 } } }, { x: { theme: { a: 2, b: 2 } } }, { y: {} }]
    expect(mergeNestedObjects(objs, 'x.theme')).to.deep.equal({ a: 1, b: 2 })
  })
})
