
import { createReadStream, readFileSync, existsSync } from 'node:fs'
import * as csv from '@fast-csv/parse'
import { clColor } from '@commercelayer/cli-core'



const generateInputsCSV = async (filePath: string, delimiter?: string): Promise<any[]> => {

  const inputs: any[] = []

  const parseOptions: csv.ParserOptionsArgs = { headers: true, ignoreEmpty: true}
  if (delimiter) parseOptions.delimiter = delimiter

  return new Promise((resolve, reject) => {
    createReadStream(filePath)
      .pipe(csv.parse(parseOptions))
      .on('error', error => { reject(error) })
      .on('data', row => inputs.push(row))
      .on('end', (_rowCount: number) => { resolve(inputs) })
  })

}


const generateInputJSON = async (filePath: string): Promise<any[]> => {

  try {
    const data = readFileSync(filePath, { encoding: 'utf-8' })
    const json = JSON.parse(data)
    if (!Array.isArray(json)) throw new Error('The file does not contain an array of inputs')
    return Promise.resolve(json)
  } catch (error) {
    return Promise.reject(error)
  }

}


const generateInputs = async (filePath: string, flags?: any): Promise<any[]> => {

  if (!existsSync(filePath)) return Promise.reject(new Error('Unable to find file ' + clColor.style.path(filePath)))

  if (flags?.csv) {
    let delimiter: string = flags.delimiter || ','
    if (delimiter && (delimiter === 'TAB')) delimiter = '\t'
    return generateInputsCSV(filePath, delimiter)
  }

  return generateInputJSON(filePath)

}



export { generateInputs }
