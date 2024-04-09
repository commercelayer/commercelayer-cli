import clConfig from './config'


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const downloadSchema = async (version?: string): Promise<any> => {

	const domain = clConfig.api.default_app_domain

	const baseUrl = `https://data.${domain}/schemas/`
	const schemaVersion = version ? ('_' + version.replace(/\./g, '-')) : ''
	const fileName = `openapi${schemaVersion}.json`

	const schemaUrl = baseUrl + fileName

	const schemaFile = await fetch(schemaUrl)
	const schemaData = await schemaFile.json()

	return schemaData

}


export { downloadSchema as download }
