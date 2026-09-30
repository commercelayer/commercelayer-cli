import { expect } from 'chai'
import { denormalize } from '../../src/jsonapi'

describe('jsonapi.denormalize', () => {
  const included = [
    { id: 'm1', type: 'markets', attributes: { name: 'EU' }, relationships: { price_list: { data: { id: 'pl1', type: 'price_lists' } } } },
    { id: 'pl1', type: 'price_lists', attributes: { currency_code: 'EUR' } },
    { id: 't1', type: 'tags', attributes: { name: 'vip' } },
    { id: 't2', type: 'tags', attributes: { name: 'new' } },
  ]

  const customer = {
    id: 'c1',
    type: 'customers',
    attributes: { email: 'jane@example.com' },
    relationships: {
      market: { data: { id: 'm1', type: 'markets' } },
      tags: { data: [{ id: 't1', type: 'tags' }, { id: 't2', type: 'tags' }] },
      customer_group: { data: null },
      orders: { links: {} },
    },
  }

  it('merges attributes and nested included relationships into the resource', () => {
    const res = denormalize({ data: customer, included, links: { self: 'x' } })
    expect(res).to.deep.equal({
      id: 'c1',
      type: 'customers',
      email: 'jane@example.com',
      market: { id: 'm1', type: 'markets', name: 'EU', price_list: { id: 'pl1', type: 'price_lists', currency_code: 'EUR' } },
      tags: [
        { id: 't1', type: 'tags', name: 'vip' },
        { id: 't2', type: 'tags', name: 'new' },
      ],
      customer_group: null,
    })
  })

  it('denormalizes a collection', () => {
    const res = denormalize({ data: [customer, { id: 'c2', type: 'customers', attributes: { email: 'joe@example.com' } }], included })
    expect(res).to.have.length(2)
    expect(res[0].market.name).to.equal('EU')
    expect(res[1]).to.deep.equal({ id: 'c2', type: 'customers', email: 'joe@example.com' })
  })

  it('drops the links of the response', () => {
    const response = { data: { id: 'c2', type: 'customers', attributes: {} }, links: { self: 'x' } }
    denormalize(response)
    expect(response).not.to.have.property('links')
  })
})
