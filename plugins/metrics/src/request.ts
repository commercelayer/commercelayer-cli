import { clApi, clColor, clConfig } from "@commercelayer/cli-core"
import { analysisOperations, type MetricsOperation, type MetricsResource } from "./common"
import * as cliux from '@commercelayer/cli-ux'


export async function metricsRequest(operation: MetricsOperation, query: any, resource?: MetricsResource, flags?: any): Promise<Response> {

  console.log()
  cliux.action.start(`Performing ${clColor.yellow(operation)} operation ${resource? `on ${clColor.api.resource(resource)}`: ''}`)

  const baseUrl = clApi.baseURL('metrics', flags.organization as string, flags.domain as string)
  const analysisPath = analysisOperations.includes(operation)? 'analysis/' : ''
  const resourcePath = resource? `${resource}/` : ''
  const endpoint = `${baseUrl}/${clConfig.metrics.default_path}/${resourcePath}${analysisPath}${operation}`

  const body = JSON.stringify(query)


  const headers = {
    'Accept': 'application/vnd.api.v1+json',
    'Content-Type': 'application/vnd.api+json',
    'Authorization': `Bearer ${flags.accessToken}`
  }

  const response = fetch(endpoint, {
    method: "POST",
    headers,
    body
  })

  return await response

}
