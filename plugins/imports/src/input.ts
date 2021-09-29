
import fs from 'fs'
import * as csv from '@fast-csv/parse'
import chalk from 'chalk'


const generateInputsCSV = async (filePath: string): Promise<Array<any>> => {

	const inputs: Array<any> = []

	return new Promise((resolve, reject) => {
		fs.createReadStream(filePath)
			.pipe(csv.parse({ headers: true, ignoreEmpty: true }))
			.on('error', error => reject(error))
			.on('data', row => inputs.push(row))
			.on('end', (_rowCount: number) => resolve(inputs))
	})

}


const generateInputJSON = async (filePath: string): Promise<Array<any>> => {

	try {
		const data = fs.readFileSync(filePath, { encoding: 'utf-8' })
		const json = JSON.parse(data)
		if (!Array.isArray(json)) throw new Error('The file does not contain an array of inputs')
		return Promise.resolve(json)
	} catch (error) {
		return Promise.reject(error)
	}

}


const generateInputs = async (filePath: string, flags?: any): Promise<Array<any>> => {
	if (!fs.existsSync(filePath)) return Promise.reject(new Error('Unable to find file ' + chalk.italic(filePath)))
	if (flags?.csv) return generateInputsCSV(filePath)
	return generateInputJSON(filePath)
}


export { generateInputs }
