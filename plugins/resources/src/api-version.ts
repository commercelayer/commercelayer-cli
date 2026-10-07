/**
 * The Core API version of the requests (SDK 8 puts it in the path,
 * /api/2026-05/…): the --api-version flag, then CL_CLI_API_VERSION, then
 * the default. Local to this plugin on the oclif 3 line, where cli-core has
 * no API version yet; from the oclif 5 major it comes from cli-core
 * (clApi.apiVersion, clCommand.apiVersionFlag).
 */
import type { ApiVersion } from '@commercelayer/sdk'
import { Flags } from '@oclif/core'

export const DEFAULT_API_VERSION: ApiVersion = '2026-05'

export const apiVersion = (flags?: Record<string, any>): ApiVersion =>
  (flags?.['api-version'] || process.env.CL_CLI_API_VERSION || DEFAULT_API_VERSION) as ApiVersion

export const apiVersionFlag = () =>
  Flags.string({
    description: `the Core API version of the requests (default: ${DEFAULT_API_VERSION})`,
    required: false,
    hidden: true,
    env: 'CL_CLI_API_VERSION',
  })
