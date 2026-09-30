/** Test helpers: the shared ones from @commercelayer/cli-test-utils, plus this plugin's own. */
import { accessToken, ORG } from '@commercelayer/cli-test-utils'

export { api, apiError, list, ORG, resource, single, useMockedApi } from '@commercelayer/cli-test-utils'

/** A sales channel access token (the only kind these commands accept) */
export const token = (kind = 'sales_channel', org = ORG) => accessToken({ kind, org, scope: 'market:code:EU' })
export const TOKEN = token()
/** Organization and token flags every API command needs */
export const AUTH = ['-o', ORG, '-a', TOKEN]
