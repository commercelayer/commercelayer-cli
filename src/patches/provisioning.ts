
import { CommerceLayerProvisioningStatic } from "@commercelayer/provisioning-sdk"


export const checkProvisioningCommand = (argv: string[]): string[] => {

	const provisioningResources = CommerceLayerProvisioningStatic.resources()

	const cmdIdx = process.argv.findIndex(a => !a.startsWith('/'))
	const cmd = process.argv[cmdIdx]
	const res = process.argv.find(a => !a.startsWith('/') && (a !== cmd))

	if (res && ['retrieve', 'list', 'create', 'update', 'delete', 'get', 'relationship', 'fetch'].includes(cmd) && provisioningResources.includes(res)) {
		process.argv[cmdIdx] = `provisioning:${cmd}`
	}


	return argv

}
