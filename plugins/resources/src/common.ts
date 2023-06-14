import { clCommand } from "@commercelayer/cli-core"


export type KeyVal = Record<string, string | number | boolean | undefined | null>

export type KeyValString = Record<string, string>

export type KeyValArray = Record<string, string[]>

export type KeyValRel = Record<string, { readonly type: string; readonly id: string }>

export type KeyValObj = Record<string, any>

export type KeyValSort = Record<string, 'asc' | 'desc'>


export type ResAttributes = KeyValObj



const fixType = (val: string): string | number | boolean | null | undefined => {

  /*
  let v: any = val

  if (v === 'null') v = null
  else
    // eslint-disable-next-line eqeqeq
    if (Number(v) == v) v = Number(v)
    else v = (v === 'true') ? true : (v === 'false') ? false : v

  return v
  */

  return clCommand.fixValueType(val)

}



export { fixType }
