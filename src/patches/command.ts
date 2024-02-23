
import { clText } from "@commercelayer/cli-core"
import { CommerceLayerProvisioningStatic } from "@commercelayer/provisioning-sdk"


const PROVISIONING = true
const provisioningCommands = ['retrieve', 'list', 'create', 'update', 'delete', 'get', 'relationship', 'fetch']


export const patchCommand = (argv: string[]): string[] => {

	const cmdIdx = process.argv.findIndex(a => !a.startsWith('/'))
	const cmd = process.argv[cmdIdx]

	// Check provisioning command
	if (PROVISIONING && provisioningCommands.includes(cmd)) return checkProvisioningCommand(cmd, cmdIdx, argv)

	// Check plugins command
	if (['install', 'uninstall'].includes(cmd)) argv[cmdIdx] = `plugins:${cmd}`


	return argv

}


export const checkProvisioningCommand = (cmd: string, cmdIdx: number, argv: string[]): string[] => {

	const res = process.argv.find(a => !a.startsWith('/') && (a !== cmd))

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
