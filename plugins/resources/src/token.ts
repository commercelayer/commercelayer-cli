import jwt from 'jsonwebtoken'

const decodeAccessToken = (accessToken: any): any => {
	const info = jwt.decode(accessToken)
	return info
}


export { decodeAccessToken }
