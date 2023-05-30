import { clColor } from '@commercelayer/cli-core'
import axios from 'axios'
import { readFileSync } from 'fs'



const rawRequest = async (
  config: {
    baseUrl: string;
    resource: string;
    accessToken: string;
    operation: Operation;
  },
  data: any,
  id?: string,
): Promise<any> => {

  return await axios.request({
    method: config.operation,
    baseURL: config.baseUrl,
    url: `/api/${config.resource}` + (id ? `/${id}` : ''),
    headers: {
      'Content-Type': 'application/vnd.api+json',
      Accept: 'application/vnd.api+json',
      Authorization: `Bearer ${config.accessToken}`,
    },
    data,
  }).then(res => {
    return res.data
  })

}


const readDataFile = (file: string): any => {

  let dataFile: string
  let dataJson: any

  try {
    dataFile = readFileSync(file, 'utf-8')
  } catch (error) {
    throw new Error(`Unable to find or open the data file ${clColor.msg.error(file)}`)
  }
  try {
    dataJson = JSON.parse(dataFile)
  } catch (error) {
    throw new Error(`Unable to parse the data file ${clColor.msg.error(file)}: invalid JSON format`)
  }

  const data = dataJson.data ? dataJson : { data: dataJson }

  return data

}


enum Operation {
  Create = 'POST',
  Update = 'PATCH',
}



export { readDataFile, rawRequest, Operation }
