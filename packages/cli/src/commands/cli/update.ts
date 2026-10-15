/* eslint-disable @typescript-eslint/no-misused-promises */

import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { clColor } from '@commercelayer/cli-core'
import { Command, ux as cliux, Flags } from '@oclif/core'
import { unsupportedNode } from '../../engines'

// import { detect as detectPackageManager } from 'detect-package-manager'


const CLI_PACKAGE = '@commercelayer/cli'

type Release = { name?: string; version?: string; engines?: { node?: string } }


/**
 * The version an update installs: by default the latest of the current
 * major, a new major only when asked for (--latest, or --version)
 */
const updateTarget = (current: string, flags: { version?: string; latest?: boolean }): string =>
  flags.version ?? (flags.latest ? 'latest' : `^${current.split('.')[0]}`)


export default class CliUpdate extends Command {

  static description = 'Update Commerce Layer CLI'

  static aliases = ['upgrade', 'latest']

  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --latest',
    '<%= config.bin %> <%= command.id %> --version=<version-or-tag>',
  ]

  static flags = {
    version: Flags.string({
      char: 'v',
      description: 'update CLI to a specific version or tag',
      required: false,
      exclusive: ['latest'],
    }),
    latest: Flags.boolean({
      description: 'update CLI to its latest version, a new major included',
      exclusive: ['version'],
    }),
  }


  public async run(): Promise<any> {

    const { flags } = await this.parse(CliUpdate)

    const current = this.config.version
    const target = updateTarget(current, flags)

    // A release that doesn't run on this Node.js isn't installed
    const release = await this.fetchRelease(target)
    const nodeRange = release && unsupportedNode(release, process.versions.node)
    if (nodeRange) this.error(`Commerce Layer CLI ${release.version} requires Node.js ${nodeRange} (current: ${process.versions.node}): update Node.js first`)

    this.log()
    cliux.action.start('Updating Commerce Layer CLI')

    const cp = exec(`npm install --location=global "${CLI_PACKAGE}@${target}"`, async (error, stdout, stderr) => {

      const errorMessage = this.getErrorMessage(error, stdout, stderr)

      if (errorMessage) {
        cliux.action.stop('failed')
        this.log(errorMessage)
        this.error('CLI update failed.')
      } else {
        cliux.action.stop()
        await this.showUpdate(current, Boolean(flags.version || flags.latest))
      }

    })

    cp.on('exit', async (code, signal) => {
      if (code || signal) {
        this.log(clColor.msg.error('Unexpected error occurred'))
        this.log()
        this.log(`Code: ${code}`)
        this.log(`Signal: ${signal}`)
        this.log()
        process.exit()
      }
    })

  }


  private getErrorMessage(error: Error | null, _stdout: string, stderr: string): string {
    let errorMessage = ''
    if (error) errorMessage = error.message
    if (stderr && !['Reshimming asdf nodejs', 'WARN', 'warn', 'npm'].some(str => stderr.includes(str))) errorMessage = String(stderr)
    return errorMessage
  }


  /** The npm manifest of a version or tag (none for a range, or when npm can't be reached) */
  private async fetchRelease(versionOrTag: string): Promise<Release | undefined> {
    if (/^[\^~<>=]/.test(versionOrTag)) {
      // A range: its latest version, from the list of versions
      const latest = await this.fetchRelease('latest')
      return latest?.version?.split('.')[0] === versionOrTag.replace(/^\^/, '') ? latest : undefined
    }
    return fetch(`https://registry.npmjs.org/${CLI_PACKAGE}/${encodeURIComponent(versionOrTag)}`)
      .then(async response => (response.ok ? (await response.json()) as Release : undefined))
      .catch(() => undefined)
  }


  /** The version npm installed: this process still runs the previous one, so config.version is no use */
  private async installedVersion(): Promise<string | undefined> {
    try {
      const { stdout } = await promisify(exec)(`npm ls --location=global ${CLI_PACKAGE} --depth=0 --json`)
      return JSON.parse(stdout).dependencies?.[CLI_PACKAGE]?.version
    } catch {
      return undefined
    }
  }


  private async showUpdate(previous: string, explicit: boolean): Promise<void> {

    const installed = await this.installedVersion()

    this.log()
    if (!installed) this.log(`Commerce Layer CLI updated: run ${clColor.cyanBright(`${this.config.bin} version`)} to see its version`)
    else if (installed === previous) this.log(`Commerce Layer CLI is up to date: ${clColor.cyanBright(installed)}`)
    else this.log(`Commerce Layer CLI updated: ${clColor.dim(previous)} -> ${clColor.green(installed)}`)

    // A new major is never installed implicitly: say there is one
    if (!explicit) {
      const latest = await this.fetchRelease('latest')
      const major = Number((installed ?? previous).split('.')[0])
      if (latest?.version && (Number(latest.version.split('.')[0]) > major)) {
        const nodeRange = unsupportedNode(latest, process.versions.node)
        this.log()
        this.log(`A new major of Commerce Layer CLI is available: ${clColor.green(latest.version)}`)
        if (nodeRange) this.log(`It requires Node.js ${nodeRange} (current: ${process.versions.node})`)
        else this.log(`Run ${clColor.cyanBright(`${this.config.bin} cli:update --latest`)} to install it`)
      }
    }

    this.log()

  }

}


export { updateTarget }
