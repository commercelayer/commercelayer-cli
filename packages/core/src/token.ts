import jwt from 'jsonwebtoken'
import config from './config'
import { type AppAuth } from './application'
import { type ApiMode } from './api'
import { authenticate, revoke, type AuthenticateOptions } from '@commercelayer/js-auth'
import type { KeyValString } from './command'


export type AuthScope = string | string[]


export type AccessToken = {
  accessToken: string;
  tokenType: 'bearer' | 'Bearer'
  expiresIn: number
  expires: Date
  scope: AuthScope
  createdAt: number
  error?: string
  errorDescription?: string
}


export type ApplicationKind = typeof config.application.kinds[number]
export type OwnerType = typeof config.api.token_owner_types[number]


export type AccessTokenInfo = {
  organization?: {
    id: string
    slug: string
  }
  application: {
    id: string
    kind: ApplicationKind
    public: boolean
  }
  test: boolean
  exp?: number
  rand?: number
  owner?: {
    id: string
    type: OwnerType
  };
  market?: {
    id: string[]
    price_list_id: string
    stock_location_ids?: string[]
    geocoder_id?: string
    allows_external_prices: boolean
  }
  scope?: AuthScope,
  user?: { id: string }
}


export type CustomToken = {
  accessToken: string
  info: AccessTokenInfo
  expMinutes: number
}



/** Decode a Commerce Layer access token */
const decodeAccessToken = (accessToken: string): AccessTokenInfo => {
  const info = jwt.decode(accessToken)
  if (info === null) throw new Error('Error decoding access token')
  return info as AccessTokenInfo
}


/** generate a custom access token */
const generateAccessToken = (token: AccessTokenInfo, sharedSecret: string, minutes: number): CustomToken => {

  const tokenData = token

  const payload = {
    ...tokenData,
    exp: Math.floor(Date.now() / 1000) + (minutes * 60),
    rand: Math.random()
  }

  const algo = config.api.token_encoding_algorithm as jwt.Algorithm

  const accessToken = jwt.sign(payload, sharedSecret, { algorithm: algo, noTimestamp: true })
  const info = jwt.verify(accessToken, sharedSecret, { algorithms: [algo] })


  return {
    accessToken,
    info: info as AccessTokenInfo,
    expMinutes: minutes
  }

}


const getAccessToken = async (auth: AppAuth): Promise<AccessToken> => {

  let accessToken

  const scope = auth.scope ? (Array.isArray(auth.scope) ? auth.scope.map(s => s.trim()).join(',') : auth.scope) : ''

  const credentials: any = {
    clientId: auth.clientId,
    clientSecret: auth.clientSecret,
    slug: auth.slug,
    domain: auth.domain,
    scope
  }

  if (auth.email && auth.password) {
    credentials.username = auth.email
    credentials.password = auth.password
    accessToken = await authenticate('password', credentials as AuthenticateOptions<'password'>)
  }
  else
  if (auth.assertion) {
    credentials.assertion = auth.assertion
    accessToken = await authenticate('urn:ietf:params:oauth:grant-type:jwt-bearer', credentials as AuthenticateOptions<'urn:ietf:params:oauth:grant-type:jwt-bearer'>)
  }
  else accessToken = await authenticate('client_credentials', credentials as AuthenticateOptions<'client_credentials'>)



  if (!accessToken) throw new Error('Unable to get access token')
  else
  if (accessToken.errors) throw new Error(`Unable to get access token: ${accessToken.errors[0].detail}`)

  return accessToken

}


const revokeAccessToken = async (app: AppAuth, token: string): Promise<void> => {
  const result = await revoke({ ...app, token })
  if (result.errors) throw new Error(result.errors[0].detail)
}



const isAccessTokenExpiring = (tokenData: AccessToken): boolean => {

  const safetyInterval = 30 // secs

  const now = Math.floor(Date.now() / 1000) // secs
  const expiration = Math.floor(new Date(tokenData.expires).getTime() / 1000) // secs

  return (now >= (expiration - safetyInterval))

}


const getTokenEnvironment = (token: string | AccessTokenInfo): ApiMode => {
  const decodedToken = ((typeof token === 'string') ? decodeAccessToken(token) : token)
  return decodedToken.test ? 'test' : 'live'
}


export { decodeAccessToken, generateAccessToken, getAccessToken, revokeAccessToken, isAccessTokenExpiring, getTokenEnvironment }


export const buildAssertionPayload = (ownerType: OwnerType, ownerId: string, customClaim?: KeyValString): any => {

  const clClaimKey = 'https://commercelayer.io/claims'

  const assertion: Record<string, any> = {
    [clClaimKey]: {
      owner: {
        type: ownerType,
        id: ownerId
      }
    }
  }


  // Build custom claim
  if (customClaim && (Object.keys(customClaim).length > 0)) {

    const cClaim: Record<string, any> = {}

    Object.entries(customClaim).forEach(([key, value]) => {

      const keys = key.split('.')
      const lastKey = keys[keys.length - 1]

      let cur: Record<string, any> = cClaim
      keys.forEach(k => {
        if (k === lastKey) cur[k] = value
        else cur = cur[k] || (cur[k] = {})
      })

    })

    assertion[clClaimKey].custom_claim = cClaim

  }


  return assertion

}
