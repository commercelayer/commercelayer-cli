/**
 * @commercelayer/provisioning-sdk, typed through its ESM declarations.
 *
 * Workaround: the CommonJS declarations of the SDK preview (lib/index.d.cts)
 * end with `export =`, which hides their named exports (CommerceLayerProvisioningStatic,
 * QueryParams, …) from CommonJS code like this plugin. The runtime exports are fine.
 * Remove this module, and import from '@commercelayer/provisioning-sdk' again,
 * once the SDK fixes its CommonJS declarations.
 */
type Sdk = typeof import('@commercelayer/provisioning-sdk', { with: { 'resolution-mode': 'import' } })

const sdk = require('@commercelayer/provisioning-sdk') as Sdk

export const { CommerceLayerProvisioningStatic } = sdk
export default sdk.CommerceLayerProvisioning

export type CommerceLayerProvisioningClient = import('@commercelayer/provisioning-sdk', { with: { 'resolution-mode': 'import' } }).CommerceLayerProvisioningClient
export type QueryPageSize = import('@commercelayer/provisioning-sdk', { with: { 'resolution-mode': 'import' } }).QueryPageSize
export type QueryParams = import('@commercelayer/provisioning-sdk', { with: { 'resolution-mode': 'import' } }).QueryParams
export type QueryParamsList = import('@commercelayer/provisioning-sdk', { with: { 'resolution-mode': 'import' } }).QueryParamsList
export type QueryParamsRetrieve = import('@commercelayer/provisioning-sdk', { with: { 'resolution-mode': 'import' } }).QueryParamsRetrieve
export type RequestObj = import('@commercelayer/provisioning-sdk', { with: { 'resolution-mode': 'import' } }).RequestObj
export type ResourceTypeLock = import('@commercelayer/provisioning-sdk', { with: { 'resolution-mode': 'import' } }).ResourceTypeLock
