import { AuthReturnType } from '@commercelayer/js-auth'
import { AppAuth, AccessTokenInfo, token, CustomToken, config } from '@commercelayer/cli-core'


export const VALIDITY_MIN = 2
export const VALIDITY_MAX = config.api.token_expiration_mins


const decodeAccessToken = (accessToken: string): AccessTokenInfo => {
  return token.decodeAccessToken(accessToken)
}


const generateAccessToken = (accessToken: string | AccessTokenInfo, sharedSecret: string, minutes: number): CustomToken => {
  const tokenData = (typeof accessToken === 'string') ? decodeAccessToken(accessToken) : accessToken
  return token.generateAccessToken(tokenData, sharedSecret, minutes)
}


const getAccessToken = async (auth: AppAuth): AuthReturnType => {
  return token.getAccessToken(auth)

}


const revokeAccessToken = async (app: AppAuth, accessToken: string) => {
  return token.revokeAccessToken(app, accessToken)

}


export { decodeAccessToken, generateAccessToken, getAccessToken, revokeAccessToken }
