/** Test helpers: the shared ones from @commercelayer/cli-test-utils, plus this plugin's own. */
import { jwt, PROVISIONING_API, api as scope } from '@commercelayer/cli-test-utils'

export { apiError, list, resource, single, useMockedApi } from '@commercelayer/cli-test-utils'

export const API = PROVISIONING_API
export const api = () => scope(PROVISIONING_API)

/** A user token for the Provisioning API (no organization) */
export const TOKEN = jwt({ user: { id: 'UsrId' }, application: { kind: 'user', id: 'AppId' }, scope: 'provisioning-api' })
/** The token flag every API command needs */
export const AUTH = ['--accessToken', TOKEN]
