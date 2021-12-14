/* eslint-disable @typescript-eslint/no-explicit-any */

/** Copy command flags excluding a subset */
const commandFlags = <T extends object>(flags: T, exclude?: string[]): T => {
	const filteredFlags = { ...flags }
	if (exclude) for (const e of exclude) delete filteredFlags[e as keyof T]
	return filteredFlags
}


export { commandFlags }
