import axios from 'axios'


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const downloadSchema = async (version?: string): Promise<any> => {

	const baseUrl = 'https://data.commercelayer.app/schemas/'
	const schemaVersion = version ? ('_' + version.replace(/\./g, '-')) : ''
	const fileName = `openapi${schemaVersion}.json`

	const schemaUrl = baseUrl + fileName

	const schemaFile = await axios.get(schemaUrl)
	const schemaData = schemaFile.data

	return schemaData

}


export { downloadSchema as download }
