import { expect } from 'chai'
import { config, ExitError, ux, write } from '../../src'
import { answer, capture } from '../helpers'

describe('ux', () => {
  it('logs to stdout and stderr', async () => {
    const out = await capture(() => {
      ux.log('hello %s', 'world')
      ux.log()
      ux.info('info')
      ux.logToStderr('oops %s', '!')
    })
    expect(out.stdout).to.equal('hello world\n\ninfo\n')
    expect(out.stderr).to.equal('oops !\n')
  })

  it('writes raw text', async () => {
    const out = await capture(() => {
      write.stdout('a')
      write.stderr('b')
    })
    expect(out).to.deep.equal({ stdout: 'a', stderr: 'b' })
  })

  describe('output levels', () => {
    let level: typeof config.outputLevel
    beforeEach(() => {
      level = config.outputLevel
    })
    afterEach(() => {
      config.outputLevel = level
    })

    it('hides debug and trace messages by default', async () => {
      const out = await capture(() => {
        ux.debug('debug')
        ux.trace('trace')
      })
      expect(out.stdout).to.equal('')
    })

    it('shows debug messages at debug level', async () => {
      config.outputLevel = 'debug'
      const out = await capture(() => {
        ux.debug('debug %s', 'on')
        ux.trace('trace')
      })
      expect(out.stdout).to.equal('debug on\n\n')
    })

    it('shows everything at trace level', async () => {
      config.outputLevel = 'trace'
      const out = await capture(() => {
        ux.debug('debug')
        ux.trace('trace')
      })
      expect(out.stdout).to.equal('debug\n\ntrace\n\n')
    })
  })

  it('prints styled headers, JSON and objects', async () => {
    const out = await capture(() => {
      ux.styledHeader('Title')
      ux.styledJSON({ a: 1 })
      ux.styledObject({ k: 'v' })
    })
    expect(out.stdout).to.equal('=== Title\n\n{\n  "a": 1\n}\nk: v\n')
  })

  it('prints the URL where hyperlinks are not supported', async () => {
    expect(ux.hyperlink('docs', 'https://docs.commercelayer.io')).to.equal('https://docs.commercelayer.io')
    const out = await capture(() => ux.url('docs', 'https://docs.commercelayer.io'))
    expect(out.stdout).to.equal('https://docs.commercelayer.io\n')
  })

  it('builds exit errors', () => {
    const exit = new ExitError(2)
    expect(exit.message).to.equal('EEXIT: 2')
    expect(exit.ux.exit).to.equal(2)
    expect(new ExitError(1, new Error('boom')).message).to.equal('boom')
  })

  it('waits', async () => {
    const start = Date.now()
    await ux.wait(20)
    expect(Date.now() - start).to.be.at.least(15)
  })

  it('uses the oclif action', async () => {
    const { ux: oclifUx } = await import('@oclif/core')
    expect(ux.action).to.equal(oclifUx.action)
    let running = false
    const out = await capture(() => {
      ux.action.start('Working')
      running = ux.action.running
      ux.action.stop('ok')
    })
    expect(running).to.equal(true)
    expect(ux.action.running).to.equal(false)
    expect(out.stderr).to.contain('ok')
  })

  describe('prompts', () => {
    let restore: () => void
    afterEach(() => restore?.())

    it('reads the answer', async () => {
      restore = answer('jane')
      let value = ''
      const out = await capture(async () => {
        value = await ux.prompt('Name')
      })
      expect(value).to.equal('jane')
      expect(out.stderr).to.equal('Name: ')
    })

    it('uses the default for an empty answer', async () => {
      restore = answer('')
      let value = ''
      const out = await capture(async () => {
        value = await ux.prompt('Name', { default: 'joe' })
      })
      expect(value).to.equal('joe')
      expect(out.stderr).to.equal('Name [joe]: ')
    })

    it('asks again for a required answer', async () => {
      restore = answer('', 'jane')
      let value = ''
      await capture(async () => {
        value = await ux.prompt('Name')
      })
      expect(value).to.equal('jane')
    })

    it('accepts an empty answer when not required', async () => {
      restore = answer('')
      let value = 'x'
      await capture(async () => {
        value = await ux.prompt('Name', { required: false })
      })
      expect(value).to.equal('')
    })

    it('confirms with yes and no, asking again otherwise', async () => {
      restore = answer('maybe', 'Y')
      let yes = false
      await capture(async () => {
        yes = await ux.confirm('Sure?')
      })
      expect(yes).to.equal(true)
      restore()
      restore = answer('no')
      let no = true
      await capture(async () => {
        no = await ux.confirm('Sure?')
      })
      expect(no).to.equal(false)
    })

    it('times out', async () => {
      restore = answer()
      let error: Error | undefined
      await capture(async () => {
        try {
          await ux.prompt('Name', { timeout: 10 })
        } catch (e) {
          error = e as Error
        }
      })
      expect(error?.message).to.equal('Prompt timeout')
    })

    it('rejects an unknown prompt type', async () => {
      let error: Error | undefined
      try {
        await ux.prompt('Name', { type: 'other' as never })
      } catch (e) {
        error = e as Error
      }
      expect(error?.message).to.equal('unexpected type other')
    })
  })
})
