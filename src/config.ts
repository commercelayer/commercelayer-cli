import Configstore from 'configstore'
const packageJson = require('../package.json')
import path from 'path'
import fs from 'fs'
import Config from '@oclif/config'

const clicfg = new Configstore(packageJson.name, null, { globalConfigPath: true })
export default clicfg

interface AppKey {
	key: string;
	mode: string;
}


interface AppAuth {
	endpoint: string;
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


export { createConfigDir, configFilePath, tokenFilePath, configFileExists, tokenFileExists, writeConfigFile, writeTokenFile, readConfigFile, readTokenFile }


const currentOrganization = (): string | undefined => {
	const current = clicfg.get(ConfigParams.currentApplication)
	return current?.key
}

const currentModeLive = (): boolean => {
	const current = clicfg.get(ConfigParams.currentApplication)
	return current?.mode === 'live'
}

export { currentOrganization, currentModeLive }


enum ConfigParams {
	currentApplication = 'currentApplication'
}


const configParam = (param: ConfigParams): any => {
	return clicfg.get(param)
}

export { ConfigParams, configParam }
