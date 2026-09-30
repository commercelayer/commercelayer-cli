import { writeFileSync } from 'fs'



const generateImportCustomers = (size: number, format: string) => {

  const reference = String(Date.now())

	const inputs: Array<string> = []

	for (let i = 0; i < size; i++) {
		inputs.push(`user${String(i + 1).padStart(6, '0')}@test-import.org`)
	}

	let data = ''

	if (format === 'csv') {
		const csvInputs = [ 'email,reference', ...inputs.map(i => `${i},${reference}`) ]
		data = csvInputs.join('\n')
	} else
	if (format === 'json') {
		const jsonInputs = inputs.map(i => {
			return { email: i, reference }
		})
		data = JSON.stringify(jsonInputs, undefined, 2)
	}

	const filePath = '/users/pierlu/Desktop/test_import_customers.' + format
	writeFileSync(filePath, data)

	// eslint-disable-next-line no-console
	console.log(`Saved ${size} customer inputs to file ${filePath}`)

}


generateImportCustomers(12000, 'csv')
