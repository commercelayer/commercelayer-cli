
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


const findLongStringFlag = (args: string[], name: string): { value: string; index: number, single: boolean } | undefined => {

	const flag = name.startsWith('--')? name : `--${name}`

	let value: string
	const index = args.findIndex(arg => arg.startsWith(flag))
	let single = false

	if (index > -1) {
		const val = args[index]
		if (val.includes('=')) {
			const vals = val.split('=')
			value = (vals.length === 2)? vals[1] : ''
			single = true
		} else value = args[index + 1]
		return { value, index, single }
	}
	else return undefined

}


export { fixValueType, findLongStringFlag }

