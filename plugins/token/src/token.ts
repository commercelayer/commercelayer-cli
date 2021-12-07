import { AuthReturnType, clientCredentials, ClientCredentials, getCustomerToken, User } from '@commercelayer/js-auth'
import jwt from 'jsonwebtoken'
import { AppAuth, baseURL, sleep } from './common'
import https from 'https'


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
  rand: number;
  owner?: {
    id: string;
    type: 'Customer' | string;
  };
  market?: {
    id: string[];
    price_list_id: string;
    stock_location_ids: string[];
    geocode_id?: string;
    allows_external_prices: boolean;
  };
}


export type CustomToken = {
  accessToken: string;
  info: AccessTokenInfo;
  expMinutes: number;
}



const decodeAccessToken = (accessToken: string): AccessTokenInfo => {
  const info = jwt.decode(accessToken)
  if (info === null) throw new Error('Error deconding access token')
  return info as AccessTokenInfo
}


const generateAccessToken = (token: string, sharedSecret: string, minutes: number): CustomToken => {

  const tokenData = decodeAccessToken(token)

  const payload = {
    application: tokenData?.application,
    exp: Math.floor(Date.now() / 1000) + (minutes * 60),
    organization: tokenData?.organization,
    rand: Math.random(),
    test: tokenData?.test,
  }

  const accessToken = jwt.sign(payload, sharedSecret, { algorithm: 'HS512', noTimestamp: true })
  const info = jwt.verify(accessToken, sharedSecret, { algorithms: ['HS512'] })


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


const revokeAccessToken = async (app: AppAuth, token: string) => {

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

  const req = https.request(options/* , res => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', d => {
      process.stdout.write(d)
    })
  } */)

  /*
  req.on('error', error => {
    console.error(error)
  })
  */

  req.write(data)
  req.end()

  await sleep(300)

}


export { decodeAccessToken, generateAccessToken, getAccessToken, revokeAccessToken }
