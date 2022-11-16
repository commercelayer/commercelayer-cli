import jwt from 'jsonwebtoken'
import config from './config'
import https from 'https'
import { AppAuth } from './application'
import { sleep } from './util'
import { baseURL } from './api'
import { AuthReturnType, clientCredentials, ClientCredentials, getCustomerToken, User } from '@commercelayer/js-auth'
import { CLIError } from '@oclif/core/lib/errors'



export type AccessTokenInfo = {
  organization: {
    id: string;
    slug: string;
  };
  application: {
    id: string;
    kind: 'integration' | 'sales_channel';
    public: boolean;
  };
  test: boolean;
  exp?: number;
  rand?: number;
  owner?: {
    id: string;
    type: 'Customer' | 'User';
  };
  market?: {
    id: string[];
    price_list_id: string;
    stock_location_ids?: string[];
    geocoder_id?: string;
    allows_external_prices: boolean;
  };
}


export type CustomToken = {
  accessToken: string;
  info: AccessTokenInfo;
  expMinutes: number;
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
    rand: Math.random(),
  }

  const algo = config.api.token_encoding_algorithm as jwt.Algorithm

  const accessToken = jwt.sign(payload, sharedSecret, { algorithm: algo, noTimestamp: true })
  const info = jwt.verify(accessToken, sharedSecret, { algorithms: [algo] })


  return {
    accessToken,
    info: info as AccessTokenInfo,
    expMinutes: minutes,
  }

}


const getAccessToken = async (auth: AppAuth): AuthReturnType => {

  const credentials: ClientCredentials = {
    clientId: auth.clientId,
    clientSecret: auth.clientSecret,
    endpoint: baseURL(auth.slug, auth.domain),
    scope: auth.scope || '',
  }

  if (auth.email && auth.password) {
    const user: User = {
      username: auth.email,
      password: auth.password,
    }
    return getCustomerToken(credentials, user)
  }

  return clientCredentials(credentials)

}


const revokeAccessToken = async (app: AppAuth, token: string): Promise<void> => {

  /*
  return axios
    .post(`${app.baseUrl}/oauth/revoke`, {
    grant_type: 'client_credentials',
    client_id: app.clientId,
    client_secret: app.clientSecret,
    token,
    })
  */

  const data = JSON.stringify({
    grant_type: 'client_credentials',
    client_id: app.clientId,
    client_secret: app.clientSecret,
    token,
  })

  const options = {
    hostname: baseURL(app.slug, app.domain).replace('https://', '').replace('http://', ''),
    port: 443,
    path: '/oauth/revoke',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
    },
  }

  try {

    const req = https.request(options/* , res => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', d => {
      process.stdout.write(d)
    })
  } */)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    req.on('error', error => {
      throw new CLIError(error.message || 'Error revoking access token')
    })

    req.write(data)
    req.end()

  } catch (error) {
    if (error instanceof CLIError) throw error
    else throw new CLIError((error as Error).message || 'Error revoking access token')
  }

  await sleep(300)

}


const isAccessTokenExpiring = (tokenData: { created_at: string }, validityMins?: number): boolean => {

  const safetyInterval = 30 // secs
  const maxExpiration = (validityMins || config.api.token_expiration_mins) * 60 // secs


  const createdAt = Number(tokenData.created_at)
  const now = Math.floor(Date.now() / 1000) // secs
  const time = now - createdAt

  return (time >= (maxExpiration - safetyInterval))

}


export { decodeAccessToken, generateAccessToken, getAccessToken, revokeAccessToken, isAccessTokenExpiring }
