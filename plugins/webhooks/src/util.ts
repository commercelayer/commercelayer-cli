
import fs from 'fs'

const generateImportCustomers = (size: number) => {

	const inputs: Array<string> = [ 'email' ]

	for (let i = 0; i < size; i++) {
		inputs.push(`user${String(i + 1).padStart(6, '0')}@test-import.org`)
	}

	const data = inputs.join('\n')

	const filePath = '/users/pierlu/Desktop/test_import_customers.csv'

	fs.writeFileSync('/users/pierlu/Desktop/test_import_customers.csv', data)

	// eslint-disable-next-line no-console
	console.log(`Saved ${size} customer inputs to file ${filePath}`)

}


generateImportCustomers(13648)
