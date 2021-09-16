
import fs from 'fs'

const generateImportCustomers = (size: number) => {

	const inputs: Array<string> = [ 'email' ]

	for (let i = 0; i < size; i++) {
		inputs.push(`user${String(i).padStart(6, '0')}@test-import.org`)
	}

	const data = inputs.join('\n')

	fs.writeFileSync('/users/pierlu/Desktop/test_import_customers.csv', data)

}


generateImportCustomers(25683)
