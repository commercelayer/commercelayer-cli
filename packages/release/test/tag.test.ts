import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect } from 'chai'
import { versionCommit } from '../src/commands/tag.ts'

describe('tag', () => {
  let dir: string
  let cwd: string
  const git = (...args: string[]) => execFileSync('git', args, { cwd: dir, encoding: 'utf8' }).trim()
  const manifest = (version: string, dep = '^1.0.0') =>
    writeFileSync(join(dir, 'plugins/tags/package.json'), `${JSON.stringify({ name: '@cl/tags', version, dependencies: { chalk: dep } }, null, 2)}\n`)
  const commit = (message: string) => {
    git('add', '-A')
    git('commit', '-q', '-m', message)
    return git('rev-parse', 'HEAD')
  }

  before(() => {
    cwd = process.cwd()
    dir = mkdtempSync(join(tmpdir(), 'cl-release-tag-'))
    mkdirSync(join(dir, 'plugins/tags'), { recursive: true })
    git('init', '-q', '-b', 'main')
    git('config', 'user.email', 'test@example.com')
    git('config', 'user.name', 'Test')
    process.chdir(dir)
  })
  after(() => {
    process.chdir(cwd)
    rmSync(dir, { recursive: true, force: true })
  })

  it('tags the version bump of the release PR, not a pull request merged after it', () => {
    manifest('1.0.0')
    commit('feat: first')
    // The release PR bumps the version on its own branch, merged with a merge commit
    git('switch', '-q', '-c', 'release/tags-v1.1.0')
    manifest('1.1.0')
    const bump = commit('chore(release): tags-v1.1.0')
    git('switch', '-q', 'main')
    writeFileSync(join(dir, 'other.txt'), 'other\n')
    commit('fix: something else')
    git('merge', '-q', '--no-ff', '-m', 'Merge pull request #1', 'release/tags-v1.1.0')
    // Merged after the release PR: a dependency of the same package.json, and another change
    manifest('1.1.0', '^2.0.0')
    commit('chore: update chalk')
    writeFileSync(join(dir, 'later.txt'), 'later\n')
    commit('feat: merged after the release')

    expect(versionCommit({ path: 'plugins/tags' })).to.equal(bump)
  })
})
