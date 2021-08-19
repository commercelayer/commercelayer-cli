import Configstore from 'configstore'
const packageJson = require('../package.json')
import path from 'path'
import fs from 'fs'
import Config from '@oclif/config'

const clicfg = new Configstore(packageJson.name, null, { globalConfigPath: true })
export default clicfg

const SUPER_USER_MODE = 'SBREZZZA'
export { SUPER_USER_MODE }

interface AppKey {
	key: string;
	mode: string;
}


interface AppAuth {
	baseUrl: string;
	clientId: string;
	clientSecret: string;
}

interface AppInfo extends AppKey, AppAuth {
	organization: string;
	slug: string;
	type: string;
	name: string;
}

export { AppKey, AppAuth, AppInfo }


const createConfigDir = (config: Config.IConfig): void => {
	fs.mkdirSync(config.configDir, { recursive: true })
}

const configFilePath = (config: Config.IConfig, { key, mode }: AppKey): string => {
	return path.join(config.configDir, `${key}.${mode}.config.json`)
}

const tokenFilePath = (config: Config.IConfig, { key, mode }: AppKey): string => {
	return path.join(config.configDir, `${key}.${mode}.token.json`)
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


export { createConfigDir }
export { configFilePath, configFileExists, writeConfigFile, readConfigFile, deleteConfigFile }
export { tokenFilePath, tokenFileExists, writeTokenFile, readTokenFile, deleteTokenFile }

const currentApplication = (): AppKey | undefined => {
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
	test = 'test',
}

enum ConfigParamsEditable {
	test,
	commandRetention
}

const defaultConfig: any = {
	test: 'defaultTestValue',
	commandRetention: 30,	// days of retention
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
	if (value && paramEditable(param)) clicfg.set(param, value)
	return clicfg.get(param) || paramDefault(param as unknown as ConfigParamsEditable)
}


export { ConfigParams, ConfigParamsEditable }
export { configParam, paramEditable, paramExists, paramDefault }
