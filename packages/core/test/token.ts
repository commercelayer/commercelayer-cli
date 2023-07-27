
import { AccessToken, AccessTokenInfo, isAccessTokenExpiring } from '../src/token'



const TOKEN = process.env.CL_CLI_ACCESS_TOKEN || 'eyJhbGciOiJIUzUxMiJ9.eyJvcmdhbml6YXRpb24iOnsiaWQiOiJPUkttVkZsd2FYIiwic2x1ZyI6ImJyaW9uaSIsImVudGVycHJpc2UiOnRydWV9LCJhcHBsaWNhdGlvbiI6eyJpZCI6IkxHbWdPaVFnRHAiLCJraW5kIjoiaW50ZWdyYXRpb24iLCJwdWJsaWMiOmZhbHNlfSwidGVzdCI6dHJ1ZSwiZXhwIjoxNjkwNDg0ODAzLCJyYW5kIjowLjc5MTgzODA3ODExNDc5NH0.rq4c-D8cNzr8wbViaSTxmWcIcB6MIpXupo_B6qbRrhu12kjR44IJK-z2Lew8M8g1UmKUdQbqTiSIrk6JyW8o0w'

const SCOPE = 'market:4426'

const tokenData: AccessToken = JSON.parse(
	`{
		"accessToken": "eyJhbGciOiJIUzUxMiJ9.eyJvcmdhbml6YXRpb24iOnsiaWQiOiJPWE5NV0Z4UXB5Iiwic2x1ZyI6ImNsaS10ZXN0LW9yZyIsImVudGVycHJpc2UiOmZhbHNlfSwiYXBwbGljYXRpb24iOnsiaWQiOiJkTW5XbWlSZ0pwIiwia2luZCI6ImludGVncmF0aW9uIiwicHVibGljIjpmYWxzZX0sInRlc3QiOnRydWUsImV4cCI6MTY5MDQ2ODMwMCwicmFuZCI6MC45NDkxMDU1MjIyMjc1ODc0fQ.Wlv5kQ9afr2P3SZk74dGcvKVWL9zaPp8n81eaTOBZtQ-Dz8Md8gPOyUMDq9SiIMqAg1iCcqjF69nZ6BqQv0OFA",
		"tokenType": "Bearer",
		"expiresIn": 7200,
		"scope": "market:all",
		"createdAt": 1690461100,
		"expires": "2023-07-27T14:31:40.306Z"
	}`
)

async function test() {

	console.log(tokenData)
	return isAccessTokenExpiring(tokenData)
}


void test().then(console.log).catch(console.log)
