/**
 * @commercelayer/provisioning-sdk, typed through its ESM declarations.
 *
 * Workaround: the CommonJS declarations of the SDK (lib/index.d.cts, still in 3.0.0)
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
export type ApiVersion = import('@commercelayer/provisioning-sdk', { with: { 'resolution-mode': 'import' } }).ApiVersion

/**
 * The Provisioning API version of the requests. The SDK types require one
 * (2026-05, the only version of provisioning-sdk 3), but the requests stay
 * unversioned (/api/…), as the CLI has always made them: the SDK omits the
 * path segment when the version is undefined.
 */
export const API_VERSION = undefined as unknown as ApiVersion
