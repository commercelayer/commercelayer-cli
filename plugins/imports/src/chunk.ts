import type { ImportCreate } from '@commercelayer/sdk'
import { clConfig } from '@commercelayer/cli-core'


type Chunk = ImportCreate & {
  chunk_number: number;
  total_chunks: number;
  start_item: number;
  end_item: number;
  total_items: number;
  group_id: string;
  items_count: number;
  total_batch_chunks: number;
  total_batch_items: number;
}

type Batch = {
  batch_number: number;
  total_batches: number;
  chunks: Chunk[];
  items_count: number;
}

type InputFormat = 'csv' | 'json'



const splitImports = (imp: ImportCreate, format: InputFormat, size?: number): Chunk[] => {

  const chunks: Chunk[] = []
  if (!imp?.inputs || (imp.inputs.length === 0)) return chunks

  const chunkSize = size || clConfig.imports.max_size

  const header = (format === 'csv') ? imp.inputs.shift() : undefined  // Extract file header
  const allInputs = imp.inputs
  const totalItems = imp.inputs.length
  const groupId = generateGroupUID()

  let chunkNum = 0
  while (allInputs.length > 0) {
    const inputs = allInputs.splice(0, chunkSize)
    const inputsCount = inputs.length
    if ((format === 'csv') && header) inputs.unshift(header) // CSV inputs must have an header
    chunks.push({
      format,
      chunk_number: ++chunkNum,
      resource_type: imp.resource_type,
      parent_resource_id: imp.parent_resource_id,
      // cleanup_records: (chunkNum === 1) ? imp.cleanup_records : false,
      start_item: 0,
      end_item: 0,
      total_chunks: 0,
      total_items: totalItems,
      inputs,
      group_id: groupId,
      items_count: inputsCount,
      total_batch_chunks: 0,
      total_batch_items: totalItems
    })
  }

  return chunks.map(c => {
    c.start_item = ((c.chunk_number - 1) * chunkSize) + 1
    c.end_item = (c.start_item + c.items_count) - 1
    c.total_chunks = chunks.length
    // c.items_count = c.inputs.length
    return c
  })

}


const splitChunks = (chunks: Chunk[], size: number): Batch[] => {

  const totalChunks = chunks.length
  const totalBatches = Math.ceil(totalChunks / size)
  const batches: Batch[] = []
  let batch: Batch = { batch_number: 0, total_batches: 0, chunks: [], items_count: 0 }

  let bc = 0	// Batch count
  let cc = 0	// Chunk count
  let tc = 0	// Total chunk count

  for (const chunk of chunks) {

    cc++
    tc++

    if (cc === 1) batches.push(
      batch = {
        batch_number: ++bc,
        total_batches: totalBatches,
        chunks: [],
        items_count: 0,
      })

    batch.chunks.push(chunk)
    batch.items_count += chunk.items_count

    if ((cc === size) || (tc === totalChunks)) {
      cc = 0
      for (const c of batch.chunks) {
        c.total_batch_chunks = batch.chunks.length
        c.total_batch_items = batch.items_count
      }
    }

  }

  return batches

}


const generateGroupUID = (): string => {

  const firstPart = Math.trunc(Math.random() * 46_656)
  const secondPart = Math.trunc(Math.random() * 46_656)
  const firstPartStr = ('000' + firstPart.toString(36)).slice(-3)
  const secondPartStr = ('000' + secondPart.toString(36)).slice(-3)

  return firstPartStr + secondPartStr

}


export { splitImports, splitChunks }
export type { Chunk, Batch }
