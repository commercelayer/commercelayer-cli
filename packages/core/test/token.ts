
import { AppAuth } from '../src/application'
import { revokeAccessToken } from '../src/token'


const TOKEN = 'eyJhbGciOiJIUzUxMiJ9.eyJvcmdhbml6YXRpb24iOnsiaWQiOiJPWE5NV0Z4UXB5Iiwic2x1ZyI6ImNsaS10ZXN0LW9yZyIsImVudGVycHJpc2UiOmZhbHNlfSwiYXBwbGljYXRpb24iOnsiaWQiOiJvTUtWUmlsZ0pHIiwia2luZCI6InNhbGVzX2NoYW5uZWwiLCJwdWJsaWMiOnRydWV9LCJ0ZXN0Ijp0cnVlLCJleHAiOjE2NjkyMzA2ODgsIm1hcmtldCI6eyJpZCI6WyJBb25FVmhiTnZsIl0sInByaWNlX2xpc3RfaWQiOiJHa2FReUNSZ3JrIiwic3RvY2tfbG9jYXRpb25faWRzIjpbIkpuVlBndXBQRGsiLCJCbmFKUXVPVmRHIl0sImdlb2NvZGVyX2lkIjpudWxsLCJhbGxvd3NfZXh0ZXJuYWxfcHJpY2VzIjpmYWxzZX0sInJhbmQiOjAuNzEyMjYxNjkxMjQ0Mjg1NX0.DIPGpIZko7ezx3jP859RLwwYbsPkCZ9N2G5I2qJPByLeboK3wv9l0CnnuW-vlyaaVwv4TKeYuIM_Ou5wT1WF9w'

async function revoke() {
	return revokeAccessToken({
		slug: 'cli-test-org',
		clientId: '3rQjOFGWhEsD899jCfqqmOCUvwDODD-cHdwOmhsqAgI',
		scope: 'market:4426'
	}, TOKEN, console)
}


void revoke()