import axios from 'axios'
import clConfig from './config'


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const downloadSchema = async (version?: string): Promise<any> => {

	const domain = clConfig.api.default_app_domain

	const baseUrl = `https://data.${domain}/schemas/`
	const schemaVersion = version ? ('_' + version.replace(/\./g, '-')) : ''
	const fileName = `openapi${schemaVersion}.json`

	const schemaUrl = baseUrl + fileName

	const schemaFile = await axios.get(schemaUrl)
	const schemaData = schemaFile.data

	return schemaData

}


export { downloadSchema as download }
