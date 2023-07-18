
import { getAccessToken } from '../src/token'



const TOKEN = process.env.CL_CLI_ACCESS_TOKEN || 'eyJhbGciOiJIUzUxMiJ9.eyJvcmdhbml6YXRpb24iOnsiaWQiOiJPWE5NV0Z4UXB5Iiwic2x1ZyI6ImNsaS10ZXN0LW9yZyIsImVudGVycHJpc2UiOmZhbHNlfSwiYXBwbGljYXRpb24iOnsiaWQiOiJvTUtWUmlsZ0pHIiwia2luZCI6InNhbGVzX2NoYW5uZWwiLCJwdWJsaWMiOnRydWV9LCJ0ZXN0Ijp0cnVlLCJleHAiOjE2NjkyMzA2ODgsIm1hcmtldCI6eyJpZCI6WyJBb25FVmhiTnZsIl0sInByaWNlX2xpc3RfaWQiOiJHa2FReUNSZ3JrIiwic3RvY2tfbG9jYXRpb25faWRzIjpbIkpuVlBndXBQRGsiLCJCbmFKUXVPVmRHIl0sImdlb2NvZGVyX2lkIjpudWxsLCJhbGxvd3NfZXh0ZXJuYWxfcHJpY2VzIjpmYWxzZX0sInJhbmQiOjAuNzEyMjYxNjkxMjQ0Mjg1NX0.DIPGpIZko7ezx3jP859RLwwYbsPkCZ9N2G5I2qJPByLeboK3wv9l0CnnuW-vlyaaVwv4TKeYuIM_Ou5wT1WF9w'

const SCOPE = 'market:4426'

async function test() {
	return getAccessToken({
		slug: process.env.CL_CLI_ORGANIZATION || '',
		clientId: process.env.CL_CLI_CLIENT_ID || '',
		clientSecret: process.env.CL_CLI_CLIENT_SECRET || '',
		domain: process.env.CL_CLI_DOMAIN,
		scope: SCOPE,
		email: 'testpwd@cli-test.org',
		password: 'password'
	})
}


void test().then(console.log).catch(console.log)
