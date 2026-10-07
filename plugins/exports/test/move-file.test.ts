import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { copyFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect } from 'chai'
import { moveFile } from '../src/base'

describe('moveFile', () => {
  const dir = mkdtempSync(join(tmpdir(), 'exports-move-'))

  it('renames a file', async () => {
    writeFileSync(join(dir, 'a.json'), '[1]')
    await moveFile(join(dir, 'a.json'), join(dir, 'b.json'))
    expect(readFileSync(join(dir, 'b.json'), 'utf8')).to.equal('[1]')
  })

  it('copies and removes the file when rename crosses file systems (EXDEV)', async () => {
    writeFileSync(join(dir, 'c.json'), '[2]')
    const removed: string[] = []
    const crossDevice = Object.assign(new Error('EXDEV: cross-device link not permitted'), { code: 'EXDEV' })
    await moveFile(join(dir, 'c.json'), join(dir, 'd.json'), {
      rename: async () => {
        throw crossDevice
      },
      copyFile,
      rm: async (path: any, options?: any) => {
        removed.push(String(path))
        await rm(path, options)
      },
    })
    expect(readFileSync(join(dir, 'd.json'), 'utf8')).to.equal('[2]')
    expect(removed).to.deep.equal([join(dir, 'c.json')])
  })

  it('keeps other errors', async () => {
    const denied = Object.assign(new Error('EACCES'), { code: 'EACCES' })
    const failing = { rename: async () => Promise.reject(denied), copyFile, rm }
    const error = await moveFile('x', 'y', failing as any).then(
      () => undefined,
      (e) => e,
    )
    expect(error).to.equal(denied)
  })
})
