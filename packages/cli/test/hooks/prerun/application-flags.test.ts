import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect } from 'chai'
import hook from '../../../src/hooks/prerun/login'

/**
 * The application settings saved at login reach the commands as flags: the
 * domain and the Core API version are added to the command line, unless the
 * command has no such flag. Runs on a temporary config folder, with the
 * application passed by --appkey: the saved current application is not used.
 */
describe('prerun hook: saved application flags', () => {
  let configDir: string
  const key = 'testAppKey'

  const save = (app: Record<string, unknown>) => {
    const apps = join(configDir, 'applications')
    mkdirSync(apps, { recursive: true })
    writeFileSync(join(apps, `${key}.config.json`), JSON.stringify({ key, mode: 'test', kind: 'integration', slug: 'cli-test-org', ...app }))
    writeFileSync(join(apps, `${key}.token.json`), JSON.stringify({ accessToken: 'token', expires: new Date(Date.now() + 3_600_000).toISOString() }))
  }

  const run = async (flags: string[]): Promise<string[]> => {
    const config = { configDir } as any
    const Command = { id: 'resources:list', flags: Object.fromEntries(flags.map((f) => [f, {}])), baseFlags: {} } as any
    const argv = ['skus', `--appkey=${key}`]
    await hook.call({ config, error: (msg: string) => { throw new Error(msg) }, log: () => {} } as any, { Command, argv, config } as any)
    return argv
  }

  beforeEach(() => {
    configDir = mkdtempSync(join(tmpdir(), 'cl-cli-prerun-'))
  })
  afterEach(() => rmSync(configDir, { recursive: true, force: true }))

  it('adds the saved domain and API version', async () => {
    save({ domain: 'commercelayer.co', apiVersion: '2026-05' })
    const argv = await run(['organization', 'domain', 'api-version', 'accessToken'])
    expect(argv).to.include('--organization=cli-test-org')
    expect(argv).to.include('--domain=commercelayer.co')
    expect(argv).to.include('--api-version=2026-05')
    expect(argv).to.include('--accessToken=token')
  })

  it('adds no API version when none is saved, so the default or CL_CLI_API_VERSION apply', async () => {
    save({})
    const argv = await run(['organization', 'domain', 'api-version', 'accessToken'])
    expect(argv.some((a) => a.startsWith('--api-version'))).to.equal(false)
    expect(argv.some((a) => a.startsWith('--domain'))).to.equal(false)
  })

  it('adds no API version to a command without the flag', async () => {
    save({ apiVersion: '2026-05' })
    const argv = await run(['organization', 'accessToken'])
    expect(argv.some((a) => a.startsWith('--api-version'))).to.equal(false)
  })
})
