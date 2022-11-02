import { AuthReturnType } from '@commercelayer/js-auth'
import { AppAuth, AccessTokenInfo, CustomToken, clToken, clConfig } from '@commercelayer/cli-core'
import commercelayer from '@commercelayer/sdk'


export const VALIDITY_MIN = 2
export const VALIDITY_MAX = clConfig.api.token_expiration_mins


const decodeAccessToken = (accessToken: string): AccessTokenInfo => {
  return clToken.decodeAccessToken(accessToken)
}


const generateAccessToken = (accessToken: string | AccessTokenInfo, sharedSecret: string, minutes: number): CustomToken => {
  const tokenData = (typeof accessToken === 'string') ? decodeAccessToken(accessToken) : accessToken
  return clToken.generateAccessToken(tokenData, sharedSecret, minutes)
}


const getAccessToken = async (auth: AppAuth): AuthReturnType => {
  return await clToken.getAccessToken(auth)

}


const revokeAccessToken = async (app: AppAuth, accessToken: string): Promise<void> => {
  return await clToken.revokeAccessToken(app, accessToken)
}


const testAccessToken = async (token: CustomToken | string, flags: any): Promise<boolean> => {

  const organization = flags.organization
  const domain = flags.domain
  const accessToken = (typeof token === 'string') ? token : token.accessToken

  const cl = commercelayer({
    organization,
    domain,
    accessToken,
  })

  return await cl.organization.retrieve()
    .then(org => org.slug === organization)
    .catch(() => false)

}


export { decodeAccessToken, generateAccessToken, getAccessToken, revokeAccessToken, testAccessToken }
