
/** Copy command flags excluding a subset */
const commandFlags = <T extends object>(flags: T, exclude?: string[]): T => {
	const filteredFlags = { ...flags }
	// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
	if (exclude) for (const e of exclude) delete filteredFlags[e as keyof T]
	return filteredFlags
}


export { commandFlags }



export type KeyVal = Record<string, string | number | boolean | undefined | null>

export type KeyValString = Record<string, string>

export type KeyValArray = Record<string, string[]>

export type KeyValRel = Record<string, { readonly type: string; readonly id: string }>

export type KeyValObj = Record<string, any>

export type KeyValSort = Record<string, 'asc' | 'desc'>


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


const fixDashedFlagValue = (argv: string[], flag: any, name?: string): string[] => {

	const TEMP_PREFIX = '____'

	const name_ = flag.name || name
	const char_ = flag.char
	if (!name_ && !char_) return argv

	const n = name_? (name_.startsWith('--')? name_ : `--${name_}`) : undefined
	const c = char_? (flag.char.startsWith('-')? char_ : `-${char_}`) : undefined

	let cidIdx = argv.findIndex(a => {
		return ((c && a.startsWith(c)) || (n && a.startsWith(n)))
	})
	if (cidIdx < 0) return argv
	
	let flagKey = argv[cidIdx]
	let flagValue = ''
	let prefix = ''
	
	if (c && flagKey.startsWith(c)) {
		flagValue = flagKey.replace(c, '').trim()
		flagKey = c
	} else if (n && flagKey.startsWith(n)) {
		flagValue = flagKey.replace(n, '').trim()
		flagKey = n
	} else return argv
	
	if (flagValue.startsWith('=')) {
		flagValue = flagValue.slice(1)
		prefix = flagKey + '='
	}
	else if (!flagValue) flagValue = argv[++cidIdx]

	if (flagValue.startsWith('-') || flagValue.startsWith(TEMP_PREFIX)) {
		const val = flagValue.startsWith(`${TEMP_PREFIX}-`)? flagValue.replace(`${TEMP_PREFIX}-`, '-') : flagValue.replace('-', `${TEMP_PREFIX}-`)
		argv[cidIdx] = prefix + val
	}

	return argv

}


export { fixValueType, findLongStringFlag, fixDashedFlagValue }

