/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { json2csv } from 'json-2-csv'
import { writeFileSync } from 'fs'
import { type KeyValString, clOutput } from '@commercelayer/cli-core'



const formatCsv = (obj: object[], flags?: any): string => {
  return clOutput.printCSV(obj, flags)
}


const analyzeItem = (name: string | undefined, item: object, flags: any): Set<string> => {

  const keys = new Set<string>()

  if (item)
    if (Array.isArray(item)) {
      for (const i of item) {
        const ks = analyzeItem(name, i, flags)
        ks.forEach(k => keys.add(k))
      }
    } else if (typeof item === 'object') {

      const type = (item as { type: string }).type
      const fields: string[] = []
      flags.fields.forEach((f: string) => {
        if (!name && (!f.includes('/'))) fields.push(...f.split(','))
        else if (type && f.startsWith(type + '/')) fields.push(...f.substring(f.indexOf('/') + 1).split(','))
      })

      for (const [k, v] of Object.entries(item)) {
        // exclude 'type' fields
        if (k === 'type') continue
        // exclude 'id' fields that are not explicitly included
        if ((k === 'id') && !fields.includes(k)) continue
        const ks = analyzeItem(`${name ? name + '.' : ''}${k}`, v, flags)
        ks.forEach(k => keys.add(k))
      }

    } else if (name && (name !== 'type') && !name.endsWith('.type')) {
      // 'type' field can't be included in CLI filter but is always included in API response
      keys.add(name)
    }

  return keys

}


const exportCsv = async (output: any, flags: any, path: string): Promise<boolean> => {

  // Rename header fields
  const header: KeyValString = {}
  if (flags.header) {
    flags.header.join(',').split(',').forEach((h: string) => {
      const ft = h.split(':')
      header[ft[0]] = ft[1]
    })
  }

  // Include fields
  const keys = analyzeItem(undefined, output, flags)
  const includeKeys = [...keys].map(k => {
    return { field: k, title: header[k] || k }
  })

  // Exclude fields
  const excludeKeys: string[] = []
  if (flags.fields) {
    if (!flags.fields.includes('id')) excludeKeys.push('id')
    if (!flags.fields.includes('type')) excludeKeys.push('type')
  }
  if (flags.include) {
    const include: string[] = []
    flags.include.forEach((i: string) => include.push(...i.split(',')))
    include.forEach((i: string) => {
      // excludeKeys.push(`${i}.id`)
      excludeKeys.push(`${i}.type`)
    })
  }

  // Delimiter
  let delimiter = flags.delimiter || ','
  if (delimiter && (delimiter === 'TAB')) delimiter = '\t'


  const csv = json2csv(output, {
    excelBOM: true,
    expandArrayObjects: true,
    prependHeader: true,
    sortHeader: false,
    unwindArrays: true,
    useDateIso8601Format: true,
    emptyFieldValue: '',
    // excludeKeys,
    keys: includeKeys,
    delimiter: {
      field: delimiter,
    },
  })

  writeFileSync(path, csv)

  return await Promise.resolve(true)

}



export { formatCsv, exportCsv }
