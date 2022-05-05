
export const apiReferenceUrl = 'https://docs.commercelayer.io/developers/v/api-reference'


export type KeyVal = { [key: string]: string | number | boolean | undefined | null }

export type KeyValString = { [key: string]: string }

export type KeyValArray = { [key: string]: string[] }

export type KeyValRel = { [key: string]: { readonly id: string; readonly type: string } }

export type KeyValObj = { [key: string]: any }

export type KeyValSort = { [key: string]: 'asc' | 'desc' }



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
