import { expect } from 'chai'
import { styledObject, Table, tree } from '../../src/styled'
import { plain } from '../helpers'

describe('styled', () => {
  describe('styledObject', () => {
    it('prints the keys sorted and aligned, skipping empty values', () => {
      const out = plain(styledObject({ name: 'Jane', id: 42, missing: null, tags: ['a', 'b'], empty: [] }))
      expect(out).to.equal(['id:      42', 'name:    Jane', 'tags:    a', '         b'].join('\n'))
    })

    it('prints only the given keys, in their order', () => {
      expect(plain(styledObject({ a: 1, b: { c: 2 } }, ['b', 'a']))).to.equal('b: c: 2\na: 1')
    })
  })

  describe('tree', () => {
    it('inserts, searches and displays nodes', () => {
      const t = tree()
      const child = tree().insert('leaf')
      t.insert('root', child)
      expect(t.search('leaf')).to.be.instanceOf(Object)
      expect(t.search('ghost')).to.equal(undefined)
      let out = ''
      t.display((s: string) => {
        out = s
      })
      expect(out).to.equal('└─ root\n   └─ leaf')
    })
  })

  describe('Table', () => {
    const data = [
      { id: 'a1', name: 'Alpha', status: 'active', notes: null },
      { id: 'b2', name: 'Beta', status: 'draft', notes: 'x, y' },
      { id: 'c3', name: 'Gamma', status: 'active', notes: 'multi\nline' },
    ]
    const columns = { id: {}, name: { header: 'NAME' }, status: { extended: true }, notes: { get: (r: (typeof data)[number]) => r.notes ?? '-' } }

    const print = (options: Parameters<typeof Table.table>[2] = {}, rows = data): string[] => {
      const lines: string[] = []
      Table.table(rows, columns, { ...options, printLine: (s: string) => lines.push(plain(s)) })
      return lines
    }

    it('prints headers and rows, hiding extended columns', () => {
      const lines = print()
      expect(lines[0].trim().split(/\s+/)).to.deep.equal(['Id', 'NAME', 'Notes'])
      expect(lines[2]).to.match(/a1\s+Alpha\s+-/)
      expect(lines).to.have.length(2 + 4) // header, divider, 3 rows + 1 for the multi-line cell
      expect(lines[5].trim()).to.equal('line')
    })

    it('shows the extended columns and hides the header', () => {
      const lines = print({ extended: true, 'no-header': true })
      expect(lines[0]).to.match(/a1\s+Alpha\s+active/)
    })

    it('selects, filters and sorts', () => {
      expect(print({ columns: 'name', 'no-header': true }).map((l) => l.trim())).to.deep.equal(['Alpha', 'Beta', 'Gamma'])
      expect(print({ columns: 'name', filter: 'status=act', extended: true, 'no-header': true }).map((l) => l.trim())).to.deep.equal(['Alpha', 'Gamma'])
      expect(print({ columns: 'name', filter: '-name=^B', 'no-header': true }).map((l) => l.trim())).to.deep.equal(['Alpha', 'Gamma'])
      expect(print({ columns: 'name', sort: '-name', 'no-header': true }).map((l) => l.trim())).to.deep.equal(['Gamma', 'Beta', 'Alpha'])
    })

    it('rejects an invalid filter', () => {
      expect(() => print({ filter: 'ghost=x' })).to.throw('Filter flag has an invalid value')
    })

    it('prints CSV, quoting the rows that need it', () => {
      expect(print({ csv: true })).to.deep.equal(['Id,NAME,Notes', 'a1,Alpha,-', '"b2","Beta","x, y"', '"c3","Gamma","multi\nline"'])
    })

    it('prints JSON and YAML', () => {
      const json = JSON.parse(print({ output: 'json', columns: 'id,name' })[0])
      expect(json).to.deep.equal([
        { id: 'a1', name: 'Alpha' },
        { id: 'b2', name: 'Beta' },
        { id: 'c3', name: 'Gamma' },
      ])
      expect(print({ output: 'yaml', columns: 'id' })[0]).to.equal('- id: a1\n- id: b2\n- id: c3\n')
    })

    it('prints a title', () => {
      const lines = print({ title: 'Items', columns: 'id' })
      expect(lines[0]).to.equal('Items')
      expect(lines[1]).to.match(/^=+$/)
      expect(lines[2]).to.match(/^\| Id/)
    })

    it('builds the table flags', () => {
      expect(Table.table.flags()).to.have.keys('columns', 'csv', 'extended', 'filter', 'no-header', 'no-truncate', 'output', 'sort')
      expect(Table.table.flags({ only: 'csv' })).to.have.keys('csv')
      expect(Table.table.flags({ except: ['csv', 'sort'] })).not.to.have.any.keys('csv', 'sort')
    })
  })
})
