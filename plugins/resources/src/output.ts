
import fs from 'fs'
import { clOutput } from '@commercelayer/cli-core'


const formatOutput = (out: any, flags?: any, { color = true } = {}) => {
	return clOutput.formatOutput(out, flags, { color })
}


const exportOutput = async (output: any, flags: any, filePath: string): Promise<boolean> => {
	const out = formatOutput(output, flags, { color: false })
	fs.writeFileSync(filePath, out)
	return Promise.resolve(true)
}



export { formatOutput, exportOutput }
