
export const apiReferenceUrl = 'https://docs.commercelayer.io/developers/v/api-reference'


export type KeyVal = Record<string, string | number | boolean | undefined | null>

export type KeyValString = Record<string, string>

export type KeyValArray = Record<string, string[]>

export type KeyValRel = Record<string, { readonly id: string; readonly type: string | string[] }>

export type KeyValObj = Record<string, any>

export type KeyValSort = Record<string, 'asc' | 'desc'>


export type ResAttributes = KeyValObj



const fixType = (val: string): string | number | boolean | null | undefined => {

  let v: any = val

  if (v === 'null') v = null
  else
    // eslint-disable-next-line eqeqeq
    if (Number(v) == v) v = Number(v)
    else v = (v === 'true') ? true : (v === 'false') ? false : v

  return v

}



export { fixType }
