import type { CleanupCreate } from '@commercelayer/sdk'
import { clConfig } from '@commercelayer/cli-core'


const MAX_QUEUE_LENGTH = clConfig.cleanups.max_queue_length
const MAX_CLEANUP_SIZE = clConfig.cleanups.max_size
export { MAX_QUEUE_LENGTH, MAX_CLEANUP_SIZE }


type Chunk = CleanupCreate & {
  groupId: string,
  chunkNumber: number,
  startId: string,
  endId: string,
  chunkItems: number
}

type Batch = {
  batchNumber: number,
  chunks: Chunk[],
  batchItems: number
}


const splitRecords = async (resSdk: any, clp: CleanupCreate, totalRecords: number): Promise<Chunk[]> => {

  const chunks: Chunk[] = []

  const totChunks = Math.ceil(totalRecords / MAX_CLEANUP_SIZE)

  const groupId = generateGroupUID()

  let startId = null
  let stopId = null
  let chunkPage = 0

  for (let chunkNum = 0; chunkNum < totChunks; chunkNum++) {

    const chunkRecords = Math.min(MAX_CLEANUP_SIZE, totalRecords - (MAX_CLEANUP_SIZE * chunkNum))
    const chunkPages = Math.ceil(chunkRecords / clConfig.api.page_max_size)
    chunkPage += chunkPages

    const chunkLastPage = await resSdk.list({ filters: clp.filters, pageSize: clConfig.api.page_max_size, pageNumber: chunkPage, sort: { id: 'asc' } })

    stopId = chunkLastPage.last()?.id

    const chunk: Chunk = {
      ...clp,
      chunkNumber: chunkNum + 1,
      groupId,
      startId,
      endId: stopId,
      chunkItems: chunkRecords
    }

    chunks[chunkNum] = chunk

    startId = stopId

  }

  return chunks

}


const splitChunks = (chunks: Chunk[]): Batch[] => {

  const totalChunks = chunks.length
  // const totalBatches = Math.ceil(totalChunks / size)
  const batches: Batch[] = []
  let batch: Batch = { batchNumber: 0, chunks: [], batchItems: 0 }

  let bc = 0	// Batch count
  let cc = 0	// Chunk count
  let tc = 0	// Total chunk count

  for (const chunk of chunks) {

    cc++
    tc++

    if (cc === 1) batches.push(
      batch = {
        batchNumber: ++bc,
        // total_batches: totalBatches,
        chunks: [],
        batchItems: 0,
      })

    batch.chunks.push(chunk)
    batch.batchItems += chunk.chunkItems

    if ((cc === MAX_QUEUE_LENGTH) || (tc === totalChunks)) {
      cc = 0
      /*
      for (const c of batch.chunks) {
        c.total_batch_chunks = batch.chunks.length
        c.total_batch_items = batch.items_count
      }
      */
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
