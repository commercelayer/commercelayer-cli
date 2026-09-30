import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { join, sep } from 'node:path'
import { expect } from 'chai'
import { dotNotationToObject, generateGroupUID, sleep, specialFolder, userAgent } from '../../src/util'

describe('util', () => {
  it('resolves the home and desktop special folders', () => {
    expect(specialFolder('home/export.json')).to.equal(`${homedir()}/export.json`)
    expect(specialFolder('Desktop/export.json')).to.equal(`${homedir()}${sep}Desktop/export.json`)
    expect(specialFolder('/tmp/export.json')).to.equal('/tmp/export.json')
  })

  it('creates the folder of the file when asked', () => {
    const dir = mkdtempSync(join(tmpdir(), 'cli-core-'))
    try {
      const file = join(dir, 'a', 'b', 'export.json')
      expect(specialFolder(file, true)).to.equal(file)
      expect(existsSync(join(dir, 'a', 'b'))).to.equal(true)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  it('generates six-character group ids', () => {
    const uid = generateGroupUID()
    expect(uid).to.match(/^[0-9a-z]{6}$/)
  })

  it('builds the user agent of a plugin or of the CLI', () => {
    expect(userAgent({ name: '@commercelayer/cli-plugin-tags', version: '3.0.0' } as never)).to.equal('CLI-tags/3.0.0')
    expect(userAgent({ name: '@commercelayer/cli', version: '7.0.0' } as never)).to.equal('@commercelayer/cli/7.0.0')
  })

  it('expands dot notation keys into nested objects', () => {
    expect(dotNotationToObject({ 'a.b.c': 1, 'a.d': 2, e: 3 })).to.deep.equal({ a: { b: { c: 1 }, d: 2 }, e: 3 })
  })

  it('expands dot notation keys into an existing object', () => {
    const target: Record<string, unknown> = { x: 0 }
    dotNotationToObject({ 'a.b': 1 }, target)
    expect(target).to.deep.equal({ x: 0, a: { b: 1 } })
  })

  it('sleeps', async () => {
    const start = Date.now()
    await sleep(20)
    expect(Date.now() - start).to.be.at.least(15)
  })
})
