import { ImportCreate } from '@commercelayer/sdk/lib/resources/imports'
import apiConf from './api-conf'

type Chunk = ImportCreate & {
	chunk_number: number;
	total_chunks: number;
	start_item: number;
	end_item: number;
	total_items: number;
	group_id: string;
	items_count: number;
}


const splitImports = (imp: ImportCreate, size?: number): Array<Chunk> => {

	const chunks: Array<Chunk> = []
	if (!imp || !imp.inputs || (imp.inputs.length === 0)) return chunks

	const chunkSize = size || apiConf.imports_max_size

	const allInputs = imp.inputs
	const totalItems = imp.inputs.length
	const groupId = generateGroupUID()

	let chunkNum = 0
	while (allInputs.length) chunks.push({
		resource_type: imp.resource_type,
		parent_resource_id: imp.parent_resource_id,
		cleanup_records: (++chunkNum === 1) ? imp.cleanup_records : false,
		chunk_number: chunkNum,
		start_item: 0,
		end_item: 0,
		total_chunks: 0,
		total_items: totalItems,
		inputs: allInputs.splice(0, chunkSize),
		group_id: groupId,
		items_count: 0,
	})

	return chunks.map(c => {
		c.start_item = ((c.chunk_number - 1) * chunkSize) + 1
		c.end_item = (c.start_item + c.inputs.length) - 1
		c.total_chunks = chunks.length
		c.items_count = c.inputs.length
		return c
	})

}


const generateGroupUID = () => {

	const firstPart = (Math.random() * 46656) | 0
	const secondPart = (Math.random() * 46656) | 0
	const firstPartStr = ('000' + firstPart.toString(36)).slice(-3)
	const secondPartStr = ('000' + secondPart.toString(36)).slice(-3)

	return firstPartStr + secondPartStr

}


export { Chunk, splitImports }
