import type { ApiMode, ApiType } from "./api"
import config from "./config"
import type { AuthScope } from "./token"



interface AppKey {
	key: string
	mode: ApiMode
	id?: string
	alias?: string
}


interface AppAuth {
	slug?: string
	domain?: string
	clientId: string
	clientSecret?: string
	scope?: AuthScope
	email?: string
	password?: string
	api?: ApiType,
	assertion?: string
}

interface AppInfo extends AppKey, AppAuth {
	organization?: string
	kind: string
	name: string
	baseUrl?: string
	user?: string
}


export type { AppKey, AppAuth, AppInfo }


/** Build application key */
const appKey = (): string => {
	return Date.now().toString(36)
}


/** Check application key */
const appKeyValid = (appKey: AppKey): boolean => {
	return (appKey.key !== undefined) && (appKey.key !== '')
}


/** Check if two application keys are equal */
const appKeyMatch = (app1?: AppKey, app2?: AppKey): boolean => {
	const a1 = app1 !== undefined
	const a2 = app2 !== undefined
	return (!a1 && !a2) || (a1 && a2 && (app1.key === app2.key))
}


const arrayScope = (scope?: AuthScope): string[] => {
	if (!scope) return []
	if (Array.isArray(scope)) return scope
	const s = scope.replace(/[ ,;]/g, '|').split('|')
	return Array.isArray(s) ? s : [ s ]
}


const isProvisioningApp = (app: AppAuth): boolean => {
	const scope = arrayScope(app.scope)
	return scope.includes(config.provisioning.scope) || (app.api === 'provisioning')
}


export { appKey, appKeyValid, appKeyMatch, arrayScope, isProvisioningApp }
