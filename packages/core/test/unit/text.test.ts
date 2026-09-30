import { expect } from 'chai'
import { camelize, capitalize, dasherize, pluralize, singularize, underscorize } from '../../src/text'

describe('text', () => {
  it('capitalizes the first letter only', () => {
    expect(capitalize('hello World')).to.equal('Hello world')
    expect(capitalize('')).to.equal('')
    expect(capitalize(undefined)).to.equal(undefined)
  })

  it('dasherizes and underscorizes lowercasing the text', () => {
    expect(dasherize('Price List_items')).to.equal('price-list-items')
    expect(underscorize('Price List-items')).to.equal('price_list_items')
    expect(dasherize(undefined)).to.equal(undefined)
    expect(underscorize('')).to.equal('')
  })

  it('pluralizes and singularizes resource names', () => {
    expect(pluralize('sku')).to.equal('skus')
    expect(pluralize('address')).to.equal('addresses')
    expect(pluralize('inventory_stock_location')).to.equal('inventory_stock_locations')
    expect(singularize('addresses')).to.equal('address')
    expect(singularize('price_lists')).to.equal('price_list')
    expect(singularize('people')).to.equal('person')
  })

  it('uses the explicit plural and singular forms when given', () => {
    expect(pluralize('foo', 'fooz')).to.equal('fooz')
    expect(singularize('fooz', 'foo')).to.equal('foo')
  })

  it('camelizes underscored names', () => {
    expect(camelize('price_list')).to.equal('PriceList')
    expect(camelize('price_list', true)).to.equal('priceList')
  })
})
