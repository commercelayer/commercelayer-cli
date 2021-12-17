import { AuthReturnType, clientCredentials, ClientCredentials, getCustomerToken, User } from '@commercelayer/js-auth'
import jwt, { Algorithm } from 'jsonwebtoken'
import { api, AppAuth, util, AccessTokenInfo, token, config } from '@commercelayer/cli-core'
import https from 'https'



export type CustomToken = {
  accessToken: string;
  info: AccessTokenInfo;
  expMinutes: number;
}



const decodeAccessToken = (accessToken: string): AccessTokenInfo => {
  return token.decodeAccessToken(accessToken)
}


const generateAccessToken = (token: string | AccessTokenInfo, sharedSecret: string, minutes: number): CustomToken => {

  const tokenData = (typeof token === 'string') ? decodeAccessToken(token) : token

  const payload = {
    ...tokenData,
    exp: Math.floor(Date.now() / 1000) + (minutes * 60),
    rand: Math.random(),
  }

  const algo = config.api.token_encoding_algorithm as Algorithm

  const accessToken = jwt.sign(payload, sharedSecret, { algorithm: algo, noTimestamp: true })
  const info = jwt.verify(accessToken, sharedSecret, { algorithms: [ algo ] })


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
		endpoint: api.baseURL(auth.slug, auth.domain),
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
    hostname: api.baseURL(app.slug, app.domain).replace('https://', '').replace('http://', ''),
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

  await util.sleep(300)

}


export { decodeAccessToken, generateAccessToken, getAccessToken, revokeAccessToken }
