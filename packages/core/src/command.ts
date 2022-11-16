
/** Copy command flags excluding a subset */
const commandFlags = <T extends object>(flags: T, exclude?: string[]): T => {
	const filteredFlags = { ...flags }
	// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
	if (exclude) for (const e of exclude) delete filteredFlags[e as keyof T]
	return filteredFlags
}


export { commandFlags }
