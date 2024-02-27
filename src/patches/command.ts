
import { clText } from "@commercelayer/cli-core"
import { CommerceLayerProvisioningStatic } from "@commercelayer/provisioning-sdk"


const PROVISIONING = true
const provisioningCommands = ['retrieve', 'list', 'create', 'update', 'delete', 'get', 'relationship', 'fetch']


export const patchCommand = (argv: string[]): string[] => {

	const cmdIdx = process.argv.findIndex(a => !a.startsWith('/'))
	const cmd = process.argv[cmdIdx]
	const res = process.argv.find(a => !a.startsWith('/') && (a !== cmd))

	// Check provisioning command
	if (PROVISIONING && provisioningCommands.includes(cmd)) return patchProvisioningCommand(argv, cmd, cmdIdx, res)

	// Check plugins command
	if (['install', 'uninstall'].includes(cmd)) return patchPluginCommand(argv, cmd, cmdIdx, res)

	// Check update command
	if (['update'].includes(cmd)) return patchUpdateCommand(argv, cmd, cmdIdx, res)

	return argv

}


const patchPluginCommand = (argv: string[], cmd: string, cmdIdx: number, res?: string): string[] => {
	argv[cmdIdx] = `plugins:${cmd}`
	return argv
}


const patchProvisioningCommand = (argv: string[], cmd: string, cmdIdx: number, res?: string): string[] => {

	// Check provisioning resource
	if (res) {

		const provisioningResources = [...CommerceLayerProvisioningStatic.resources()]
		provisioningResources.splice(provisioningResources.indexOf('organizations'), 1)
		provisioningResources.splice(provisioningResources.indexOf('versions'), 1)

		const provisioningResource = provisioningResources.includes(res) || (provisioningResources.includes(clText.pluralize(res)))
		if (provisioningResource) process.argv[cmdIdx] = `provisioning:${cmd}`

	}

	return argv

}


const patchUpdateCommand = (argv: string[], cmd: string, cmdIdx: number, res?: string): string[] => {
	if ((cmd === 'update') && !res) argv[cmdIdx] = `cli:${cmd}`
	return argv
}
