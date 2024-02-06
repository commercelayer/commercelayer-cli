
import { clText } from "@commercelayer/cli-core"
import { CommerceLayerProvisioningStatic } from "@commercelayer/provisioning-sdk"


const provisioningCommands = ['retrieve', 'list', 'create', 'update', 'delete', 'get', 'relationship', 'fetch']


export const checkProvisioningCommand = (argv: string[]): string[] => {

	const cmdIdx = process.argv.findIndex(a => !a.startsWith('/'))
	const cmd = process.argv[cmdIdx]

	// Check provisioning command
	if (provisioningCommands.includes(cmd)) {

		const res = process.argv.find(a => !a.startsWith('/') && (a !== cmd))

		// Check provisioning resource
		if (res) {

			const provisioningResources = [ ...CommerceLayerProvisioningStatic.resources() ]
			provisioningResources.splice(provisioningResources.indexOf('organizations'), 1)
			provisioningResources.splice(provisioningResources.indexOf('versions'), 1)

			const provisioningResource = provisioningResources.includes(res) || (provisioningResources.includes(clText.pluralize(res)))
			if (provisioningResource) process.argv[cmdIdx] = `provisioning:${cmd}`

		}

	}

	return argv

}
