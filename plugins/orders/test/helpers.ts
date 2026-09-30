/** Test helpers: the shared ones from @commercelayer/cli-test-utils, plus this plugin's own. */
import { accessToken, ORG } from '@commercelayer/cli-test-utils'

export { api, apiError, list, notFound, ORG, resource, single, useMockedApi } from '@commercelayer/cli-test-utils'

/** Organization and token flags every API command needs */
export const AUTH = ['-o', ORG, '--accessToken', accessToken()]
