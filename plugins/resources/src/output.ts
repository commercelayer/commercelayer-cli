
import { writeFileSync } from 'fs'
import { clOutput } from '@commercelayer/cli-core'


const formatOutput = (out: any, flags?: any, { color = true } = {}): string => {
	return clOutput.formatOutput(out, flags, { color })
}


const exportOutput = async (output: any, flags: any, filePath: string): Promise<boolean> => {
	const out = formatOutput(output, flags, { color: false })
	writeFileSync(filePath, out)
	return await Promise.resolve(true)
}



export { formatOutput, exportOutput }
