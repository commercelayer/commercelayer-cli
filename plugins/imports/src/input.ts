
import { existsSync, readFileSync } from 'node:fs'
import { clColor } from '@commercelayer/cli-core'



const generateInputsCSV = async (filePath: string): Promise<any[]> => {

  try {
    const data = readFileSync(filePath, { encoding: 'utf-8' })
    const csv = data.split('\n')
    return Promise.resolve(csv)
  } catch (error) {
    return Promise.reject(error)
  }

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


const generateInputs = async (filePath: string, fileFormat: 'csv' | 'json'): Promise<any[]> => {

  if (!existsSync(filePath)) return Promise.reject(new Error('Unable to find file ' + clColor.style.path(filePath)))

  switch (fileFormat) {
    case 'csv':  return generateInputsCSV(filePath)
    case 'json':
    default:  return generateInputJSON(filePath)
  }

}



export { generateInputs }
