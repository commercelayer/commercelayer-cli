import Configstore from 'configstore'
import path from 'path'
import fs from 'fs'
import Config, { IConfig } from '@oclif/config'
import type { ApiMode } from './common'
import { AuthScope, ClientId, ClientSecret } from '@commercelayer/js-auth'

const packageJson = require('../package.json')


const clicfg = new Configstore(packageJson.name, null, { globalConfigPath: true })
export default clicfg


const fixed = {
	applicationsDir: 'applications',
	configSuffix: 'config.json',
	tokenSuffix: 'token.json',
	encoding: 'utf-8',
}


interface AppKey {
	key: string;
	mode: ApiMode;
	id?: string;
	alias?: string;
}


interface AppAuth {
	slug: string;
	domain?: string;
	clientId: ClientId;
	clientSecret?: ClientSecret;
	scope?: AuthScope;
	email?: string;
	password?: string;
}

interface AppInfo extends AppKey, AppAuth {
	organization: string;
	kind: string;
	name: string;
	baseUrl?: string;
}

export { AppKey, AppAuth, AppInfo }


const configDir = (config: IConfig): string => {
	return path.join(config.configDir, fixed.applicationsDir)
}

const createConfigDir = (config: Config.IConfig): void => {
	fs.mkdirSync(configDir(config), { recursive: true })
}


const configFilePath = (config: Config.IConfig, { key }: AppKey): string => {
	return path.join(configDir(config), `${key}.${fixed.configSuffix}`)
}

const tokenFilePath = (config: Config.IConfig, { key }: AppKey): string => {
	return path.join(configDir(config), `${key}.${fixed.tokenSuffix}`)
}


const configFileExists = (config: Config.IConfig, app: AppKey): boolean => {
	const filePath = configFilePath(config, app)
	return fs.existsSync(filePath)
}

const tokenFileExists = (config: Config.IConfig, app: AppKey): boolean => {
	const filePath = tokenFilePath(config, app)
	return fs.existsSync(filePath)
}


const writeConfigFile = (config: Config.IConfig, app: AppInfo): void => {
	const filePath = configFilePath(config, app)
	fs.writeFileSync(filePath, JSON.stringify(app, null, 4))
}

const writeTokenFile = (config: Config.IConfig, app: AppKey, token: any): void => {
	const filePath = tokenFilePath(config, app)
	fs.writeFileSync(filePath, JSON.stringify(token, null, 4))
}

const readConfigFile = (config: Config.IConfig, app: AppKey): AppInfo => {
	const filePath = configFilePath(config, app)
	const cliConfig = fs.readFileSync(filePath, { encoding: fixed.encoding })
	return JSON.parse(cliConfig)
}

const readTokenFile = (config: Config.IConfig, app: AppKey): any => {
	const filePath = tokenFilePath(config, app)
	const token = fs.readFileSync(filePath, { encoding: fixed.encoding })
	return JSON.parse(token)
}

const deleteConfigFile = (config: Config.IConfig, app: AppKey): boolean => {
	const filePath = configFilePath(config, app)
	fs.unlinkSync(filePath)
	return true
}

const deleteTokenFile = (config: Config.IConfig, app: AppKey): boolean => {
	const filePath = tokenFilePath(config, app)
	fs.unlinkSync(filePath,)
	return true
}

const readConfigDir = (config: Config.IConfig, filter: { key?: string }): AppInfo[] => {

	const files = fs.readdirSync(configDir(config)).map(f => {

		const fc = f.split('.')

		if (fc.length !== 3) return undefined
		if (fc[fc.length - 2] !== 'config') return undefined
		if (fc[fc.length - 1] !== 'json') return undefined

		const key = fc[0]

		if (filter.key && (key !== filter.key)) return undefined

		return { key }

	}).filter(f => f)

	return files.map(f => {
		return readConfigFile(config, f as AppKey)
	})

}


export { createConfigDir, readConfigDir, configDir }
export { configFilePath, configFileExists, writeConfigFile, readConfigFile, deleteConfigFile }
export { tokenFilePath, tokenFileExists, writeTokenFile, readTokenFile, deleteTokenFile }



const currentApplication = (app?: AppInfo): AppInfo | undefined => {
	if (app) clicfg.set(ConfigParams.currentApplication, {
		key: app.key,
		id: app.id,
		name: app.name,
		slug: app.slug,
		domain: app.domain,
		kind: app.kind,
		mode: app.mode,
		organization: app.organization,
		scope: app.scope,
		email: app.email,
		alias: app.alias,
	})
	return clicfg.get(ConfigParams.currentApplication)
}

const currentOrganization = (): string | undefined => {
	const current = clicfg.get(ConfigParams.currentApplication)
	return current?.slug
}


export { currentApplication, currentOrganization }



enum ConfigParams {
	currentApplication = 'currentApplication',
	commandRetention = 'commandRetention',
	applicationTypeCheck = 'applicationTypeCheck',
	test = 'test',
}

enum ConfigParamsEditable {
	test,
	commandRetention
}

const defaultConfig: any = {
	test: 'defaultTestValue',
	commandRetention: 30,	// days of retention
	applicationTypeCheck: ['cli', 'sales_channel', 'integration'],
}



const paramEditable = (param: ConfigParams): boolean => {
	return (Object.keys(ConfigParamsEditable).includes(param))
}

const paramExists = (param: string): boolean => {
	return (Object.keys(ConfigParams).includes(param))
}

const paramDefault = (param: ConfigParamsEditable) => {
	return defaultConfig[param]
}

const configParam = (param: ConfigParams, value?: any): any => {
	if (value) {
		if (!paramEditable(param)) throw new Error(`Parameter ${param} is not editable`)
		clicfg.set(param, value)
	}
	return clicfg.get(param) || paramDefault(param as unknown as ConfigParamsEditable)
}


export { ConfigParams, ConfigParamsEditable }
export { configParam, paramEditable, paramExists, paramDefault }
