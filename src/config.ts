import Configstore from 'configstore'
const packageJson = require('../package.json')
import path from 'path'
import fs from 'fs'
import Config from '@oclif/config'
import type { ApiMode } from './common'
import { AuthScope, ClientId, ClientSecret } from '@commercelayer/js-auth/dist/typings'


const clicfg = new Configstore(packageJson.name, null, { globalConfigPath: true })
export default clicfg


interface AppKey {
	key: string;
	mode: ApiMode;
	id: string;
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


const createConfigDir = (config: Config.IConfig): void => {
	fs.mkdirSync(config.configDir, { recursive: true })
}

const configFilePath = (config: Config.IConfig, { key, mode, id }: AppKey): string => {
	return path.join(config.configDir, `${key}.${id}.${mode}.config.json`)
}

const tokenFilePath = (config: Config.IConfig, { key, mode, id }: AppKey): string => {
	return path.join(config.configDir, `${key}.${id}.${mode}.token.json`)
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
	const cliConfig = fs.readFileSync(filePath, { encoding: 'utf-8' })
	return JSON.parse(cliConfig)
}

const readTokenFile = (config: Config.IConfig, app: AppKey): any => {
	const filePath = tokenFilePath(config, app)
	const token = fs.readFileSync(filePath, { encoding: 'utf-8' })
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

const readConfigDir = (config: Config.IConfig, filter: { key?: string; mode?: string; id?: string }): AppInfo[] => {

	const files = fs.readdirSync(config.configDir).map(f => {

		const fc = f.split('.')

		const key = fc[0]
		const id = fc[1]
		const mode = fc[2]
		const type = fc[3]
		const ext = fc[4]

		if (fc.length < 5) return undefined
		if (filter.key && (key !== filter.key)) return undefined
		if (filter.id && (id !== filter.id)) return undefined
		if (filter.mode && (mode !== filter.mode)) return undefined
		if (type !== 'config') return undefined
		if (ext !== 'json') return undefined

		return { key, id, mode }

	}).filter(f => f)

	return files.map(f => {
		return readConfigFile(config, f as AppInfo)
	})

}


export { createConfigDir }
export { configFilePath, configFileExists, writeConfigFile, readConfigFile, deleteConfigFile }
export { tokenFilePath, tokenFileExists, writeTokenFile, readTokenFile, deleteTokenFile }
export { readConfigDir }



const currentApplication = (): AppInfo | undefined => {
	return clicfg.get(ConfigParams.currentApplication)
}

const currentOrganization = (): string | undefined => {
	const current = clicfg.get(ConfigParams.currentApplication)
	return current?.key
}

const currentModeLive = (): boolean => {
	const current = clicfg.get(ConfigParams.currentApplication)
	return current?.mode === 'live'
}


export { currentApplication, currentOrganization, currentModeLive }



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
