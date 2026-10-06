import { accessToken } from '@commercelayer/cli-test-utils'
import { expect } from 'chai'
import { CLCommand } from '../../src/base'

class TestCommand extends CLCommand {
  static applicationKinds = ['integration']
  async run(): Promise<void> {}
}

const config = { name: '@commercelayer/cli-plugin-test', version: '1.2.3' } as any
const command = () => new TestCommand([], config) as any

/** The message of the error a call stops with */
const stopsWith = (fn: () => unknown): string => {
  try {
    fn()
  } catch (error: any) {
    return error.message
  }
  throw new Error('expected an error')
}

const apiError = (status: number, errors = [{ title: 'Unauthorized', detail: 'Invalid token' }]) => ({ status, errors, first: () => errors[0] })

describe('CLCommand', () => {
  it('has the flags the CLI fills in from the current application', () => {
    const { organization, domain, accessToken, 'api-version': apiVersion } = CLCommand.baseFlags
    expect(organization).to.include({ char: 'o', required: true, hidden: true, env: 'CL_CLI_ORGANIZATION' })
    expect(domain).to.include({ char: 'd', required: false, hidden: true, env: 'CL_CLI_DOMAIN' })
    expect(accessToken).to.include({ required: true, hidden: true, env: 'CL_CLI_ACCESS_TOKEN' })
    expect(apiVersion).to.include({ required: false, hidden: true, env: 'CL_CLI_API_VERSION' })
  })

  it('builds the client options from the flags, with the CLI user agent and the default API version', () => {
    const env = process.env.CL_CLI_API_VERSION
    delete process.env.CL_CLI_API_VERSION
    try {
      const options = command().clientOptions({ organization: 'org', domain: 'commercelayer.co', accessToken: 'token' })
      expect(options).to.deep.equal({ apiVersion: '2026-05', organization: 'org', domain: 'commercelayer.co', accessToken: 'token', userAgent: 'CLI-test/1.2.3' })
      expect(command().clientOptions({ organization: 'org', accessToken: 'token', 'api-version': '2017-08' }).apiVersion).to.equal('2017-08')
    } finally {
      if (env !== undefined) process.env.CL_CLI_API_VERSION = env
    }
  })

  describe('checkApplication', () => {
    it('accepts a token of the given kinds', () => {
      expect(command().checkApplication(accessToken({ kind: 'integration' }), ['integration'])).to.equal(true)
    })
    it('refuses a token of another kind', () => {
      expect(stopsWith(() => command().checkApplication(accessToken({ kind: 'sales_channel' }), ['integration']))).to.match(
        /Invalid application kind: .*sales_channel.*integration/,
      )
    })
    it('refuses an invalid token', () => {
      expect(stopsWith(() => command().checkApplication('not-a-token', ['integration']))).to.equal('Invalid access token provided')
    })
  })

  describe('init', () => {
    it('checks the application kind of the access token passed by the CLI', async () => {
      const cmd = new TestCommand(['--accessToken=' + accessToken({ kind: 'sales_channel' }), '--blind'], config) as any
      const message = await cmd.init().then(
        () => '',
        (error: Error) => error.message,
      )
      expect(message).to.match(/Invalid application kind/)
    })
  })

  describe('handleApiError', () => {
    it('suggests to log in on an unauthorized request', () => {
      try {
        command().handleApiError(apiError(401), { resource: 'tag' })
      } catch (error: any) {
        expect(error.message).to.contain('Unauthorized:  Invalid token')
        expect(error.suggestions).to.deep.equal(["Execute login to get access to the organization's tags"])
        return
      }
      throw new Error('expected an error')
    })
    it('names a missing resource', () => {
      expect(stopsWith(() => command().handleApiError(apiError(404), { resource: 'tag', id: 'abc', idLabel: 'ID or name' }))).to.match(
        /^Unable to find tag with ID or name .*abc/,
      )
      expect(stopsWith(() => command().handleApiError(apiError(404), { resource: 'webhook' }))).to.equal('Unable to find webhook')
    })
    it('prints any other error as the API returned it', () => {
      const errors = [{ title: 'Unprocessable', detail: 'name is invalid' }]
      expect(stopsWith(() => command().handleApiError(apiError(422, errors)))).to.contain('name is invalid')
      expect(stopsWith(() => command().handleApiError(apiError(404, errors)))).to.contain('name is invalid')
    })
  })
})
