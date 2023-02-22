
/** Copy command flags excluding a subset */
const commandFlags = <T extends object>(flags: T, exclude?: string[]): T => {
	const filteredFlags = { ...flags }
	// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
	if (exclude) for (const e of exclude) delete filteredFlags[e as keyof T]
	return filteredFlags
}


export { commandFlags }



export type KeyVal = { [key: string]: string | number | boolean | undefined | null }

export type KeyValString = { [key: string]: string }

export type KeyValArray = { [key: string]: string[] }

export type KeyValRel = { [key: string]: { readonly id: string; readonly type: string } }

export type KeyValObj = { [key: string]: any }

export type KeyValSort = { [key: string]: 'asc' | 'desc' }


export type ResAttributes = KeyValObj



const fixValueType = (val: string): string | number | boolean | null | undefined => {

  let v: any = val

  if (v === 'null') v = null	// null check
  else
    // eslint-disable-next-line eqeqeq
    if (Number(v) == v) v = Number(v)	// number check
    else v = (v === 'true') ? true : (v === 'false') ? false : v	// boolean check

  return v

}


export { fixValueType }

