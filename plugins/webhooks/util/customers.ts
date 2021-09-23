
import fs from 'fs'

const generateImportCustomers = (size: number, format: string) => {

	const inputs: Array<string> = []

	for (let i = 0; i < size; i++) {
		inputs.push(`user${String(i + 1).padStart(6, '0')}@test-import.org`)
	}

	let data = ''

	if (format === 'csv') {
		const csvInputs = [ 'email', ...inputs ]
		data = csvInputs.join('\n')
	} else
	if (format === 'json') {
		const jsonInputs = inputs.map(i => {
			return { email: i }
		})
		data = JSON.stringify(jsonInputs)
	}

	const filePath = '/users/pierlu/Desktop/test_import_customers.' + format
	fs.writeFileSync(filePath, data)

	// eslint-disable-next-line no-console
	console.log(`Saved ${size} customer inputs to file ${filePath}`)

}


generateImportCustomers(10000, 'json')
