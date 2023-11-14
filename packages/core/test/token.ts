
import { AccessToken, AccessTokenInfo, getAccessToken, isAccessTokenExpiring } from '../src/token'
import dotenv from 'dotenv'

dotenv.config()


const CLIENT_ID = process.env.CL_CLI_CLIENT_ID
const CLIENT_SECRET = process.env.CL_CLI_CLIENT_SECRET
const DOMAIN = process.env.CL_CLI_DOMAIN

const TOKEN = process.env.CL_CLI_ACCESS_TOKEN || 'eyJhbGciOiJIUzUxMiJ9.eyJvcmdhbml6YXRpb24iOnsiaWQiOiJPUkttVkZsd2FYIiwic2x1ZyI6ImJyaW9uaSIsImVudGVycHJpc2UiOnRydWV9LCJhcHBsaWNhdGlvbiI6eyJpZCI6IkxHbWdPaVFnRHAiLCJraW5kIjoiaW50ZWdyYXRpb24iLCJwdWJsaWMiOmZhbHNlfSwidGVzdCI6dHJ1ZSwiZXhwIjoxNjkwNDg0ODAzLCJyYW5kIjowLjc5MTgzODA3ODExNDc5NH0.rq4c-D8cNzr8wbViaSTxmWcIcB6MIpXupo_B6qbRrhu12kjR44IJK-z2Lew8M8g1UmKUdQbqTiSIrk6JyW8o0w'
const SCOPE = 'market:4426'



async function test() {
	
	const accessToken = await getAccessToken({
		clientId: CLIENT_ID || '',
		clientSecret: CLIENT_SECRET,
		domain: DOMAIN,
		api: 'provisioning'
	})

	console.log(accessToken)

	return accessToken

}


void test().catch(console.log)
