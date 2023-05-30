import type { CleanupCreate } from '@commercelayer/sdk'
import { clConfig } from '@commercelayer/cli-core'
import type { QueryFilter } from '@commercelayer/sdk/lib/cjs/query';


type Chunk = CleanupCreate & {
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


const splitRecords = async (resSdk: any, clp: CleanupCreate, size?: number): Promise<Chunk[]> => {

  const chunks: Chunk[] = []

  const chunkSize = size || clConfig.cleanups.max_size


  const totalItems = await resSdk.count(clp.filters as QueryFilter)

  const groupId = generateGroupUID()

  if (totalItems <= chunkSize) {
    chunks.push({
      chunk_number: 1,
      resource_type: clp.resource_type,
      filters: clp.filters,
      start_item: 1,
      end_item: totalItems,
      total_chunks: 1,
      total_items: totalItems,
      group_id: groupId,
      items_count: totalItems,
      total_batch_chunks: 0,
      total_batch_items: totalItems
    })
  }


  /*
  const totalItems = clp.inputs.length
  const groupId = generateGroupUID()

  let chunkNum = 0
  while (allInputs.length > 0) chunks.push({
    chunk_number: ++chunkNum,
    resource_type: clp.resource_type,
    filters: clp.filters,
    start_item: 0,
    end_item: 0,
    total_chunks: 0,
    total_items: totalItems,
    group_id: groupId,
    items_count: 0,
    total_batch_chunks: 0,
    total_batch_items: totalItems,
  })
  */

  return chunks

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


export { splitRecords, splitChunks }
export type { Chunk, Batch }
